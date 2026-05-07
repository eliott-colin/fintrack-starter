# Stratégie de tests FinTrack

## 1. Qu'est-ce qu'un test unitaire ?

Un test unitaire valide une fonction isolée, avec des entrées et sorties maîtrisées.
Exemple dans FinTrack: vérifier que add(2, 4) retourne 6, ou que divide(10, 0) lève une erreur.

## 2. Qu'est-ce qu'un test d'intégration ?

Un test d'intégration vérifie que plusieurs composants ou modules fonctionnent correctement ensemble.
On le préfère à plusieurs tests unitaires quand le risque vient surtout des interactions,
par exemple le passage des données entre l'interface, les utilitaires de calcul et l'export CSV.

## 3. Qu'est-ce qu'un test E2E ?

Un test E2E simule un usage réel de l'application dans un navigateur.
Exemple: ouvrir l'app, ajouter une transaction, vérifier le solde, puis exporter un CSV.
Son principal défaut est son coût: plus lent à écrire, plus lent à exécuter, et plus sensible à l'environnement.

## 4. Répartition proposée sur 100 tests

- 80 tests unitaires.
- 15 tests d'intégration.
- 5 tests E2E.

Cette répartition permet de garder une base rapide et fiable (unitaires),
de couvrir les points de jonction importants (intégration),
et de sécuriser les parcours critiques utilisateur (E2E).
