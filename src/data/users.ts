import type { Address, PaymentMethod, Rider, User } from '@/types';

export const CURRENT_USER_ID = 'me';

const avatar = (n: number) => `https://i.pravatar.cc/200?img=${n}`;

export const currentUser: User = {
  id: CURRENT_USER_ID,
  name: 'Medha Singh',
  handle: 'medha.reads',
  bio: 'Reads on the metro, annotates in pencil. Currently obsessed with habits, money and a good slow-burn.',
};

export const readers: User[] = [
  {
    id: 'aanya',
    name: 'Aanya Kapoor',
    handle: 'aanya.pages',
    avatarUrl: avatar(45),
    bio: 'Fiction first. Tea always.',
  },
  {
    id: 'rohan',
    name: 'Rohan Iyer',
    handle: 'rohan.reads',
    avatarUrl: avatar(12),
    bio: 'Money, markets and mental models.',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    handle: 'priya.nair',
    avatarUrl: avatar(32),
    bio: 'Sunday reading rituals.',
  },
  {
    id: 'kabir',
    name: 'Kabir Malhotra',
    handle: 'kabir.codes',
    avatarUrl: avatar(15),
    bio: 'Engineer. Notebook person.',
  },
  {
    id: 'meera',
    name: 'Meera Shah',
    handle: 'meera.shelves',
    avatarUrl: avatar(49),
    bio: 'Dragons, duels and dark academia.',
  },
  {
    id: 'dev',
    name: 'Dev Patel',
    handle: 'dev.deepwork',
    avatarUrl: avatar(33),
    bio: 'Focus is a muscle.',
  },
  {
    id: 'sara',
    name: 'Sara Khan',
    handle: 'sara.reads',
    avatarUrl: avatar(44),
    bio: 'Classic romance defender.',
  },
  {
    id: 'ishaan',
    name: 'Ishaan Verma',
    handle: 'ishaan.v',
    avatarUrl: avatar(68),
    bio: 'Science, space and sarcasm.',
  },
];

export const users: User[] = [currentUser, ...readers];
export const usersById: ReadonlyMap<string, User> = new Map(users.map((user) => [user.id, user]));

/** Accounts the demo viewer starts out following. */
export const initialFollowingIds = ['aanya', 'rohan', 'meera'];

export const profileStats = { followers: 1284 };

export const seedAddresses: Address[] = [
  {
    id: 'addr_home',
    label: 'Home',
    line1: '221B Baker Street',
    line2: 'Koramangala 4th Block',
    city: 'Bengaluru',
    pincode: '560034',
  },
  {
    id: 'addr_work',
    label: 'Work',
    line1: 'WeWork Galaxy, 43 Residency Road',
    line2: 'Ashok Nagar',
    city: 'Bengaluru',
    pincode: '560025',
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'upi', title: 'Apple Pay / UPI', subtitle: 'medha@okbank · Pay instantly' },
  { id: 'card', title: 'Credit / debit card', subtitle: 'Visa ending 4242' },
  { id: 'cod', title: 'Cash on delivery', subtitle: 'Pay when your books arrive' },
];

export const defaultRider: Rider = {
  name: 'Arjun Mehta',
  rating: 4.9,
  deliveries: 1240,
  vehicle: 'Honda Activa · KA 01 AB 4821',
};
