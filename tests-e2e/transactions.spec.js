import { expect, test } from '@playwright/test';
import FinTrackPage from './fintrack.page.js';

test('ajouter une transaction complète', async ({ page }) => {
  const app = new FinTrackPage(page);

  await app.goto();
  await app.addTransaction({
    label: 'Café',
    amount: '3.50',
    category: 'loisirs',
  });

  const transactionLine = app.transactionRow('Café');
  await expect(transactionLine.getByText('Café')).toBeVisible();
  await expect(transactionLine.getByText('- 3.50 €')).toBeVisible();
  await expect(transactionLine.getByText('loisirs')).toBeVisible();
});
