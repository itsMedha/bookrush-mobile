# BookRush — frontend system design

Notes on how the app is put together and why. This covers the parts that took actual thought:
the layering, where state lives, and the boundary between the UI and the data it renders.

## Overview

BookRush is quick commerce for books. The core loop is: find a book, see whether a store near
you has a copy, buy or rent it, and get it delivered — instantly when it is stocked nearby,
otherwise on standard shipping. Everything else in the app exists to feed that loop.

A reader community sits alongside it. It is a real part of the product, not a bolt-on, but it
is deliberately secondary: its job is to help people find books they can then order, so posts
reference books and those references link straight into the same detail screen search would
reach.

There is no backend. Data comes from a local mock service layer that imitates a network: it
adds latency, throws typed errors, and can be switched into a failing state from Settings. The
point of building it that way was to work on the mobile experience without waiting on an API,
while keeping the seam where an API would go.

## Product scope

Two domains, one catalogue:

```
                    BookRush
                       │
          ┌────────────┴────────────┐
          │                         │
    BOOK COMMERCE            READER COMMUNITY
          │                         │
   ┌──────┴──────┐            ┌─────┴─────┐
   │             │            │           │
Discovery     Delivery       Feed       Clubs
   │             │
Buy / Rent   Instant /
             Standard
                 │
              Orders
                 │
             Tracking
```

The primary flow:

```
Home / Discover
      ↓
Search or browse
      ↓
Book details  ──  availability · price · buy or rent
      ↓
Cart  ──  grouped by delivery speed
      ↓
Checkout  ──  address · delivery · payment
      ↓
Order confirmed
      ↓
Order tracking
```

Community feeds back into it rather than running parallel:

```
Community post
      ↓
Referenced book (price + ETA shown inline)
      ↓
Book details
      ↓
Buy / rent
```

## Delivery and acquisition model

Two decisions shape most of the commerce UI, so both live on the book itself rather than being
worked out at checkout.

**How fast it can arrive** is a tagged union:

```ts
type DeliveryOption =
  | { type: 'INSTANT'; etaMinutes: number }
  | { type: 'STANDARD'; etaText: string }
  | { type: 'UNAVAILABLE' };
```

`INSTANT` carries its own ETA because it depends on which nearby store holds the title — in the
sample catalogue those range from 19 to 55 minutes. Making it a union rather than a boolean
means the "unavailable" case can't be forgotten, and every screen renders it through one
component (`DeliveryAvailability`), so `⚡ 32 min` means the same thing on a card, in search
results, on the detail screen and in the cart.

**How you get it** is buy or rent. Rentals are optional per title (`rental?: { price,
durationDays }`), so sale-only books simply don't show the picker. The chosen mode rides on the
cart line, which is what makes the price, the order summary and the order history line differ.

A basket can mix both fulfilment types. Rather than forcing a single speed, the cart splits
into groups and checkout only offers instant when every item qualifies:

```
canDeliverInstant(items)  → every item is INSTANT
splitByDelivery(items)    → { instant: [...], standard: [...] }
instantEtaRange(items)    → slowest item + a 10 min picking buffer
```

The slowest item decides the quote because one rider collects the whole order.

## Architecture

```
┌─────────────────────────────────┐
│  app/  — Expo Router routes     │  file-based routing, one-line re-exports
├─────────────────────────────────┤
│  Screens                        │  layout + composition, no data fetching logic
├─────────────────────────────────┤
│  Feature components + hooks     │  per-feature UI and query hooks
├─────────────────────────────────┤
│  State: Zustand + TanStack Query│  client state / server-shaped state
├─────────────────────────────────┤
│  Services                       │  the API-shaped boundary
├─────────────────────────────────┤
│  Mock data                      │  swappable for a real backend
└─────────────────────────────────┘
```

What each layer owns:

- **`app/`** — routing only. Every file re-exports a screen from `src/features`, so the route
  tree stays readable and screens stay ordinary components that tests can render directly.
