let counter = 0;

/** Small unique id — good enough for client-side mock records. */
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`;
}
