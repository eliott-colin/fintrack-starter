import { expect, test } from '@playwright/test';
import FinTrackPage from './fintrack.page.js';

test('export CSV télécharge un fichier avec la transaction ajoutée', async ({ page }) => {
  const app = new FinTrackPage(page);

  await app.goto();
  await app.addTransaction({
    label: 'Café',
    amount: '3.50',
    category: 'loisirs',
  });

  const csv = await app.exportCsvText();

  expect(csv.startsWith('date,label,amount,category\n')).toBe(true);
  expect(csv).toContain('Café');
  expect(csv).toContain('loisirs');
  expect(csv).toContain('3.5');
});
