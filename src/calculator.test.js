const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  simpleInterest,
  compoundInterest,
  convertCurrency,
} = require('./calculator.js');
describe('add', () => {
  it('retourne 5 quand on additionne 2 et 3', () => {
    expect(add(2, 3)).toBe(5);
  });
});

describe('subtract', () => {
  it('retourne 1 quand on soustrait 3 de 4', () => {
    expect(subtract(4, 3)).toBe(1);
  });
});

describe('multiply', () => {
  it('retourne 6 quand on multiplie 2 par 3', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});

describe('divide', () => {
  it('retourne 2 quand on divise 6 par 3', () => {
    expect(divide(6, 3)).toBe(2);
  });
});

describe('modulo', () => {
  it('retourne 1 quand on fait 7 modulo 3', () => {
    expect(modulo(7, 3)).toBe(1);
  });
});

describe('simpleInterest', () => {
  it("retourne 150 quand on calcule l'intérêt simple de 1000 à 5% pendant 3 ans", () => {
    expect(simpleInterest(1000, 5, 3)).toBe(150);
  });
});

describe('compoundInterest', () => {
  it("retourne 157.625 quand on calcule l'intérêt composé de 1000 à 5% pendant 3 ans", () => {
    expect(compoundInterest(1000, 5, 3)).toBeCloseTo(157.625, 3);
  });
});

describe('convertCurrency', () => {
  it('retourne 85 quand on convertit 100 USD en EUR avec un taux de 0.85', () => {
    expect(convertCurrency(100, 0.85)).toBe(85);
  });
});
