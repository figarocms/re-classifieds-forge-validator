# ── Stage 1 : Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY package.json package-lock.json ./
RUN npm ci

# Copier le reste du code source
COPY . .

# Build de production Nuxt
RUN npm run build

# ── Stage 2 : Production ─────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copier uniquement le build Nuxt (Nitro server autonome)
COPY --from=builder /app/.output .output

# Cloud Run injecte PORT automatiquement
ENV HOST=0.0.0.0

EXPOSE 8080

# Lancer le serveur Nitro
CMD ["node", ".output/server/index.mjs"]
