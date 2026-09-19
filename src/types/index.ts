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

export interface Book {
  id: string;
  title: string;
  author: string;
  /** Remote cover. The UI falls back to a typographic cover using `coverColor`. */
  coverUrl: string;
  coverColor: string;
  genre: Genre;
  /** Selling price in INR. */
  price: number;
  /** Maximum retail price in INR. */
  mrp: number;
  rating: number;
  ratingCount: number;
  pages: number;
  publishedYear: number;
  language: string;
  description: string;
  stock: number;
  /** Whether the book can be fulfilled through 30–60 minute express delivery. */
  expressDelivery: boolean;
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

export type DeliveryMethod = 'express' | 'standard';
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
  price: number;
  quantity: number;
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
  /** Minutes until arrival for express orders; 0 once delivered. */
  etaMinutes: number;
  /** Human readable delivery estimate, e.g. "Arrives by Wed, 23 Sep". */
  estimatedDelivery: string;
  rider?: Rider;
}

export interface CartItem {
  book: Book;
  quantity: number;
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
  expressOnly?: boolean;
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
