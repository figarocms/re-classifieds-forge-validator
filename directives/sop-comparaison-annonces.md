# SOP — Comparaison des annonces PROD vs INTEG

## Objectif

Comparer champ par champ les annonces immobilières entre l'environnement de **production** (Immobox / explorimmobox) et l'environnement d'**intégration** (Forge / imb-integration) pour détecter les écarts.

## Entrée

| Paramètre | Obligatoire | Description |
|---|---|---|
| `partenaire` | ✅ | Nom du partenaire (ex: Netty, Apimo) |
| `codeAgence` | ✅ | Code de l'agence |
| `refClient` | ❌ | Référence client (wildcard `*` si vide) |
| `mediaId` | ❌ | Portail : `1` = FI, `9` = PLF, `2` = FI9 |

## Sortie

- Tableau comparatif champ par champ avec statut visuel :
  - 🟢 **OK** : valeurs identiques
  - 🔴 **DIFF** : valeurs différentes
  - 🟠 **MANQUE INTEG / MANQUE PROD** : donnée présente d'un seul côté
  - ⚪ **N/A** : donnée absente des deux côtés

## Procédure

### 1. Construction de l'URL API

- **Base URL PROD** : `https://explorimmobox.explorimmo.com/v2/listings.json?api_key=immobox`
- **Base URL INTEG** : `https://imb-integration.vip.adencf.local/v2/listings.json?api_key=immobox`
- **Filtre gateway_code** : `{codeAgence}_*` (wildcard) ou `{codeAgence}_{refClient}` (spécifique)
- **Filtre media_id** : optionnel, ajouté uniquement si un portail est sélectionné

### 2. Gestion SSL pour INTEG

L'environnement INTEG utilise un certificat SSL auto-signé (`.local`). Le proxy Nuxt désactive temporairement la vérification TLS (`NODE_TLS_REJECT_UNAUTHORIZED=0`) puis la restaure immédiatement après.

### 3. Catégories de comparaison

| Catégorie | Champs comparés |
|---|---|
| 📍 Localisation | Adresse, Ville, Code Postal, Pays |
| 🏠 Caractéristiques | Type, Pièces, Chambres, Surface, Terrain, Étage, Année |
| ⚡ DPE | Énergie (valeur/classe), GES (valeur/classe) |
| 👤 Contact | Nom, Email, Téléphone |
| 💰 Financier | Prix, Charges, Honoraires |
| 📸 Médias | Nombre de photos |
| 🏗️ Programme Neuf | Titre, livraison, fiscal, parking, visite 3D, bureau de vente |

### 4. Mode FI9 (immobilier neuf)

- Les annonces sont groupées en **programmes** (`is_program = true`) et **lots** (`is_program = false`)
- Le rattachement se fait via le `gateway_code` : le lot possède un code commençant par celui du programme + `_`

## Cas particuliers connus

- Le paramètre de filtre portail est `media_id` (singulier), pas `media_ids`
- La comparaison est **sensible à la casse et aux espaces**
- L'API retourne max 1000 résultats (`limit=1000`)
