# BookRush

BookRush is a mobile app for discovering books, ordering them for delivery, and talking about
them with other readers. Built with React Native, Expo and TypeScript.

<p align="center">
  <img src="docs/screenshots/home.png" width="24%" alt="Home" />
  <img src="docs/screenshots/book-detail.png" width="24%" alt="Book details" />
  <img src="docs/screenshots/tracking.png" width="24%" alt="Order tracking" />
  <img src="docs/screenshots/community.png" width="24%" alt="Community feed" />
</p>

## Features

- Browse and search books, with categories, sorting and filters
- Book details with ratings, reviews, delivery estimate and recommendations
- Cart and checkout, including address and delivery options
- Order tracking with a live status timeline
- Reader community — posts, likes, comments, and a composer
- Book clubs with a current read and discussion
- Profile with your shelf, reviews, posts and order history

## Tech stack

React Native · Expo · TypeScript · Expo Router · Zustand · TanStack Query ·
React Native Reanimated · React Hook Form · Zod · Jest · React Native Testing Library

## Project structure

```
app/                Routes (Expo Router). Each file re-exports a screen.
src/
  components/       Shared UI — ui/ primitives, books/, commerce/, feedback/
  features/         Feature code: screens, feature components, query hooks
  services/         Data boundary (currently mock) + query client and keys
  stores/           Zustand stores
  data/             Sample catalogue, users, posts, clubs
  theme/            Design tokens
  hooks/ utils/     Shared helpers
  types/            Domain types
docs/               Architecture notes
```

## Architecture

The app is layered: routes → screens → feature components and hooks → state → services → data.
Screens compose components and call hooks; they never call services directly. Anything
server-shaped (books, feed, orders) goes through TanStack Query, while client-owned state (cart,
session, likes) lives in Zustand.

[`docs/frontend-system-design.md`](docs/frontend-system-design.md) goes into the detail — how
state is split and why, the data flow for the main screens, the navigation tree, the design
token layering, how order tracking is simulated, and the trade-offs behind those choices.

## Running locally

```bash
npm install
npx expo start
```

Then press `i` for the iOS simulator, `a` for Android, or scan the QR code with Expo Go.
`npm run web` runs it in a browser.

The login screen comes pre-filled with demo credentials — any valid-looking email and password
will sign you in.

## Scripts

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Jest
npm run validate     # all three, same as CI
```

## Current scope

There is no backend. Data comes from a mock service layer in `src/services` that adds latency
and can be made to fail, so loading, empty and error states are all reachable during
development. The service functions are shaped like API calls, so swapping in a real client
means changing those files and nothing above them.

Order tracking is simulated locally: the order service stores which stage an order is in and
advances it over time, and the tracking screen polls for updates the way it would against a
real endpoint.

Two switches in **Profile → Settings** help when trying the app out — one makes every request
fail so you can see the error states, and one resets the demo data.

## Notes

Book covers are fetched from [Open Library](https://openlibrary.org/) and photos come from
[Unsplash](https://unsplash.com/). The catalogue, users, reviews and orders are sample data.

MIT licensed.
