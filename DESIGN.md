# Design

Système visuel de GitGudAI, relevé sur l'application livrée. À suivre pour les prochains niveaux.

## Monde

Rétro pixel (imposé par le brief), interface de jeu 16 bits : fenêtres à bord cranté, boîtes de dialogue avec plaque de nom, barres de PV, fiche d'équipement, carte du monde en serpentin. Fond sombre (usage à l'ordinateur, sessions de jeu), lisibilité avant l'effet.

## Couleurs

Palette Sweetie 16 uniquement, exposée en variables CSS (`src/styles/global.css`) et en caractères pour les sprites (`src/sprites/pixel.ts`).

| Rôle | Variable | Valeur |
|---|---|---|
| Fond | `--ink` | #1a1c2c |
| Surface / surface haute | `--surface` / `--night` | #232a40 / #333c57 |
| Bordures, texte désactivé | `--slate` | #566c86 |
| Texte secondaire | `--steel` | #94b0c2 |
| Texte principal | `--paper` | #f4f4f4 |
| Action principale, XP, sélection | `--gold` (+ lèvre `--coral`) | #ffcd75 |
| Réussite | `--lime` / `--green` | #a7f070 / #38b764 |
| Erreur (texte) | `--coral` | #ef7d57 |
| Erreur (fond), boss | `--raspberry` | #b13e53 |
| Focus, tuteur, IA | `--cyan` / `--teal` | #73eff7 / #257179 |

Le texte d'erreur utilise le corail (contraste suffisant), jamais le framboise sur fond sombre.

## Typographie

| Police | Rôle |
|---|---|
| Press Start 2P | Titres, boutons, étiquettes courtes |
| Pixelify Sans | Texte courant (ligatures désactivées : la ligature « fi » est cassée) |
| VT323 | Code, appels d'outils, numéros de tokens |
| Atkinson Hyperlegible | Option « police lisible » (remplace les deux premières) |

Mesure des paragraphes : 68 caractères environ. Typographie française automatique (`frenchTypo`).

## Matières

- Cadre : bordure de 4 px dessinée par quatre ombres décalées, coins absents (`.frame`), relief intérieur clair en haut, sombre en bas.
- Bouton : fond plein, lèvre inférieure de 4 px, enfoncement de 2 px au clic (`.btn`).
- Aucune ombre floue, aucun dégradé décoratif hors des scènes (baie de montage, arène, coffre).

## Mouvement

Animations en paliers (`steps()`), courtes. Un seul moment fort : l'équipement d'une pièce (le coffre s'ouvre, la pièce monte, puis clignote sur Bob). Respiration et clignement de Bob discrets. Tout est désactivé par `prefers-reduced-motion` ou le réglage « Réduire les animations ».

## Composants récurrents

`DialogueBox` (plaque de nom + texte qui s'écrit), `ProgressBar` et `Segments`, `GlossaryCardView` (cadre selon la rareté), `RoundHeader` des mini-jeux, `Stepper` des phases, `BobSprite` (calques de harnais), `Icon` (icônes pixel en couleur courante : pas d'emoji ni de glyphe Unicode comme icône).