- **Screens** — arrange components and wire callbacks. They call hooks, they don't call services.
- **Feature components/hooks** — the actual UI for one domain, plus its query hooks.
- **State** — see below.
- **Services** — every function here looks like an API call and returns a promise.
- **Data** — plain arrays and maps of sample content.

## Folder layout

```
app/                      routes
src/
  components/
    ui/                   design-system primitives (Button, Text, BottomSheet…)
    books/                book covers, cards, rows, price — used by five features
    commerce/             OrderSummary, OptionCard — shared by cart/checkout/orders
    feedback/             AsyncBoundary, ToastHost
    navigation/           the custom tab bar
    brand/                wordmark
  features/               commerce:  home, discover, books, cart,
                                     checkout, orders, addresses
                          supporting: community, profile, auth
  services/               mock API + query client/keys
  stores/                 Zustand stores
  data/                   sample catalogue, users, posts, clubs, orders
  theme/                  design tokens
  hooks/ utils/ types/    shared helpers
```

A component lives in `src/components` when more than one feature uses it, and in
`src/features/<name>/components` when it doesn't. `BookCover` is shared (home, discover, cart,
orders, community all render books). `CartItemRow` is not — it only makes sense inside the cart.

Tests sit in `__tests__` folders next to the code they cover.

## State management

Three places, picked by how long the state needs to live and who else needs it.

```
React local state        Zustand                  TanStack Query
──────────────────       ──────────────────       ──────────────────
modal visibility         cart contents            books, search results
search input             auth session             community feed + comments
selected tab             saved books, addresses   clubs
filter draft             likes / saves / follows  orders + tracking
                         recent searches
```

**Local state** is the default. A sheet's open/closed flag, the text in a search box, which
profile tab is showing — none of that matters outside the component, so it doesn't leave it.

**Zustand** holds things the client owns and more than one screen reads. The cart is the clear
case: you add from book details, the tab bar badge reacts, and the cart screen reads the same
list. Stores expose selectors (`selectCartCount`, `selectQuantityOf`) so a component subscribes
to the slice it renders instead of the whole store.

Five stores persist through AsyncStorage: `auth`, `cart`, `user`, `community`, `search`. Two
deliberately don't — `toastStore` (a toast shouldn't survive a restart) and `devStore` (the
simulated-offline switch should always start off).

**TanStack Query** owns anything that would come from a server. It handles caching,
loading/error flags, refetching and polling, which is most of what a data layer has to do.
Query keys live in one factory (`services/queryKeys.ts`) so invalidation is targeted.

The split that took the most thought is community: posts come from Query, but _your_ likes and
follows are in Zustand. The like count rendered is the server's baseline plus your own like.
That keeps a tap instant without writing back into the query cache for something the mock
backend doesn't persist anyway.

## Data flow

Loading a book:

```
BookDetailScreen
      ↓ useBook(id)
TanStack Query  ──cache hit? return──┐
      ↓ miss                          │
bookService.getBook(id)               │
      ↓                               │
mockRequest() — latency, offline check│
      ↓                               │
books data  ─────────────────────────┘
      ↓
Book → UI
```

Adding to cart — no network involved, so it doesn't go through Query at all:

```
AddToCartButton
      ↓ add(book, mode)      ← 'buy' or 'rent'
cartStore (Zustand)
      ↓
persisted to AsyncStorage
      ↓
cart badge · cart screen · checkout totals
```

Placing an order crosses both:

```
CheckoutScreen
      ↓ useCreateOrder()
orderService.createOrder()   ← reads cart items from the store
      ↓
new order written to the mock order store
      ↓
query cache updated + invalidated
      ↓
cartStore.clear()  →  redirect to confirmation
```

## Navigation

Expo Router, file-based. The root layout switches between two groups based on session state
using `Stack.Protected`, so there is no manual redirect-on-mount:

```
app/
  _layout.tsx            root stack, auth guard, providers
  (auth)/                welcome · login · signup
  (tabs)/                index(home) · discover · orders · community · profile
  books/[id]             book details
  cart/                  cart
  checkout/              checkout
  confirmation/[id]      post-purchase
  orders/[id]            tracking
  community/create       post composer
  clubs/[id]             club details
  addresses · payments · notifications · settings
```

