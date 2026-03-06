# Validateur Forge

Outil de **validation et comparaison** des annonces immobilières entre les environnements **PROD** (Immobox) et **INTEG** (Forge). Construit avec **Nuxt 3** pour bénéficier des Server Routes et résoudre les problèmes de CORS et certificats SSL `.local`.

## 🏗️ Architecture

```
Validateur Forge/
├── app/
│   ├── app.vue                     # Layout principal (header + NuxtPage)
│   ├── pages/
│   │   ├── index.vue               # Page d'accueil : formulaire + liste annonces INTEG/PROD
│   │   └── detail.vue              # Page de détail : tableau comparatif d'une annonce
│   ├── assets/css/tailwind.css     # Config Tailwind
│   └── composables/
│       └── useCompare.ts           # Composable — appels API + state partagé entre pages
├── server/
│   └── api/
│       └── compare.ts              # Route serveur proxy (gère CORS + SSL)
├── directives/                     # 📋 Couche 1 — SOPs (le "Quoi")
│   ├── sop-validation-csv.md       # Règles de validation CSV
│   ├── sop-comparaison-annonces.md # Comparaison PROD vs INTEG
│   └── sop-deploiement.md          # Déploiement Docker / PM2
├── execution/                      # ⚙️ Couche 3 — Scripts déterministes (le "Comment")
├── .tmp/                           # Fichiers intermédiaires (gitignored)
├── Dockerfile                      # Image Docker multi-stage
├── docker-compose.yml              # Orchestration Docker
├── ecosystem.config.cjs            # Config PM2 (alternative sans Docker)
├── nuxt.config.ts                  # Configuration Nuxt + Tailwind
└── README.md
```

## 🔄 Flux Utilisateur

1. **Page d'accueil** (`/`) : L'utilisateur renseigne un partenaire et un code agence
2. Après soumission, 2 colonnes s'affichent :
   - **INTEG** (gauche) : liste des annonces de l'environnement d'intégration
   - **PROD** (droite) : liste des annonces de l'environnement de production
3. **Clic sur une annonce** → navigation vers la page de **détail** (`/detail?ref=...`)
4. **Page de détail** : tableau comparatif champ par champ entre PROD et INTEG (localisation, caractéristiques, DPE, contact, financier, médias)
5. **Retour à la liste** : les filtres de recherche (Partenaire, Code Agence, Portail) sont **automatiquement restaurés** et les résultats toujours affichés

## 🚀 Installation

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:3000`.

## ⚙️ Route Serveur — `/api/compare`

La route `server/api/compare.ts` sert de **proxy backend** entre le navigateur et les APIs Immobox. Cela permet de :
- **Éviter les problèmes CORS** (les appels sont faits côté serveur)
- **Gérer les certificats SSL auto-signés** pour l'environnement INTEG (`.local`)

### Paramètres

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| `partenaire` | string | ✅ | Nom du partenaire (ex: Netty, Apimo) |
| `codeAgence` | string | ✅ | Code de l'agence |
| `refClient` | string | ❌ | Référence client (wildcard si vide) |
| `mediaId` | string | ❌ | Portail de publication : `1` = FI, `9` = PLF, `2` = FI9 |
| `env` | string | ✅ | Environnement : `PROD` ou `INTEG` |

### Filtre Portail de publication

Le formulaire de recherche propose un **groupe de boutons segmentés** (Tous / FI / PLF) pour filtrer par portail :
- **Tous** (par défaut) : aucun filtre portail, retourne toutes les annonces
- **FI** (Figaro Immobilier) : ajoute `filters[media_id]=1` à l'URL API
- **PLF** (Propriétés Le Figaro) : ajoute `filters[media_id]=9` à l'URL API
- **FI9** (Figaro Immoneuf) : ajoute `filters[media_id]=2` à l'URL API

Ce filtre est optionnel et permet d'affiner la recherche lorsqu'un code agence est utilisé sur plusieurs portails.

### Mode FI9 (immobilier neuf)

Le portail **FI9** concerne l'immobilier neuf. Les annonces sont structurées en **programmes** et **lots** :

- Un **programme** (`property.is_program = true`) représente le projet immobilier global (résidence)
- Un ou plusieurs **lots** (`property.is_program = false`) sont rattachés au programme via le `gateway_code` (le lot possède un `gateway_code` qui commence par celui du programme + `_`)

En mode FI9, la liste des annonces affiche les programmes en tête avec leur nom (`fields.titre_fr`) et les lots indentés en dessous. La page de détail affiche une catégorie supplémentaire **« Programme Neuf »** avec les champs spécifiques (date de livraison, statut fiscal, bureau de vente, etc.).

### URLs ciblées

- **PROD** : `https://explorimmobox.explorimmo.com/v2/listings.json?api_key=immobox`
- **INTEG** : `https://imb-integration.vip.adencf.local/v2/listings.json?api_key=immobox`

