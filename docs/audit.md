# Audit de `transactions-legacy.js`

## Première lecture: structure
Ce module contient 3 fonctions actives. `fmt(d)` sert juste à formater une date. `processTransactions(txs, opts)` est la fonction centrale et c’est elle qui fait presque tout le travail. `legacyHelper(x)` est un petit helper exporté, mais il semble peu utilisé. Il y a aussi une ancienne fonction commentée, mais elle ne s’exécute pas.

## Deuxième lecture: flux principal
Le module prend une liste de transactions et des options. Il met en place des valeurs par défaut pour la devise, le mois, l’année et le seuil. Ensuite, il parcourt chaque transaction, garde seulement celles du bon mois et de la bonne année, puis vérifie le type et le montant. Si besoin, il convertit la devise, choisit une catégorie à partir du libellé, ajoute une alerte si le débit est trop élevé, puis met à jour les totaux avant d’ajouter le résultat final.

## Troisième lecture: zones les plus complexes
La partie la plus fragile, c’est la gestion des options: `!opts.month` et `!opts.year` peuvent mal réagir pour certaines valeurs valides. La conversion de devise est aussi un point sensible, parce qu’elle repose sur des taux écrits en dur. La catégorisation automatique marche de façon simple, mais elle reste approximative. Enfin, la fonction principale mélange plusieurs responsabilités dans un seul bloc, ce qui la rend longue et moins facile à relire.

## Diagnostic général
Le module sert à transformer des transactions brutes en données enrichies avec totaux, alertes et statistiques. Son avantage principal, c’est qu’il fait tout au même endroit et que le flux global reste compréhensible. En revanche, la fonction centrale est très longue et cumule beaucoup de logique différente. Les valeurs par défaut sont gérées de façon un peu fragile. La conversion de devise est figée dans le code. La catégorisation repose sur des mots-clés et peut donc se tromper. Le module fonctionne, mais il est clairement difficile à maintenir sur la durée.

## Risques identifiés
- Zone du code: gestion des options au début de `processTransactions`.
	Problème observé: `!opts.month` et `!opts.year` considèrent `0` comme une valeur absente.
	Impact potentiel: les transactions de janvier peuvent être traitées avec une mauvaise valeur par défaut.

- Zone du code: conversion de devise dans le bloc `if (tx.currency && tx.currency !== opts.currency)`.
	Problème observé: les taux sont écrits en dur dans plusieurs conditions.
	Impact potentiel: une conversion fausse ou oubliée peut produire des montants inexacts.

- Zone du code: catégorisation basée sur `tx.label`.
	Problème observé: la catégorie dépend de mots-clés simples dans le libellé.
	Impact potentiel: certaines transactions peuvent recevoir une mauvaise catégorie.

- Zone du code: tri final sur `result.sort(...)`.
	Problème observé: le tri repart de chaînes de dates déjà formatées.
	Impact potentiel: le code est plus fragile et plus difficile à faire évoluer.

- Zone du code: fonction principale `processTransactions` dans son ensemble.
	Problème observé: elle mélange validation, conversion, règles métier et calculs.
	Impact potentiel: les corrections deviennent plus risquées et les tests plus difficiles à isoler.

## Code smells identifiés

## Refactoring effectué

### Zone 1: Magic Numbers (Priorité Haute)
**Refactoring 1 - Extraction des constantes nommées:**
- Extrait `DEFAULT_CURRENCY = 'EUR'` pour remplacer les `'EUR'` en dur.
- Extrait `DEFAULT_THRESHOLD = 1000` pour la valeur par défaut du seuil.
- Créé `EXCHANGE_RATES` objet pour centraliser les taux de change (0.92, 1.08, 1.17, 0.85).
- Simplifié la conversion de devise : au lieu de cascades de `if-else`, utilise une lookup dans l'objet.
- Impact: les valeurs sont maintenant modifiables au même endroit, la conversion est plus propre.
- Tests: tous passent. 22 tests de caractérisation + 9 tests E2E verts.

### Zone 2: Unclear Naming (Priorité Moyenne)
**Refactoring 2 - Renommage des variables mal nommées:**
- Renommé `i` → `transactionIndex` dans la boucle principale.
- Renommé `j` → `typeIndex` dans la boucle de vérification du type.
- Renommé `d` → `transactionDate` pour la variable de date.
- Renommé `lab` → `labelLower` pour la version minuscule du libellé.
- Renommé `pa`, `pb` → `dateAparts`, `dateBparts` dans la fonction de tri.
- Renommé `da`, `db` → `dateA`, `dateB` pour les dates créées depuis les parts.
- Impact: le code est maintenant plus lisible et facile à déboguer.
- Tests: tous passent. 22 tests de caractérisation + 9 tests E2E verts.

### Prochaines zones à refactoriser:
- Externaliser la catégorisation dans une fonction dédiée (réduire Long Method).
- Extraire la validation de transactions dans une fonction dédiée.
- Créer une fonction pour le calcul des agrégations (totaux, moyennes, comptages).
- Remplacer les boucles manuelles par des fonctions de tableau intégrées (`includes()`, `map()`, etc.).

