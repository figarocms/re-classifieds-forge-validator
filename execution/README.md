# ⚙️ Execution — Scripts déterministes

Ce dossier contient les **scripts d'exécution** du projet Validateur Forge. Ils représentent la **Couche 3** de l'architecture agentique (le "Comment").

## 🎯 Rôle (Couche 3 — Le "Comment")

Les scripts d'exécution sont :
- **Déterministes** : même entrée → même sortie, toujours
- **Testables** : chaque script peut être exécuté et validé indépendamment
- **Autonomes** : ils gèrent les appels API, le traitement de données et les interactions fichiers

## 📁 État actuel

Pour l'instant, la logique d'exécution est intégrée directement dans les **Server Routes Nuxt** (`server/api/compare.ts`) et les **composables** (`app/composables/useCompare.ts`).

Ce dossier est prêt à accueillir de futurs scripts Python ou Node.js pour des tâches comme :
- Export de données en batch
- Analyse automatisée de fichiers CSV
- Interactions avec GCP (BigQuery, Secret Manager)
- Scripts de migration ou nettoyage de données

## ✏️ Conventions

- **Langage** : Python (privilégié) ou Node.js selon le besoin
- **Nommage** : kebab-case, préfixé par l'action (ex: `extract-annonces.py`, `validate-csv.js`)
- **Documentation** : chaque script doit avoir un en-tête décrivant son usage, ses entrées/sorties
- **Sécurité** : aucun secret dans le code — utiliser ADC ou GCP Secret Manager
