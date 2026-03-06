# SOP — Validation de fichiers CSV d'annonces immobilières

## Objectif

Valider la structure et le contenu d'un fichier CSV d'annonces immobilières avant import, en identifiant les erreurs, warnings et informations.

## Entrée

- Fichier CSV (séparateur `;`, encodage UTF-8 ou Latin-1)
- Portail cible : FI (Figaro Immobilier), PLF (Propriétés Le Figaro), FI9 (Figaro Immoneuf)

## Sortie

- Liste d'alertes par annonce, classées par niveau de sévérité :
  - 🔴 **Erreur** : donnée invalide empêchant le traitement
  - 🟠 **Warning** : donnée suspecte nécessitant vérification
  - 🔵 **Info** : structure incomplète mais non bloquante

## Règles de validation

### Types de champs

| Type | Validation | Exemple |
|---|---|---|
| `Texte` | Non vide si obligatoire | Titre, description |
| `Nombre` | Entier ou décimal positif | Prix, surface |
| `Booléen` | `OUI` ou `NON` uniquement | Loyer CC, Loyer HT |
| `Code Postal` | 5 chiffres | 75008 |
| `Email` | Format email standard | agent@email.com |
| `Téléphone` | 10+ chiffres, commence par 0 ou +33 | 0145678900 |
| `Photo` | URL valide ou nom de fichier image (png, jpg, jpeg, webp, bmp, tiff) | https://... ou photo1.jpg |
| `Entier 4 chiffres` | Exactement 4 chiffres | 2024 (année de construction) |

### Règles métier spécifiques

1. **Photo 1 vide** → Warning (annonce sans photo)
2. **Prix hors honoraires acquéreur** (champ 303) > **Prix principal** (champ 11) → Warning
3. **Année de construction** (champ 27) :
   - 4 chiffres → OK
   - 3 chiffres → Warning (probable erreur de saisie)
   - Vide → OK (champ optionnel)
4. **Champs manquants en fin de ligne** → Info (pas une erreur, structure CSV incomplète mais tolérable)

## Cas particuliers connus

- Les fichiers CSV peuvent avoir un nombre variable de colonnes par ligne (les champs en fin de ligne sont optionnels)
- Le séparateur est toujours `;` (point-virgule), jamais `,`
- Les champs `Loyer CC` et `Loyer HT` sont des **booléens**, pas des valeurs numériques