### Construction du filtre `gateway_code`

- Si `refClient` est vide → `{codeAgence}_*` (wildcard)
- Si `refClient` est rempli → `{codeAgence}_{refClient}`

## 📊 Catégories de Comparaison (page détail)

| Catégorie | Champs |
|---|---|
| 📍 Localisation | Adresse, Ville, Code Postal, Pays |
| 🏠 Caractéristiques | Type, Pièces, Chambres, Surface, Terrain, Étage, Année |
| ⚡ DPE | Énergie (valeur/classe), GES (valeur/classe) |
| 👤 Contact | Nom, Email, Téléphone |
| 💰 Financier | Prix, Charges, Honoraires |
| 📸 Médias | Nombre de photos (OK si identique) |
| 🏗️ Programme Neuf (FI9) | Nom du programme, date de livraison, statut fiscal, étage, parking, visite virtuelle 3D, bureau de vente |

### Statuts visuels

- 🟢 **OK** : Valeurs identiques entre PROD et INTEG
- 🔴 **DIFF** : Valeurs différentes (sensible à la casse et aux espaces)
- 🟠 **MANQUE INTEG** / **MANQUE PROD** : Donnée présente d'un côté mais absente de l'autre (potentiel dysfonctionnement)
- ⚪ **N/A** : Donnée absente des deux côtés (non transmise par la source)

## 🧠 Architecture Agentique

Le projet suit une **architecture à 3 couches** pour maximiser la fiabilité et la maintenabilité :

| Couche | Rôle | Emplacement |
|---|---|---|
| **1. Directive** (le "Quoi") | SOPs en Markdown — instructions de haut niveau | `directives/` |
| **2. Orchestration** (le "Cerveau") | L'agent IA — routage intelligent et gestion des erreurs | Agent Claude |
| **3. Exécution** (le "Comment") | Scripts déterministes et testables | `execution/` + `server/api/` |

Les directives sont des **documents vivants** : à chaque erreur ou nouveau cas découvert, la SOP correspondante est mise à jour (principe de *self-annealing*).

## 📋 Prochaines Évolutions
- [ ] Affichage des photos miniatures pour comparaison visuelle.
- [x] Export PDF de la page détail (impression navigateur avec styles dédiés).
- [x] Export JSON du résultat de comparaison (page détail).
- [x] Export CSV de la liste des annonces avec statuts (page accueil).

## 🛠️ Technologies

- **[Nuxt 3](https://nuxt.com/)** — Framework Vue.js full-stack
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling utilitaire
- **Server Routes** — Proxy API côté serveur (pas de CORS)
- **TypeScript** — Typage statique

## 🐳 Déploiement auto-hébergé

L'application doit être hébergée sur un serveur ayant accès au réseau interne (pour l'API INTEG `.local`).

### Option 1 : Docker (recommandé)

```bash
# Build et lancement
docker compose up -d --build

# L'application est accessible sur http://localhost:3000

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down
```

### Option 2 : PM2 (sans Docker)

```bash
# Pré-requis : Node.js 20+ et PM2 installé globalement
npm install -g pm2

# Build de production
npm run build

# Lancer avec PM2
pm2 start ecosystem.config.cjs

# Voir les logs / statut
pm2 logs validateur-forge
pm2 status

# Arrêter
pm2 stop validateur-forge
```
