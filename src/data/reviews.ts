import type { Review } from '@/types';
import { daysAgo } from '@/utils/date';
import { pickBySeed } from '@/utils/images';
import { CURRENT_USER_ID, readers } from './users';

interface ReviewTemplate {
  rating: number;
  title: string;
  body: string;
}

const templates: ReviewTemplate[] = [
  {
    rating: 5,
    title: 'Could not put it down',
    body: 'Finished it in two sittings. The writing is confident and generous, and I keep thinking about it days later.',
  },
  {
    rating: 5,
    title: 'Worth every page',
    body: 'One of those rare books that lives up to the hype. I have already recommended it to three friends.',
  },
  {
    rating: 4,
    title: 'Thoughtful and well paced',
    body: 'A slow start, then it really finds its feet. The second half is fantastic and the ending lands.',
  },
  {
    rating: 4,
    title: 'Great gift, great read',
    body: 'Arrived quickly and in perfect condition. The book itself is engaging and easy to dip in and out of.',
  },
  {
    rating: 5,
    title: 'Re-reading already',
    body: 'Second read and I am noticing so much more. Highlighted half the book.',
  },
  {
    rating: 3,
    title: 'Good, not life-changing',
    body: 'Solid ideas and clear writing, though I wanted a little more depth in places. Still glad I read it.',
  },
];

/** Deterministic mock reviews: three per book, written by the community. */
export function reviewsForBook(bookId: string): Review[] {
  return [0, 1, 2].map((index) => {
    const template = pickBySeed(templates, `${bookId}-${index}`);
    const author = pickBySeed(readers, `${bookId}-author-${index}`);
    return {
      id: `rev_${bookId}_${index}`,
      bookId,
      authorId: author.id,
      rating: template.rating,
      title: template.title,
      body: template.body,
      createdAt: daysAgo(3 + index * 9),
      helpfulCount: 12 + index * 7,
    };
  });
}

/** Reviews written by the signed-in reader, shown on their profile. */
export const myReviews: Review[] = [
  {
    id: 'rev_me_1',
    bookId: 'atomic-habits',
    authorId: CURRENT_USER_ID,
    rating: 5,
    title: 'Small changes, big shifts',
    body: 'The habit stacking chapter alone was worth the price. I have kept a morning routine going for two months now.',
    createdAt: daysAgo(12),
    helpfulCount: 41,
  },
  {
    id: 'rev_me_2',
    bookId: 'midnight-library',
    authorId: CURRENT_USER_ID,
    rating: 5,
    title: 'Gorgeous and hopeful',
    body: 'A warm, clever story about regret. I finished it with a lump in my throat and a smile.',
    createdAt: daysAgo(30),
    helpfulCount: 28,
  },
  {
    id: 'rev_me_3',
    bookId: 'ikigai',
    authorId: CURRENT_USER_ID,
    rating: 4,
    title: 'Gentle and grounding',
    body: 'Short, calm and full of small rituals worth borrowing. Not a deep dive, but a lovely companion.',
    createdAt: daysAgo(45),
    helpfulCount: 15,
  },
];

/** Bars for the ratings summary: share of 5 → 1 star reviews, derived from the average. */
export function ratingDistribution(average: number): number[] {
  const weights = [1, 2, 3, 4, 5].map((stars) => Math.exp(-1.6 * Math.abs(stars - average - 0.35)));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => weight / total).reverse();
}
