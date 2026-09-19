import { useDevStore } from '@/store/devStore';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number = 0,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const isTest = process.env.NODE_ENV === 'test';

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Stand-in for `fetch`. Every service goes through here so the whole app experiences
 * realistic latency and can be flipped offline from Settings. Replace the body with a
 * real HTTP client and nothing above the services layer needs to change.
 */
export async function mockRequest<T>(
  produce: () => T | Promise<T>,
  { latency = [380, 760] }: { latency?: [number, number] } = {},
): Promise<T> {
  if (!isTest) {
    await new Promise((resolve) => setTimeout(resolve, randomBetween(latency[0], latency[1])));
  }
  if (useDevStore.getState().simulateOffline) {
    throw new ApiError('Network request failed', 0);
  }
  return produce();
}

export const errorMessage = (error: unknown, fallback = 'Something went wrong.'): string =>
  error instanceof Error && error.message ? error.message : fallback;