Modal-ish screens (cart, composer) use `slide_from_bottom`; the rest slide from the right.
Confirmation disables the back gesture — going "back" into a checkout whose cart is now empty
isn't a sensible destination.

Paths are built through `src/utils/routes.ts` rather than string literals scattered in screens.

## UI architecture

```
Design tokens      theme/colors · spacing · typography · radius · shadows · motion
      ↓
UI primitives      Button · Text · Card · BottomSheet · Chip · Skeleton
      ↓
Domain components  BookCover · BookCard · OrderSummary · DeliveryBadge
      ↓
Feature components CartItemRow · OrderTimeline · PostCard
      ↓
Screens            CartScreen · OrderTrackingScreen · CommunityScreen
```

Components take token names rather than raw values:

```tsx
<Text variant="heading2" color="textSecondary" />
<Card padding="lg" shadow="md" />
```

`Text` is the only text primitive in the app — there are no bare `<Text>` imports from React
Native in screens — so every string resolves to a typography token. Same idea for `Icon`,
which wraps Ionicons so icon colour comes from the palette.

Screens are kept to composition. `OrderTrackingScreen` is the busiest one and still reads as a
list of named parts: `TrackingHero`, `OrderTimeline`, `RiderCard`, `OrderItemsList`,
`DeliveryDetailsCard`, `OrderSummary`.

## The mock/API boundary

Everything goes through one function in `services/http.ts`:

```
Screen → hook → service → mockRequest() → sample data
```

`mockRequest` adds a random delay, checks the simulated-offline flag, and throws `ApiError`
with a status when something is wrong. Services return domain objects with related records
already embedded (a feed post arrives with its author and books attached), which is how a real
endpoint for this screen would be shaped.

Replacing the mocks means rewriting the service function bodies. Hooks, screens and components
don't know where the data came from — they already handle latency, errors and retries, because
the mock layer makes those states real during development.

This is a deliberate limitation, not a stub: there is no server, no real auth and no payments.

## Order tracking

An order moves through six states:

```
CONFIRMED → PREPARING → PACKED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
```

The state is a single `OrderStatus` field plus a `timeline` map of the timestamp each stage was
reached. The UI derives everything else from those two: progress is the status index over the
total, the timeline marks stages before the current one as done, and the hero shows copy for
the current stage.

Progression is simulated server-side rather than with a timer in the component. `orderService`
stores when the current stage started, and when an order is read it catches it up to where it
should be by now. So progress continues while you're on another screen, and survives closing
the app. The tracking screen just polls every 2.5s, the way it would against a real endpoint,
and stops polling once the order is delivered.

Express orders run the whole way through. Standard-shipping orders stop at `PACKED` — a
multi-day delivery finishing itself in 30 seconds would look wrong. A "skip to next step"
button exists so the flow can be demoed without waiting.

## Loading, empty and error states

Every data-driven section goes through `AsyncBoundary`, which picks between a skeleton, an
error with a retry button, an empty state, or the content. Having one component decide means
sections can't drift apart in how they behave.

- **Loading** — skeletons shaped like the content they replace, so layout doesn't jump. Refetches
  keep existing data on screen instead of flashing back to a skeleton.
- **Empty** — written for the specific situation. "No books in your cart yet." on the cart,
  "Your reading community is waiting." on an empty Following feed, each with an action that
  leads somewhere useful.
- **Errors** — a short message and a retry button. Failures surface where they happened, so one
  failing rail doesn't blank out the whole of Home.

Turning on "simulate network errors" in Settings puts the whole app into its failure state,
which is also how those paths get exercised by hand.

## Performance

The things actually done, rather than a list of techniques:

- Lists use `FlatList` with `keyExtractor`, `initialNumToRender` and `windowSize` set — the feed,
  book rails and search results.
