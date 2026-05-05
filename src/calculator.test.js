const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  simpleInterest,
  compoundInterest,
  convertCurrency,
  computeBalance,
  formatAmount,
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

  it('lève une erreur quand on divise par zéro', () => {
    expect(() => divide(6, 0)).toThrow('Impossible de diviser par zéro');
  });

  it("lève une erreur quand le numérateur n'est pas un nombre", () => {
    expect(() => divide('abc', 3)).toThrow(
      'Veuillez fournir des nombres valides pour les deux arguments',
    );
  });

  it("lève une erreur quand le dénominateur n'est pas un nombre", () => {
    expect(() => divide(6, 'abc')).toThrow(
      'Veuillez fournir des nombres valides pour les deux arguments',
    );
  });

  it('lève une erreur quand le numérateur est NaN', () => {
    expect(() => divide(NaN, 3)).toThrow(
      'Veuillez fournir des nombres valides pour les deux arguments',
    );
  });

  it('lève une erreur quand le dénominateur est NaN', () => {
    expect(() => divide(6, NaN)).toThrow(
      'Veuillez fournir des nombres valides pour les deux arguments',
    );
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

describe('computeBalance', () => {
  it('retourne la somme des credits moins les debits', () => {
    const transactions = [
      { amount: 100, type: 'credit' },
      { amount: 50, type: 'debit' },
      { amount: 30, type: 'credit' },
    ];
    expect(computeBalance(transactions)).toBe(80);
  });

  it('retourne 0 pour une liste vide', () => {
    expect(computeBalance([])).toBe(0);
  });

  it("retourne uniquement les credits quand il n'y a pas de debits", () => {
    const transactions = [
      { amount: 100, type: 'credit' },
      { amount: 50, type: 'credit' },
    ];
    expect(computeBalance(transactions)).toBe(150);
  });

  it("retourne le négatif des debits quand il n'y a pas de credits", () => {
    const transactions = [
      { amount: 100, type: 'debit' },
      { amount: 50, type: 'debit' },
    ];
    expect(computeBalance(transactions)).toBe(-150);
  });
});

describe('formatAmount', () => {
  it('formate un montant en EUR par défaut', () => {
    expect(formatAmount(123.456)).toBe('123.46 €');
  });

  it('formate un montant en USD', () => {
    expect(formatAmount(100, 'USD')).toBe('100.00 $');
  });

  it('formate un montant en GBP', () => {
    expect(formatAmount(50.5, 'GBP')).toBe('50.50 £');
  });

  it('formate un montant avec devise inconnue', () => {
    expect(formatAmount(75, 'JPY')).toBe('75.00 JPY');
  });

  it('formate un montant négatif', () => {
    expect(formatAmount(-25.3, 'EUR')).toBe('-25.30 €');
  });
});
