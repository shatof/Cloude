# Ajouter un niveau

Les 14 niveaux (0 à 12 et le boss final) sont **complets**. Ce guide sert à en
ajouter un nouveau, ou à repartir d'un niveau existant comme modèle. Les niveaux
récents (`level9.ts`, `level10.ts`) sont de bons points de départ.

Un niveau est un `LevelDefinition` (`src/content/types.ts`). Sans `content`, il
s'affiche sur la carte avec la mention « contenu à venir » ; le remplir, c'est
lui donner un `content` complet.

## 1. Écrire le contenu

Créer `src/content/levels/levelN.ts` :

| Champ | Ce qu'il faut écrire | Contraintes vérifiées par les tests |
|---|---|---|
| `problem` | La mission, puis la scène où Bob échoue (`say`, `fail`, `gap`), un bilan et une question de transition | au moins un `fail`, 12 étapes maximum |
| `concept` | 1 à 3 écrans : titre, corps, analogie, « à retenir », illustration | 110 mots maximum par écran, analogie de 60 mots maximum, le terme d'une carte ne doit pas apparaître dans son analogie |
| `minigame` | L'identifiant du mini-jeu (clé du registre), son titre, son intro, l'XP maximale | identifiant présent dans `MINIGAMES` |
| `boss` | Nom, sprite, répliques, `passRatio`, questions | au moins 5 questions, une seule bonne réponse, une explication par choix, bonne réponse pas toujours au même endroit, sprite présent dans `BOSS_SPRITES` |
| `reward` | XP, identifiants des cartes gagnées, réplique de Bob | cartes existantes et rattachées au niveau |
| `tutor` | Questions-réponses du tuteur hors-ligne, mots-clés, suggestions | mots-clés en minuscules et sans accents, identifiants uniques |

Texte enrichi dans les corps de texte : `**gras**`, `*italique*` (affiché en
couleur), `` `code` ``, listes `- ` ou `1. `, paragraphes séparés par une ligne
vide. La flèche `→` est dessinée en pixel art. Les espaces insécables françaises
sont ajoutées automatiquement. Éviter les glyphes absents des polices pixel
(`←`, `≈`, `≤`, `✓`, indices) : les mettre en `` `code` `` au besoin.

Rappels de ton : aucun jargon sans explication, une analogie concrète par
concept, des écrans courts, et chaque affirmation technique doit rester vraie
fin 2026 (préférer « par paliers » et des formulations prudentes aux dates figées).

## 2. Écrire les cartes de glossaire

Dans le même fichier, exporter `levelNCards: GlossaryCard[]`, une carte par
concept débloqué. Chaque carte produit 3 flashcards (définition, analogie, idée
reçue). L'analogie ne doit **pas** contenir le terme : elle sert de question en
révision. Chaque carte a une `icon` (voir § 5).

## 3. Enregistrer le niveau

Dans `src/content/levels/index.ts` :
- importer `levelN` et `levelNCards` ;
- ajouter `levelN` dans le tableau `LEVELS`, à sa place ;
- ajouter `...levelNCards` à `CARDS`.

## 4. Le mini-jeu

Le plus simple est d'utiliser le **kit** (`src/minigames/kit/`) : un mini-jeu se
décrit par des données, sans écrire de composant. Créer
`src/minigames/<nom>/config.ts` qui exporte un `MiniGameConfig` (un titre et des
manches), puis l'enregistrer dans `src/minigames/registry.tsx` via
`configuredMiniGame(config)`.

Types de manches disponibles (`src/minigames/kit/types.ts`) :

- `choice` : une question à la fois, chaque option est expliquée (option `ordered` pour garder l'ordre des réponses) ;
- `sort` : ranger chaque élément dans la bonne case ;
- `order` : cliquer des étapes dans le bon ordre (score par paires bien ordonnées) ;
- `pick` : cocher tout ce qui convient (score de Jaccard) ;
- `budget` : choisir sous une contrainte chiffrée (tokens, euros…) ;
- `custom` : un composant React maison qui reçoit `{ onDone: (score) => void }`.

Les manches `custom` servent aux ateliers sur mesure : l'atelier de montage du
harnais (niveau 7, `minigames/assembly/`), le bac à sable d'injection (niveau 11,
`minigames/injectionLab/`), l'épreuve d'architecte (boss final,
`minigames/architect/`). Mettre la logique pure dans un fichier séparé et la
tester (voir `assembly/logic.test.ts`).

Un mini-jeu peut aussi être un composant complet reçu par `onFinish(score)` et
enregistré directement dans le registre (voir `tokenWorkshop`, `loopRunner`).

## 5. Illustrations, boss et icônes

- **Illustrations** des écrans de concept : le plus souvent via le kit
  (`src/levels/illustrations/kit.tsx` : `stepsIllustration`, `toggleIllustration`,
  `hotspotIllustration`, `barsIllustration`). Créer `levelN.ts`, l'exporter, puis
  l'ajouter à `ILLUSTRATIONS` dans `src/levels/illustrations/index.tsx`. La clé
  est référencée par le champ `illustration` de chaque écran.
- **Boss** : dessiner un sprite 32 × 32 dans `src/sprites/bosses.ts` et l'ajouter
  à `BOSS_SPRITES`.
- **Icônes de cartes** : ajouter une icône d'interface dans `src/sprites/icons.ts`,
  puis une entrée `CARD_TINTS` (icône + couleur) pour la colorer. L'icône d'une
  carte doit exister dans `ICONS`.
- Les 14 pièces de harnais ont déjà leur calque sur Bob (`src/sprites/bob.ts`).
- Vérifier le rendu sur la route cachée `#/atelier-sprites`.

## 6. La couche IA (niveau 11 et boss final)

- Labo de prompt injection : `runInjectionAttempt()` de `src/ai/injection.ts`
  (vrai modèle si connecté, simulation déterministe sinon). Principe à faire
  manipuler : un contenu non fiable n'hérite jamais de l'autorité de l'utilisateur.
- Boss final : définir des `FinalBossCase` (`src/minigames/architect/cases.ts`) et
  appeler `evaluateFinalBoss()` de `src/ai/finalBoss.ts`. La note vient toujours
  de la grille déterministe ; le juge IA ne fait qu'ajouter un commentaire.

## 7. Vérifier

```bash
npm test
```

```bash
npm run dev
```

Pour tester un niveau sans rejouer les précédents : *Réglages → Débloquer tous
les niveaux disponibles*. La route `#/niveau/<id>` ouvre un niveau directement.
