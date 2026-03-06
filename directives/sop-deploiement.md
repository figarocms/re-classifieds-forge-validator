# SOP — Déploiement de l'application

## Objectif

Déployer Validateur Forge sur un serveur ayant accès au réseau interne (nécessaire pour l'API INTEG `.local`).

## Prérequis

- **Réseau** : le serveur DOIT avoir accès au domaine `imb-integration.vip.adencf.local` (INTEG)
- **Node.js** : version 20+ requise
- **Port** : 3000 (par défaut)

## Option 1 — Docker (recommandé)

### Build et lancement

```bash
docker compose up -d --build
```

### Vérification

```bash
# Vérifier que le conteneur tourne
docker compose ps

# Tester l'accès
curl http://localhost:3000

# Voir les logs
docker compose logs -f
```

### Arrêt

```bash
docker compose down
```

### Architecture Docker

- **Multi-stage build** : le Dockerfile utilise un build en 2 étapes (build Nuxt puis image de production allégée)
- **Image finale** : Node.js Alpine pour minimiser la taille

## Option 2 — PM2 (sans Docker)

### Installation

```bash
npm install -g pm2
```

### Build et lancement

```bash
npm run build
pm2 start ecosystem.config.cjs
```

### Vérification

```bash
pm2 status
pm2 logs validateur-forge
```

### Arrêt

```bash
pm2 stop validateur-forge
```

## Cas particuliers connus

- L'application **doit** être sur un serveur interne pour accéder à l'API INTEG (certificats `.local`)
- Le port 3000 est codé en dur dans la configuration, modifier `ecosystem.config.cjs` ou `docker-compose.yml` pour le changer
- En cas de mise à jour, il faut **reconstruire** l'image Docker (`--build`) ou relancer le build Nuxt avant PM2