### 1. Long Method [Priorité Haute]
**Localisation :** src/transactions-legacy.js:33-229
**Constat :** La fonction `processTransactions` fait 197 lignes, bien au-delà du seuil de 30 lignes recommandé.
**Impact :** Difficile à lire, à tester et à maintenir. Un changement au milieu risque d'affecter plusieurs responsabilités.
**Proposition :** Découper en plusieurs fonctions : `validateTransaction()`, `convertCurrency()`, `categorizeTransaction()`, `computeAggregates()`.

### 2. God Object [Priorité Haute]
**Localisation :** src/transactions-legacy.js (module entier)
**Constat :** La fonction centrale fait de la validation, conversion, catégorisation, agrégation et calculs.
**Impact :** Impossible de tester une partie sans le reste. Impossible de réutiliser une partie en isolation.
**Proposition :** Créer des modules séparés : un pour la validation, un pour la conversion, un pour la catégorisation, un pour l'agrégation.

### 3. Magic Number [Priorité Haute]
**Localisation :** src/transactions-legacy.js:65, 113-124
**Constat :** Le seuil par défaut 1000 et les taux de change (0.92, 1.08, 1.17, 0.85) sont codés en dur.
**Impact :** Les valeurs ne peuvent pas être ajustées sans modifier le code source. Aucun contexte pour expliquer ces nombres.
**Proposition :** Extraire en constantes nommées au début du module ou dans un fichier de configuration externe.

### 4. Dead Code [Priorité Moyenne]
**Localisation :** src/transactions-legacy.js:25-30, 233-237
**Constat :** La fonction `formatDate2` est commentée (dead code). La fonction `legacyHelper` est exportée mais probablement inutilisée.
**Impact :** Augmente la taille du fichier et crée de la confusion. Personne ne sait pourquoi c'est là.
**Proposition :** Supprimer `formatDate2`. Vérifier que `legacyHelper` est vraiment inutilisée et la supprimer ou en expliquer l'utilité.

### 5. Duplicate Code [Priorité Moyenne]
**Localisation :** src/transactions-legacy.js:52-66, 87-91
**Constat :** Les vérifications `if (!opts.X)` sont répétées plusieurs fois. La boucle `for (j = 0; j < TYPES.length)` réinvente une recherche que `includes()` ferait en une ligne.
**Impact :** Gestion des options fragile (le piège du `0`). Code plus verbeux que nécessaire.
**Proposition :** Utiliser la destructuration avec valeurs par défaut : `const { currency = 'EUR', month = new Date().getMonth(), ... } = opts ?? {}`. Remplacer la boucle par `TYPES.includes(tx.type)`.

### 6. Unclear Naming [Priorité Moyenne]
**Localisation :** src/transactions-legacy.js (multiples)
**Constat :** Variables nommées `i`, `j`, `d`, `tx`, `tmp`, `pa`, `pb`, `da`, `db` ne donnent pas de contexte sur ce qu'elles représentent.
**Impact :** Code difficile à suivre sans relire la logique à chaque fois. Augmente les erreurs potentielles.
**Proposition :** Utiliser des noms explicites : `transactionIndex`, `typeIndex`, `transactionDate`, `partA`, `partB`, `dateA`, `dateB`, etc.

### 7. Complex Conditional [Priorité Moyenne]
**Localisation :** src/transactions-legacy.js:131-160
**Constat :** La catégorisation repose sur une cascade de `indexOf()` qui est longue et répétitive. Chercher dans des chaînes est peu fiable.
**Impact :** Heuristique approximative, pas d'extensibilité sans ajouter plus de conditions.
**Proposition :** Utiliser un tableau de patterns : `{ keywords: ['loyer', 'rent'], category: 'logement' }` et boucler dessus.

### 8. Mutating Arguments [Priorité Basse]
**Localisation :** src/transactions-legacy.js:52-66
**Constat :** L'argument `opts` est modifié en place. Un appel suivant pourrait voir des valeurs modifiées.
**Impact :** Surprises et bugs subtils si le même `opts` est réutilisé.
**Proposition :** Créer une copie ou utiliser la destructuration pour éviter les mutations.

## Éco-impact

### Mesure de référence (avant optimisation)
- Mode production lancé localement avec `npm run build` puis `npm run preview`.
- Note environnement: Chrome local non détecté, audit réalisé via Lighthouse CLI avec Chromium Playwright (équivalent moteur).
- Audit Lighthouse Performance exécuté sur la page d'accueil (`http://127.0.0.1:4173`).
- Score Lighthouse (départ): **100/100**.

### Recommandations principales remontées par Lighthouse
- Eliminate render-blocking resources (~150 ms potentiels).
- Reduce unused JavaScript (~150 ms potentiels).
- Initial server response time was short (gain potentiel marginal).

### Optimisation choisie (une seule)
- Option appliquée: **suppression d'une dépendance lourde non utilisée**.
- Changement effectué: retrait de la dépendance `g` du projet (`npm uninstall g`).
- Vérification: aucune utilisation détectée dans le code applicatif.

### Résultat après optimisation
- Audit Lighthouse relancé après rebuild.
- Nouveau score Lighthouse Performance: **100/100**.
- Évolution: **0 point** (100 -> 100).

### Conclusion
- L'application était déjà au maximum sur ce profil Lighthouse.
- L'optimisation améliore surtout l'hygiène du projet (dépendances) plutôt que le score brut.

### Bonus
- EcoIndex/GreenIT-Analysis: non réalisé ici (application non déployée publiquement dans ce contexte local).