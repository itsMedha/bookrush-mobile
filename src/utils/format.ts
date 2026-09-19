/** Indian digit grouping: 1,23,456. */
function groupIndian(value: number): string {
  const digits = Math.abs(Math.round(value)).toString();
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${lastThree}`;
}

export const formatPrice = (amount: number): string =>
  `${amount < 0 ? '-' : ''}₹${groupIndian(amount)}`;

/** 1240 -> "1.2k", 18420 -> "18.4k" */
export function formatCount(count: number): string {
  if (count < 1000) return String(count);
  const thousands = count / 1000;
  return `${thousands >= 10 ? Math.round(thousands * 10) / 10 : thousands.toFixed(1)}k`.replace(
    '.0k',
    'k',
  );
}

export const discountPercent = (price: number, mrp: number): number =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;

export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
