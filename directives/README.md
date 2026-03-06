# 📋 Directives — SOPs (Standard Operating Procedures)

Ce dossier contient les **instructions de haut niveau** du projet Validateur Forge. Chaque fichier décrit une procédure opérationnelle standardisée (SOP) : ses objectifs, entrées/sorties, et cas particuliers.

## 🎯 Rôle (Couche 1 — Le "Quoi")

Les directives sont le **manuel d'instruction** pour les tâches répétitives. Elles définissent :
- **Ce qu'il faut faire** (pas comment le faire — ça, c'est le rôle des scripts dans `execution/`)
- **Les cas particuliers** et pièges connus
- **Les critères de succès** pour valider qu'une tâche est terminée

## 📁 Fichiers

| Fichier | Description |
|---|---|
| `sop-validation-csv.md` | Règles de validation des fichiers CSV d'annonces |
| `sop-comparaison-annonces.md` | Comparaison PROD vs INTEG via l'API Immobox |
| `sop-deploiement.md` | Déploiement Docker ou PM2 |

## ✏️ Convention de nommage

- Préfixe `sop-` pour les procédures opérationnelles
- Noms en kebab-case, en français
- Extension `.md` (Markdown)

## 🔄 Self-annealing

Ces directives sont **vivantes** : à chaque erreur rencontrée ou nouveau cas découvert, la directive correspondante doit être mise à jour pour capitaliser sur l'apprentissage.
