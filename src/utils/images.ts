export type CoverSize = 'thumb' | 'full';

/**
 * Open Library serves `-M` (≈180px) and `-L` (≈500px) renditions.
 * Lists use the small one so scrolling stays cheap; detail screens use the large one.
 */
export function coverSource(url: string, size: CoverSize): string {
  return size === 'thumb' ? url.replace('-L.jpg', '-M.jpg') : url;
}

/** Deterministic pick from a list so mock content is stable between renders. */
export function pickBySeed<T>(items: readonly T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length] as T;
}
