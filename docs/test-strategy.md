1.Qu’est-ce qu’un test unitaire ? Donne un exemple tiré de FinTrack.
Un test unitaires est un petit test qui permet de tester une fonction simple exemple le calcul des intêrets

2. Qu’est-ce qu’un test d’intégration ? Quand préférer un test d’intégration à plusieurs tests
unitaires ?
Le test d'intégration est un test à un plus haut niveau que le test unitaires, en géneral il est utilisé lorsqu'il pourrait y avoir des élements bloquants ou sujets à erreurs de plusieurs test unitaires.

3. Qu’est-ce qu’un test E2E ? Quel est son principal défaut ?
Un test end to end est le test le plus complet, c'est également le test le plus lourd son principal défaut est qu'il est long à écrire et à éxécuter

4. Si tu devais répartir 100 tests sur FinTrack, combien d’unitaires, combien d’intégrations,
combien de E2E ? Justifie

Je mettrais 80% de test unitaires 15% de test fonctionnelles et 5% de end to end car la plupart du temps on peux tester la plupart du code avec du unitaires si nécessaires on utilise des fonctionnelles et pour les aspects critique nécessitant des gros test du end to end.