import { expect } from '@playwright/test';

export function parseAmount(text) {
  return Number(String(text).replace(/[^0-9.-]/g, ''));
}

async function readDownloadAsText(download) {
  const stream = await download.createReadStream();
  if (!stream) {
    throw new Error('Impossible de lire le téléchargement CSV.');
  }

  let content = '';
  for await (const chunk of stream) {
    content += chunk.toString('utf8');
  }

  return content;
}

export default class FinTrackPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.page).toHaveTitle(/FinTrack/);
  }

  balanceValue() {
    return this.page.locator('.card-balance .card-value');
  }

  transactionRow(label) {
    return this.page.locator('li.tx').filter({ hasText: label }).first();
  }

  async openTransactionForm() {
    await this.page.getByRole('button', { name: 'Ajouter une transaction' }).click();
  }

  async fillTransactionForm({ label, amount, category, type = 'debit' }) {
    await this.page.getByLabel('Libellé').fill(label);
    await this.page.getByLabel('Montant').fill(amount);
    await this.page.getByLabel('Type').selectOption(type);
    await this.page.getByLabel('Catégorie').selectOption(category);
  }

  async submitTransaction() {
    await this.page.getByRole('button', { name: 'Valider' }).click();
  }

  async balanceAmount() {
    const text = await this.balanceValue().textContent();
    return parseAmount(text ?? '0');
  }

  async addTransaction(details) {
    await this.openTransactionForm();
    await this.fillTransactionForm(details);
    await this.submitTransaction();
  }

  async exportCsvText() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.getByRole('button', { name: 'Exporter en CSV' }).click();
    const download = await downloadPromise;
    return readDownloadAsText(download);
  }
}
