import exportTransactionsToCsv from './export-csv.js';

describe('exportTransactionsToCsv', () => {
  it('colonnes: date, label, amount, category', () => {
    const txs = [
      { date: '2026-05-06', label: 'Salaire', amount: 1000, category: 'revenu' },
      { date: '2026-05-07', label: 'Caf�', amount: 3.5, category: 'loisirs' },
    ];
    const csv = exportTransactionsToCsv(txs);
    expect(csv.startsWith('date,label,amount,category\n')).toBe(true);
    expect(csv).toContain('Salaire');
    expect(csv).toContain('Caf�');
  });

  it("retourne juste l'en-t�te si vide", () => {
    expect(exportTransactionsToCsv([])).toBe('date,label,amount,category\n');
  });

  it('�chappe les virgules et guillemets', () => {
    const txs = [
      { date: '2026-05-06', label: 'Repas, resto', amount: 12, category: 'food' },
      { date: '2026-05-07', label: 'Quote"test', amount: 5, category: 'other' },
    ];
    const csv = exportTransactionsToCsv(txs);
    expect(csv).toContain('"Repas, resto"');
    expect(csv).toContain('Quote""test');
  });

  it('filtre les transactions du mois courant', () => {
    const filterDate = new Date('2026-05-15');
    const txs = [
      { date: '2026-05-06', label: 'Mai 1', amount: 100, category: 'test' },
      { date: '2026-05-20', label: 'Mai 2', amount: 200, category: 'test' },
      { date: '2026-04-15', label: 'Avril', amount: 50, category: 'test' },
    ];
    const csv = exportTransactionsToCsv(txs, filterDate);
    expect(csv).toContain('Mai 1');
    expect(csv).toContain('Mai 2');
    expect(csv).not.toContain('Avril');
  });
});
