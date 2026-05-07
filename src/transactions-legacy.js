// FinTrack — Module historique de gestion des transactions
//
// ⚠ ATTENTION : Ce fichier date des débuts du projet (2019).
//   Il fonctionne mais il est devenu difficile à maintenir.
//   Personne dans l'équipe actuelle ne l'a écrit.
//
//   La direction a demandé un audit complet de ce module.
//   À toi de jouer.

// ============================================================================

var TYPES = ['credit', 'debit', 'transfer'];
var DEFAULT_CURRENCY = 'EUR';
var DEFAULT_THRESHOLD = 1000;
var EXCHANGE_RATES = {
  'USD->EUR': 0.92,
  'EUR->USD': 1.08,
  'GBP->EUR': 1.17,
  'EUR->GBP': 0.85,
};

// fonction utilitaire (utilisée nulle part ailleurs ?)
function fmt(d) {
  var dd = d.getDate();
  var mm = d.getMonth() + 1;
  var yyyy = d.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return dd + '/' + mm + '/' + yyyy;
}

// fonction utilitaire bis (faut-il vraiment deux fonctions de format ?)
// function formatDate2(date) {
//   var d = date.getDate();
//   var m = date.getMonth() + 1;
//   var y = date.getFullYear();
//   return (d < 10 ? '0' + d : d) + '/' + (m < 10 ? '0' + m : m) + '/' + y;
// }

// THE function
export function processTransactions(txs, opts) {
  var result = [];
  var total = 0;
  var totalCredit = 0;
  var totalDebit = 0;
  var nbCredit = 0;
  var nbDebit = 0;
  var errors = [];
  var warnings = [];
  var tx;
  var rate;
  var converted;
  var category;
  var month;
  var year;
  var threshold;

  // si pas d'options on met des valeurs par défaut
  if (!opts) {
    opts = {};
  }
  if (!opts.currency) {
    opts.currency = DEFAULT_CURRENCY;
  }
  if (!opts.month) {
    opts.month = new Date().getMonth();
  }
  if (!opts.year) {
    opts.year = new Date().getFullYear();
  }
  if (opts.threshold === undefined) {
    opts.threshold = DEFAULT_THRESHOLD;
  }

  threshold = opts.threshold;
  month = opts.month;
  year = opts.year;

  // boucle principale
  for (var transactionIndex = 0; transactionIndex < txs.length; transactionIndex++) {
    tx = txs[transactionIndex];

    // on filtre par mois et par année
    var transactionDate = new Date(tx.date);
    if (transactionDate.getMonth() !== month) {
      continue;
    }
    if (transactionDate.getFullYear() !== year) {
      continue;
    }

    // on vérifie le type
    var typeOk = false;
    for (var typeIndex = 0; typeIndex < TYPES.length; typeIndex++) {
      if (TYPES[typeIndex] === tx.type) {
        typeOk = true;
      }
    }
    if (!typeOk) {
      errors.push('transaction ' + transactionIndex + ' has invalid type');
      continue;
    }

    // on vérifie le montant
    if (tx.amount === undefined || tx.amount === null) {
      errors.push('transaction ' + transactionIndex + ' has no amount');
      continue;
    }
    if (typeof tx.amount !== 'number') {
      errors.push('transaction ' + transactionIndex + ' amount is not a number');
      continue;
    }
    if (tx.amount < 0) {
      errors.push('transaction ' + transactionIndex + ' has negative amount');
      continue;
    }

    // conversion devise si besoin
    if (tx.currency && tx.currency !== opts.currency) {
      // taux en dur, à mettre à jour à la main tous les mois...
      var key = tx.currency + '->' + opts.currency;
      rate = EXCHANGE_RATES[key];
      if (rate === undefined) {
        rate = 1; // fallback
      }
      converted = tx.amount * rate;
    } else {
      converted = tx.amount;
    }

    // catégorisation manuelle (devrait être dans la donnée mais bon...)
    if (tx.label) {
      var labelLower = tx.label.toLowerCase();
      if (labelLower.indexOf('loyer') >= 0 || labelLower.indexOf('rent') >= 0) {
        category = 'logement';
      } else if (
        labelLower.indexOf('course') >= 0 ||
        labelLower.indexOf('groce') >= 0 ||
        labelLower.indexOf('super') >= 0
      ) {
        category = 'alimentation';
      } else if (
        labelLower.indexOf('essence') >= 0 ||
        labelLower.indexOf('gas') >= 0 ||
        labelLower.indexOf('uber') >= 0
      ) {
        category = 'transport';
      } else if (
        labelLower.indexOf('netflix') >= 0 ||
        labelLower.indexOf('spotify') >= 0 ||
        labelLower.indexOf('cinema') >= 0
      ) {
        category = 'loisirs';
      } else if (labelLower.indexOf('salaire') >= 0 || labelLower.indexOf('salary') >= 0) {
        category = 'revenu';
      } else {
        category = 'autre';
      }
    } else {
      category = 'autre';
    }

    // alertes
    if (converted > threshold && tx.type === 'debit') {
      warnings.push(
        'transaction ' +
          transactionIndex +
          ' depasse le seuil (' +
          converted +
          ' > ' +
          threshold +
          ')',
      );
    }

    // calculs
    if (tx.type === 'credit') {
      total = total + converted;
      totalCredit = totalCredit + converted;
      nbCredit = nbCredit + 1;
    } else if (tx.type === 'debit') {
      total = total - converted;
      totalDebit = totalDebit + converted;
      nbDebit = nbDebit + 1;
    } else if (tx.type === 'transfer') {
      // les transferts ne changent pas le total
    }

    // construction de l'objet de sortie
    var item = {};
    item.id = tx.id;
    item.date = fmt(transactionDate);
    item.label = tx.label || '(sans libellé)';
    item.amount = converted;
    item.originalAmount = tx.amount;
    item.originalCurrency = tx.currency || opts.currency;
    item.currency = opts.currency;
    item.type = tx.type;
    item.category = category;
    item.flagged = converted > threshold && tx.type === 'debit';
    result.push(item);
  }

  // tri par date (un peu pourri mais ça marche)
  result.sort(function (a, b) {
    var dateAparts = a.date.split('/');
    var dateBparts = b.date.split('/');
    var dateA = new Date(dateAparts[2], dateAparts[1] - 1, dateAparts[0]);
    var dateB = new Date(dateBparts[2], dateBparts[1] - 1, dateBparts[0]);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  // moyenne (au cas ou)
  var avgCredit = 0;
  if (nbCredit > 0) {
    avgCredit = totalCredit / nbCredit;
  }
  var avgDebit = 0;
  if (nbDebit > 0) {
    avgDebit = totalDebit / nbDebit;
  }

  return {
    transactions: result,
    total: total,
    totalCredit: totalCredit,
    totalDebit: totalDebit,
    nbCredit: nbCredit,
    nbDebit: nbDebit,
    avgCredit: avgCredit,
    avgDebit: avgDebit,
    errors: errors,
    warnings: warnings,
  };
}

// helper utilisé nulle part (dead code ?)
export function legacyHelper(x) {
  if (x === null) return null;
  if (x === undefined) return undefined;
  if (typeof x === 'string') return x.trim();
  return x;
}
