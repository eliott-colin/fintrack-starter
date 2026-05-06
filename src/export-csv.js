// export-csv.js
// Utilitaire pour exporter transactions en CSV

function escapeCsv(value) {
  if (value === undefined || value === null) return '';
  const s = String(value);
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function exportTransactionsToCsv(transactions) {
  const headers = ['date', 'label', 'amount', 'category'];
  const lines = [];
  lines.push(headers.join(','));

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return lines.join('\n') + '\n';
  }

  for (const tx of transactions) {
    const row = [
      escapeCsv(tx.date),
      escapeCsv(tx.label),
      escapeCsv(tx.amount),
      escapeCsv(tx.category || ''),
    ];
    lines.push(row.join(','));
  }

  return lines.join('\n') + '\n';
}

export default exportTransactionsToCsv;
