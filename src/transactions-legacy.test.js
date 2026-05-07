import { processTransactions } from './transactions-legacy.js';

describe('processTransactions - Characterization Tests', () => {
  describe('Zone 1: Default options handling', () => {
    it('should use EUR as default currency when not specified', () => {
      const txs = [{ id: 1, date: '2026-05-07', label: 'Test', amount: 100, type: 'debit' }];
      const result = processTransactions(txs, {});
      expect(result.transactions[0].currency).toBe('EUR');
    });

    it('should use current month as default when not specified', () => {
      const now = new Date();
      const txs = [{ id: 1, date: now.toISOString(), label: 'Test', amount: 100, type: 'debit' }];
      const result = processTransactions(txs, {});
      expect(result.transactions.length).toBe(1);
    });

    it('should use current year as default when not specified', () => {
      const now = new Date();
      const txs = [{ id: 1, date: now.toISOString(), label: 'Test', amount: 100, type: 'debit' }];
      const result = processTransactions(txs, {});
      expect(result.transactions.length).toBe(1);
    });

    it('should use 1000 as default threshold when not specified', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Expensive item', amount: 1500, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.warnings.length).toBe(1);
    });

    it('should apply custom threshold when provided', () => {
      const txs = [{ id: 1, date: '2026-05-07', label: 'Item', amount: 500, type: 'debit' }];
      const result = processTransactions(txs, { month: 4, year: 2026, threshold: 400 });
      expect(result.warnings.length).toBe(1);
    });
  });

  describe('Zone 2: Currency conversion', () => {
    it('should convert USD to EUR with rate 0.92', () => {
      const txs = [
        {
          id: 1,
          date: '2026-05-07',
          label: 'USD transaction',
          amount: 100,
          type: 'debit',
          currency: 'USD',
        },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026, currency: 'EUR' });
      expect(result.transactions[0].amount).toBeCloseTo(92, 1);
    });

    it('should convert EUR to USD with rate 1.08', () => {
      const txs = [
        {
          id: 1,
          date: '2026-05-07',
          label: 'EUR to USD',
          amount: 100,
          type: 'debit',
          currency: 'EUR',
        },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026, currency: 'USD' });
      expect(result.transactions[0].amount).toBeCloseTo(108, 1);
    });

    it('should convert GBP to EUR with rate 1.17', () => {
      const txs = [
        {
          id: 1,
          date: '2026-05-07',
          label: 'GBP transaction',
          amount: 100,
          type: 'debit',
          currency: 'GBP',
        },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026, currency: 'EUR' });
      expect(result.transactions[0].amount).toBeCloseTo(117, 1);
    });

    it('should apply rate 1 as fallback for unknown currency conversion', () => {
      const txs = [
        {
          id: 1,
          date: '2026-05-07',
          label: 'Unknown currency',
          amount: 100,
          type: 'debit',
          currency: 'CHF',
        },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026, currency: 'EUR' });
      expect(result.transactions[0].amount).toBe(100);
    });

    it('should not convert if currency matches target currency', () => {
      const txs = [
        {
          id: 1,
          date: '2026-05-07',
          label: 'EUR transaction',
          amount: 100,
          type: 'debit',
          currency: 'EUR',
        },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026, currency: 'EUR' });
      expect(result.transactions[0].amount).toBe(100);
    });
  });

  describe('Zone 3: Categorization', () => {
    it('should categorize "loyer" as logement', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Paiement loyer', amount: 100, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.transactions[0].category).toBe('logement');
    });

    it('should categorize "courses" as alimentation', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Courses Carrefour', amount: 50, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.transactions[0].category).toBe('alimentation');
    });

    it('should categorize "salaire" as revenu', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Salaire mensuel', amount: 2000, type: 'credit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.transactions[0].category).toBe('revenu');
    });

    it('should default to "autre" for unknown label', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Xyz transaction', amount: 100, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.transactions[0].category).toBe('autre');
    });
  });

  describe('Zone 4: Aggregations and calculations', () => {
    it('should calculate total balance correctly', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Income', amount: 1000, type: 'credit' },
        { id: 2, date: '2026-05-08', label: 'Expense', amount: 200, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.total).toBeCloseTo(800, 1);
    });

    it('should separate credit and debit totals', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Income', amount: 1000, type: 'credit' },
        { id: 2, date: '2026-05-08', label: 'Expense', amount: 200, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.totalCredit).toBe(1000);
      expect(result.totalDebit).toBe(200);
    });

    it('should calculate average credit and debit', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Income 1', amount: 1000, type: 'credit' },
        { id: 2, date: '2026-05-08', label: 'Income 2', amount: 500, type: 'credit' },
        { id: 3, date: '2026-05-09', label: 'Expense', amount: 100, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.avgCredit).toBeCloseTo(750, 1);
      expect(result.avgDebit).toBeCloseTo(100, 1);
    });

    it('should count credit and debit transactions', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'Income 1', amount: 1000, type: 'credit' },
        { id: 2, date: '2026-05-08', label: 'Income 2', amount: 500, type: 'credit' },
        { id: 3, date: '2026-05-09', label: 'Expense', amount: 100, type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.nbCredit).toBe(2);
      expect(result.nbDebit).toBe(1);
    });
  });

  describe('Zone 5: Data validation', () => {
    it('should reject transactions with invalid type', () => {
      const txs = [{ id: 1, date: '2026-05-07', label: 'Invalid', amount: 100, type: 'invalid' }];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('invalid type');
    });

    it('should reject transactions with missing amount', () => {
      const txs = [{ id: 1, date: '2026-05-07', label: 'No amount', type: 'debit' }];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('no amount');
    });

    it('should reject transactions with non-number amount', () => {
      const txs = [
        { id: 1, date: '2026-05-07', label: 'String amount', amount: 'hundred', type: 'debit' },
      ];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('amount is not a number');
    });

    it('should reject transactions with negative amount', () => {
      const txs = [{ id: 1, date: '2026-05-07', label: 'Negative', amount: -100, type: 'debit' }];
      const result = processTransactions(txs, { month: 4, year: 2026 });
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('negative amount');
    });
  });
});
