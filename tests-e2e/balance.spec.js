import { expect, test } from '@playwright/test';
import FinTrackPage from './fintrack.page.js';

test("ajout d'une transaction met à jour le solde", async ({ page }) => {
  const app = new FinTrackPage(page);

  await app.goto();

  const balanceBefore = await app.balanceAmount();

  await app.addTransaction({
    label: 'Café',
    amount: '3.50',
    category: 'loisirs',
  });

  await expect(app.transactionRow('Café')).toBeVisible();
  await expect(app.transactionRow('Café').getByText('- 3.50 €')).toBeVisible();

  const balanceAfter = await app.balanceAmount();
  expect(balanceAfter).toBeCloseTo(balanceBefore - 3.5, 2);
});
