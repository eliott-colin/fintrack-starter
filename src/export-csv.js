// export-csv.js
// Petite utilitaire pour exporter un tableau de transactions en CSV.

function escapeCsv(value) {
  if (value === undefined || value === null) return '';
  const s = String(value);
  // Si contient double-quote, échappe en doublant
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function exportTransactionsToCsv(transactions) {
  const headers = ['id', 'date', 'label', 'type', 'amount', 'currency'];
  const lines = [];
  lines.push(headers.join(','));
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return lines.join('\n') + '\n';
  }

  for (const tx of transactions) {
    const row = [
      escapeCsv(tx.id),
      escapeCsv(tx.date),
      escapeCsv(tx.label),
      escapeCsv(tx.type),
      escapeCsv(tx.amount),
      escapeCsv(tx.currency),
    ];
    lines.push(row.join(','));
  }

  return lines.join('\n') + '\n';
}

export default exportTransactionsToCsv;
