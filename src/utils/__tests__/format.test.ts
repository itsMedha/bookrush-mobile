import { discountPercent, formatCount, formatPrice, initialsOf, pluralize } from '../format';

describe('formatPrice', () => {
  it('formats rupees with Indian digit grouping', () => {
    expect(formatPrice(399)).toBe('₹399');
    expect(formatPrice(1047)).toBe('₹1,047');
    expect(formatPrice(123456)).toBe('₹1,23,456');
  });

  it('keeps the sign for negative amounts', () => {
    expect(formatPrice(-151)).toBe('-₹151');
  });
});

describe('formatCount', () => {
  it('abbreviates thousands', () => {
    expect(formatCount(248)).toBe('248');
    expect(formatCount(1000)).toBe('1k');
    expect(formatCount(1284)).toBe('1.3k');
    expect(formatCount(18420)).toBe('18.4k');
  });
});

describe('helpers', () => {
  it('computes discount percentages', () => {
    expect(discountPercent(399, 599)).toBe(33);
    expect(discountPercent(599, 599)).toBe(0);
  });

  it('pluralizes and builds initials', () => {
    expect(pluralize(1, 'book')).toBe('1 book');
    expect(pluralize(3, 'book')).toBe('3 books');
    expect(initialsOf('Medha Singh')).toBe('MS');
    expect(initialsOf('  aanya ')).toBe('A');
  });
});
