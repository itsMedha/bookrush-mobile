import type { Club } from '@/types';
import { hoursAgo, minutesAgo } from '@/utils/date';

export const clubs: Club[] = [
  {
    id: 'weekend-readers',
    name: 'Weekend Readers',
    tagline: 'One book, two slow days',
    description:
      'A relaxed club for people who save their reading for the weekend. We pick one novel a fortnight and meet online on Sunday evenings.',
    memberCount: 2481,
    memberIds: ['aanya', 'priya', 'sara', 'meera'],
    currentBookId: 'midnight-library',
    nextMeeting: 'Sunday, 6:00 PM',
    discussion: [
      {
        id: 'm1',
        authorId: 'aanya',
        body: 'Which library would you visit first — the one where you stayed in Bengaluru or the Arctic one?',
        createdAt: minutesAgo(41),
      },
      {
        id: 'm2',
        authorId: 'sara',
        body: 'Honestly the glaciologist life. Give me the cold and the quiet.',
        createdAt: minutesAgo(27),
      },
      {
        id: 'm3',
        authorId: 'priya',
        body: 'Chapter 12 is doing something to my heart. No spoilers please!',
        createdAt: minutesAgo(9),
      },
    ],
  },
  {
    id: 'psychology-and-growth',
    name: 'Psychology & Growth',
    tagline: 'Understand your mind',
    description:
      'Habits, biases and behaviour. We read one book a month and apply one idea to our lives each week.',
    memberCount: 1893,
    memberIds: ['rohan', 'dev', 'ishaan', 'kabir'],
    currentBookId: 'thinking-fast-and-slow',
    nextMeeting: 'Saturday, 11:00 AM',
    discussion: [
      {
        id: 'm4',
        authorId: 'rohan',
        body: 'Anyone else catching System 1 mistakes in their own decisions this week?',
        createdAt: hoursAgo(2),
      },
      {
        id: 'm5',
        authorId: 'dev',
        body: 'Anchoring at the grocery store. Cannot unsee it now.',
        createdAt: hoursAgo(1),
      },
    ],
  },
  {
    id: 'modern-fiction',
    name: 'Modern Fiction',
    tagline: 'Today’s best novelists',
    description:
      'Contemporary literary and genre fiction, from prize winners to breakout debuts. Come for the plot, stay for the arguments.',
    memberCount: 3120,
    memberIds: ['meera', 'aanya', 'ishaan', 'sara'],
    currentBookId: 'klara-and-the-sun',
    nextMeeting: 'Thursday, 8:00 PM',
    discussion: [
      {
        id: 'm6',
        authorId: 'ishaan',
        body: 'Is Klara a narrator we can trust? I keep going back and forth.',
        createdAt: hoursAgo(4),
      },
      {
        id: 'm7',
        authorId: 'meera',
        body: 'She sees everything and understands almost nothing — that is the point.',
        createdAt: hoursAgo(3),
      },
    ],
  },
  {
    id: 'tech-and-business',
    name: 'Tech & Business Books',
    tagline: 'Build, ship, learn',
    description:
      'For engineers, founders and the endlessly curious. We swap notes on craft, product and strategy — and argue about tabs versus spaces.',
    memberCount: 1467,
    memberIds: ['kabir', 'rohan', 'dev', 'ishaan'],
    currentBookId: 'lean-startup',
    nextMeeting: 'Friday, 7:30 PM',
    discussion: [
      {
        id: 'm8',
        authorId: 'kabir',
        body: 'What is the cheapest experiment you ran this month to test an idea?',
        createdAt: hoursAgo(6),
      },
      {
        id: 'm9',
        authorId: 'rohan',
        body: 'A landing page and a waitlist. Two evenings, 300 sign-ups.',
        createdAt: hoursAgo(5),
      },
    ],
  },
];
