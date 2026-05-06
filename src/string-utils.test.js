import { reverse, square } from './string-utils.js';

test('reverse "abc" returns "cba"', () => {
  expect(reverse('abc')).toBe('cba');
});

test('reverse non-string throws', () => {
  expect(() => reverse(123)).toThrow('Input must be a string');
});

test('reverse an empty string returns an empty string', () => {
  expect(reverse('')).toBe('');
});

test('reverse " returns "', () => {
  expect(reverse('"')).toBe('"');
});

test('reverse null throws an error', () => {
  expect(() => reverse(null)).toThrow('Input must be a string');
});

test('square 5 returns 25', () => {
  expect(square(5)).toBe(25);
});

test('square non-number throws', () => {
  expect(() => square('abc')).toThrow('Input must be a number');
});

test('square NaN throws', () => {
  expect(() => square(NaN)).toThrow('Input must be a number');
});
