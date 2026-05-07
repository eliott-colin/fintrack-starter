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

function getMonthYearFromDate(dateStr) {
  const date = new Date(dateStr);
  return { month: date.getMonth(), year: date.getFullYear() };
}

export function exportTransactionsToCsv(transactions, filterDate = null) {
  const headers = ['date', 'label', 'amount', 'category'];
  const lines = [];
  lines.push(headers.join(','));

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return lines.join('\n') + '\n';
  }

  let targetMonth, targetYear;
  if (filterDate) {
    targetMonth = filterDate.getMonth();
    targetYear = filterDate.getFullYear();
  } else {
    const now = new Date();
    targetMonth = now.getMonth();
    targetYear = now.getFullYear();
  }

  for (const tx of transactions) {
    const { month, year } = getMonthYearFromDate(tx.date);
    if (month !== targetMonth || year !== targetYear) {
      continue;
    }

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
