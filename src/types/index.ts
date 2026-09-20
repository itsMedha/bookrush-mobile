export const GENRES = [
  'Fiction',
  'Self Help',
  'Business',
  'Psychology',
  'Science',
  'Technology',
  'Romance',
  'Fantasy',
] as const;

export type Genre = (typeof GENRES)[number];

/**
 * How fast a book can reach the reader right now. `INSTANT` means a nearby fulfilment
 * point has a copy on the shelf, so the ETA varies per title depending on which store
 * holds it.
 */
export type DeliveryOption =
  | { type: 'INSTANT'; etaMinutes: number }
  | { type: 'STANDARD'; etaText: string }
  | { type: 'UNAVAILABLE' };

/** A book can be bought outright or borrowed for a fixed window. */
export type AcquisitionMode = 'buy' | 'rent';

export interface Rental {
  /** Fee in INR for the whole window. */
  price: number;
  durationDays: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  /** Remote cover. The UI falls back to a typographic cover using `coverColor`. */
  coverUrl: string;
  coverColor: string;
  genre: Genre;
  /** Price to own the book, in INR. */
  purchasePrice: number;
  /** Maximum retail price in INR, shown struck through against `purchasePrice`. */
  mrp: number;
  /** Absent when a title is not offered for rent. */
  rental?: Rental;
  delivery: DeliveryOption;
  rating: number;
  ratingCount: number;
  pages: number;
  publishedYear: number;
  language: string;
  description: string;
  stock: number;
}

export interface Review {
  id: string;
  bookId: string;
  authorId: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  helpfulCount: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  bio: string;
}

export type PostKind = 'thought' | 'review' | 'list' | 'photo';

export interface Post {
  id: string;
  authorId: string;
  kind: PostKind;
  body: string;
  createdAt: string;
  bookIds: string[];
  imageUrl?: string;
  /** Baseline like count from the server; the viewer's own like is layered on top. */
  likeCount: number;
  commentCount: number;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export type FeedTab = 'for-you' | 'following' | 'trending';

export interface ClubMessage {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  tagline: string;
  description: string;
  memberCount: number;
  memberIds: string[];
  currentBookId: string;
  nextMeeting: string;
  discussion: ClubMessage[];
}

export const ORDER_STATUSES = [
  'CONFIRMED',
  'PREPARING',
  'PACKED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type DeliveryMethod = 'instant' | 'standard';
export type PaymentMethodId = 'upi' | 'card' | 'cod';

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  coverUrl: string;
  coverColor: string;
  /** What each unit cost at the time of ordering — purchase price or rental fee. */
  unitPrice: number;
  quantity: number;
  mode: AcquisitionMode;
  /** Set for rented lines so history can show the window that was paid for. */
  rentalDays?: number;
}

export interface Pricing {
  itemsTotal: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface Rider {
  name: string;
  rating: number;
  deliveries: number;
  vehicle: string;
}

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  items: OrderItem[];
  address: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethodId;
  pricing: Pricing;
  placedAt: string;
  /** ISO timestamp per reached status. */
  timeline: Partial<Record<OrderStatus, string>>;
  /** Minutes until arrival for instant orders; 0 once delivered. */
  etaMinutes: number;
  /** Human readable delivery estimate, e.g. "Arrives by Wed, 23 Sep". */
  estimatedDelivery: string;
  rider?: Rider;
}

export interface CartItem {
  book: Book;
  quantity: number;
  mode: AcquisitionMode;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
}

export interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  subtitle: string;
}

/** Response shapes — services embed related records the way a real API would. */
export interface FeedPost extends Post {
  author: User;
  books: Book[];
}

export interface CommentWithAuthor extends PostComment {
  author: User;
}

export interface ReviewWithAuthor extends Review {
  author: User;
}

export interface ClubMessageWithAuthor extends ClubMessage {
  author: User;
}

export interface ClubDetail extends Omit<Club, 'discussion'> {
  currentBook: Book;
  members: User[];
  discussion: ClubMessageWithAuthor[];
}

export type SortOption = 'relevance' | 'popular' | 'rating' | 'price-asc' | 'price-desc';

export interface SearchParams {
  query?: string;
  genre?: Genre;
  sort?: SortOption;
  instantOnly?: boolean;
  minRating?: number;
}

export interface Page<T> {
  items: T[];
  nextPage: number | null;
  total: number;
}

export type ClubSummary = Omit<Club, 'discussion'>;

export interface ReviewWithBook extends Review {
  book: Book;
}
