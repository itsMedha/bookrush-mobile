const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const isoOffset = (ms: number) => new Date(Date.now() - ms).toISOString();

export const minutesAgo = (n: number) => isoOffset(n * MINUTE);
export const hoursAgo = (n: number) => isoOffset(n * HOUR);
export const daysAgo = (n: number) => isoOffset(n * DAY);

/** "now", "5m", "3h", "2d", "3w" — compact relative time for feeds. */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  if (diff < MINUTE) return 'now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d`;
  return `${Math.floor(diff / (7 * DAY))}w`;
}

const dateFormatter: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
const timeFormatter: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
};
const weekdayFormatter: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
};

/** "12 Sep" */
export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', dateFormatter);

/** "6:42 PM" */
export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', timeFormatter);

/** "Wed, 23 Sep" */
export const formatWeekdayDate = (date: Date) => date.toLocaleDateString('en-GB', weekdayFormatter);

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY);

/** Time-of-day greeting used on Home. */
export function greetingFor(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
