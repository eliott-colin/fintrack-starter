# FinTrack

[![CI](https://github.com/eliott-colin/fintrack-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/eliott-colin/fintrack-starter/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/badge/coverage-jest%20--coverage-informational)

FinTrack est une application web de gestion de budget personnel.
Elle permet d'ajouter des transactions, suivre un solde, calculer des indicateurs simples
et exporter les données en CSV.
Le projet sert aussi de base pédagogique pour pratiquer les tests, l'audit de code et le refactoring.

## Installation

### Prérequis

- Node.js 18 ou plus
- npm 9 ou plus

### Commandes

```bash
npm ci
```

## Lancement

### Développement

```bash
npm run dev
```

Application disponible sur http://localhost:5173.

### Build production

```bash
npm run build
```

### Preview production

```bash
npm run preview
```

Par défaut, la preview est disponible sur http://localhost:4173.

## Tests

### Tests unitaires (Jest)

```bash
npm test -- --runInBand
```

### Tests E2E (Playwright)

```bash
npx playwright test tests-e2e
```

### Couverture (Jest)

```bash
npm test -- --coverage
```

## Structure du projet

```text
.
├─ docs/
│  ├─ audit.md
│  ├─ scenarios.md
│  └─ tests-strategy.md
├─ src/
│  ├─ App.jsx
│  ├─ calculator.js
│  ├─ export-csv.js
│  ├─ seed.js
│  └─ transactions-legacy.js
├─ tests-e2e/
└─ .github/workflows/ci.yml
```

## Documentation complémentaire

- Audit technique: [docs/audit.md](docs/audit.md)
- Scénarios: [docs/scenarios.md](docs/scenarios.md)

---

Projet fil rouge B3 Dev - My Digital School Bordeaux
