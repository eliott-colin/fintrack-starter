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