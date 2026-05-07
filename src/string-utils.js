export function reverse(str) {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  return str.split('').reverse().join('');
}

export function square(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a number');
  }
  return num * num;
}
