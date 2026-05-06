import exportTransactionsToCsv from './export-csv.js';

describe('exportTransactionsToCsv (simplified)', () => {
  it("commence par l'en-tête et contient les lignes", () => {
    const txs = [
      {
        id: 1,
        date: '2026-05-06',
        label: 'Salaire',
        type: 'credit',
        amount: 1000,
        currency: 'EUR',
      },
      { id: 2, date: '2026-05-07', label: 'Café', type: 'debit', amount: 3.5, currency: 'EUR' },
    ];
    const csv = exportTransactionsToCsv(txs);
    expect(csv.startsWith('id,date,label,type,amount,currency\n')).toBe(true);
    expect(csv).toContain('Salaire');
    expect(csv).toContain('Café');
  });

  it("retourne uniquement l'en-tête pour un tableau vide", () => {
    expect(exportTransactionsToCsv([])).toBe('id,date,label,type,amount,currency\n');
  });

  it('échappe les virgules et guillemets', () => {
    const txs = [
      {
        id: 'a',
        date: '2026-05-06',
        label: 'Repas, resto',
        type: 'debit',
        amount: 12,
        currency: 'EUR',
      },
      {
        id: 'b',
        date: '2026-05-06',
        label: 'Quote"test',
        type: 'debit',
        amount: 5,
        currency: 'EUR',
      },
    ];
    const csv = exportTransactionsToCsv(txs);
    expect(csv).toContain('"Repas, resto"');
    expect(csv).toContain('Quote""test');
  });
});
