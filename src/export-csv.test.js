import exportTransactionsToCsv from './export-csv.js';

describe('exportTransactionsToCsv', () => {
  it('colonnes: date, label, amount, category', () => {
    const txs = [
      { date: '2026-05-06', label: 'Salaire', amount: 1000, category: 'revenu' },
      { date: '2026-05-07', label: 'Café', amount: 3.5, category: 'loisirs' },
    ];
    const csv = exportTransactionsToCsv(txs);
    expect(csv.startsWith('date,label,amount,category\n')).toBe(true);
    expect(csv).toContain('Salaire');
    expect(csv).toContain('Café');
  });

  it("retourne juste l'en-tête si vide", () => {
    expect(exportTransactionsToCsv([])).toBe('date,label,amount,category\n');
  });

  it('échappe les virgules et guillemets', () => {
    const txs = [
      { date: '2026-05-06', label: 'Repas, resto', amount: 12, category: 'food' },
      { date: '2026-05-07', label: 'Quote"test', amount: 5, category: 'other' },
    ];
    const csv = exportTransactionsToCsv(txs);
    expect(csv).toContain('"Repas, resto"');
    expect(csv).toContain('Quote""test');
  });
});
