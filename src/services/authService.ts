import { currentUser } from '@/data/users';
import type { Genre, Session } from '@/types';
import { mockRequest } from './http';

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  name: string;
  genres: Genre[];
}

export type SocialProvider = 'apple' | 'google';

const sessionFor = (email: string, name: string): Session => ({
  userId: currentUser.id,
  email: email.trim().toLowerCase(),
  name,
});

/** Mock auth: any well-formed credentials succeed. Swap for a real API client later. */
export const authService = {
  login: ({ email }: LoginInput) =>
    mockRequest(() => sessionFor(email, currentUser.name), { latency: [600, 900] }),

  signup: ({ email, name }: SignupInput) =>
    mockRequest(() => sessionFor(email, name.trim()), { latency: [700, 1000] }),

  socialLogin: (provider: SocialProvider) =>
    mockRequest(() => sessionFor(`${provider}@bookrush.app`, currentUser.name), {
      latency: [500, 800],
    }),

  requestPasswordReset: (email: string) =>
    mockRequest(() => ({ sentTo: email.trim().toLowerCase() }), { latency: [500, 800] }),
};