- Cards that appear in lists (`BookCard`, `BookRow`, `PostCard`, `OrderRow`, `CartItemRow`) are
  memoized, with `useCallback` on the render item so the memo isn't defeated.
- Store selectors keep re-renders narrow. The tab bar badge subscribes to the cart count, not
  the cart.
- `expo-image` handles covers, with `recyclingKey` for list reuse and memory/disk caching. Lists
  request the smaller cover rendition and detail screens the larger one.
- Animations run through Reanimated on the UI thread, so gestures and springs don't depend on
  the JS thread being free.

No benchmarks were run. These are structural choices, not measured wins.

## Accessibility

- Every icon-only control has a label — `IconButton` requires `accessibilityLabel` as a prop, so
  it can't be forgotten.
- Touch targets are at least 44pt.
- Labels describe the state, not just the element: the like button announces "Like, 248 likes"
  or "Unlike, 249 likes".
- The quantity stepper is an `adjustable` with increment/decrement actions rather than two
  unrelated buttons.
- Text scales with Dynamic Type, capped at 1.35x so dense rows stay readable.
- Skeleton pulses and the floating covers on the welcome screen honour "reduce motion".
- Body text meets WCAG AA on its background; the muted greys were picked for that.

## Testing

```
Pure logic        pricing (buy vs rent), instant eligibility, basket splitting, ETA quoting,
                  currency formatting, order status helpers
State             cart store — merging, stock caps, selectors
Services          search ranking, filters, pagination, 404s, offline, the order clock
Components        Button, QuantityStepper, BookCard, DeliveryAvailability, AddToCartButton
Flows             cart screen (totals, quantity, remove + undo, mixed-delivery grouping,
                  buy↔rent switching), login validation, post like/save/follow
```

66 tests. The bias is toward logic that's easy to get wrong and expensive to notice — pricing,
delivery eligibility, stock limits, the order state machine — plus the interactions a user
would actually hit.

Reanimated, gesture handler and vector icons are mocked in `jest.setup.ts`; they need a native
runtime and aren't what these tests are checking.

## Trade-offs

**Mock services instead of a backend.** This version is about the mobile experience. Keeping a
service boundary means the UI doesn't know whether data is local or remote, so adding an API
later doesn't touch screens. The cost is that nothing is really persisted server-side and auth
is theatre.

**Zustand for some state, Query for the rest.** Putting everything in one global store would
have been simpler to explain and worse to live with — server data needs caching, staleness and
refetching, which Query already does. Putting everything in Query would have meant treating the
cart as server state it isn't.

**Expo rather than bare React Native.** Router, image, haptics and the build tooling come as one
working set, and it runs on a phone via Expo Go without a native build. The trade is less room
for custom native code, which this app doesn't need.

**A custom tab bar.** The default one couldn't do the animated pill and the active-order dot,
and a tab bar is small enough to own.

**Delivery as a union, not a boolean.** The earlier model had `expressDelivery: boolean`, which
could not express "available, but in 52 minutes" or "we don't stock this at all". Widening it to
a tagged union cost a refactor across the cart, checkout and order code, but it moved
availability into the type system: every render site has to handle the unavailable case.

**One cart line per book.** Adding a book you already have as a rental switches that line's mode
rather than creating a second line. Allowing both at once would mean keying the cart by
book-and-mode and complicating every quantity and removal path, for a case people rarely want.

**Colocated tests.** Keeping tests beside the code makes it obvious what's covered when you open
a folder, at the cost of a slightly noisier tree than a top-level `tests/`.

**Covers from Open Library.** Real covers make the UI look like a bookstore instead of coloured
rectangles. They're external URLs that can 404, so `BookCover` retries at a different size and
then falls back to a typographic cover.

## What I'd do next

- Replace the service bodies with a real API client; keep the same function signatures.
- Real auth with token refresh and secure storage.
- Server-driven order tracking over a socket instead of polling.
- Move covers behind an image CDN with proper sizing.
- Detox or Maestro for end-to-end flows on a device.
- Crash reporting and basic analytics on the commerce funnel.
