import type { Post, PostComment } from '@/types';
import { hoursAgo, minutesAgo, daysAgo } from '@/utils/date';

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

/** Photos offered by the "Add photo" picker in the composer. */
export const samplePhotos: { id: string; uri: string }[] = [
  { id: 'reading-nook', uri: photo('1512820790803-83ca734da794') },
  { id: 'library', uri: photo('1481627834876-b7833e8f5570') },
  { id: 'open-book', uri: photo('1495446815901-a7297e633e8d') },
  { id: 'book-stack', uri: photo('1544947950-fa07a98d237f') },
  { id: 'study', uri: photo('1507842217343-583bb7270b66') },
  { id: 'shelves', uri: photo('1524995997946-a1c2e315a42f') },
];

const uri = (id: string) => samplePhotos.find((item) => item.id === id)?.uri;

export const posts: Post[] = [
  {
    id: 'post_1',
    authorId: 'aanya',
    kind: 'review',
    body: 'Just finished The Midnight Library.\n\nThat ending… I need to sit quietly for a bit. If you have ever wondered about the other lives you could have lived, this one will find you.',
    createdAt: minutesAgo(38),
    bookIds: ['midnight-library'],
    likeCount: 248,
    commentCount: 34,
  },
  {
    id: 'post_2',
    authorId: 'rohan',
    kind: 'list',
    body: '5 books that completely changed how I think about money.',
    createdAt: hoursAgo(3),
    bookIds: [
      'psychology-of-money',
      'rich-dad-poor-dad',
      'thinking-fast-and-slow',
      'zero-to-one',
      'atomic-habits',
    ],
    likeCount: 512,
    commentCount: 76,
  },
  {
    id: 'post_3',
    authorId: 'priya',
    kind: 'photo',
    body: 'Sunday reset: chai, a blanket and Ikigai. The best kind of slow.',
    createdAt: hoursAgo(5),
    bookIds: ['ikigai'],
    imageUrl: uri('reading-nook'),
    likeCount: 389,
    commentCount: 21,
  },
  {
    id: 'post_4',
    authorId: 'meera',
    kind: 'review',
    body: 'Fourth Wing ate my entire weekend. Zero regrets, and I am already hunting for the sequel.',
    createdAt: hoursAgo(8),
    bookIds: ['fourth-wing'],
    likeCount: 431,
    commentCount: 58,
  },
  {
    id: 'post_5',
    authorId: 'kabir',
    kind: 'thought',
    body: 'Chapter 3 of Clean Code rewired how I name functions. A tiny habit with a huge payoff — future me says thanks.',
    createdAt: hoursAgo(11),
    bookIds: ['clean-code'],
    likeCount: 176,
    commentCount: 19,
  },
  {
    id: 'post_6',
    authorId: 'dev',
    kind: 'photo',
    body: 'Deep Work plus phone in another room equals the best 90 minutes of my week.',
    createdAt: hoursAgo(22),
    bookIds: ['deep-work'],
    imageUrl: uri('study'),
    likeCount: 297,
    commentCount: 27,
  },
  {
    id: 'post_7',
    authorId: 'sara',
    kind: 'thought',
    body: 'Hot take: Pride and Prejudice is still the best slow-burn romance ever written. Nothing since has come close.',
    createdAt: daysAgo(1),
    bookIds: ['pride-and-prejudice'],
    likeCount: 654,
    commentCount: 143,
  },
  {
    id: 'post_8',
    authorId: 'aanya',
    kind: 'list',
    body: 'My monsoon reading list — rain on the window required.',
    createdAt: daysAgo(2),
    bookIds: ['normal-people', 'klara-and-the-sun', 'beach-read'],
    likeCount: 233,
    commentCount: 31,
  },
  {
    id: 'post_9',
    authorId: 'ishaan',
    kind: 'thought',
    body: 'Project Hail Mary is the most fun I have had with a science novel in years. Rocky is the best character in fiction and I will not be taking questions.',
    createdAt: daysAgo(2),
    bookIds: ['project-hail-mary'],
    likeCount: 587,
    commentCount: 92,
  },
  {
    id: 'post_10',
    authorId: 'meera',
    kind: 'photo',
    body: 'Library haul. My to-be-read pile has officially become architecture.',
    createdAt: daysAgo(3),
    bookIds: [],
    imageUrl: uri('book-stack'),
    likeCount: 342,
    commentCount: 44,
  },
];

export const commentsSeed: PostComment[] = [
  {
    id: 'c_1',
    postId: 'post_1',
    authorId: 'sara',
    body: 'The ending made me cry on the metro. Worth it.',
    createdAt: minutesAgo(22),
  },
  {
    id: 'c_2',
    postId: 'post_1',
    authorId: 'rohan',
    body: 'Adding it to my list tonight!',
    createdAt: minutesAgo(15),
  },
  {
    id: 'c_3',
    postId: 'post_2',
    authorId: 'kabir',
    body: 'Psychology of Money should be mandatory reading.',
    createdAt: hoursAgo(2),
  },
  {
    id: 'c_4',
    postId: 'post_2',
    authorId: 'priya',
    body: 'Great list. Would add Range too.',
    createdAt: hoursAgo(1),
  },
  {
    id: 'c_5',
    postId: 'post_7',
    authorId: 'aanya',
    body: 'Mr Darcy’s first proposal scene is unmatched.',
    createdAt: hoursAgo(19),
  },
];
