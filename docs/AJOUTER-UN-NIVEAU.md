# Ajouter un niveau

Les niveaux 2 à 12 et le boss final existent déjà dans le registre avec leur titre, leur concept et leur pièce de harnais. Remplir un niveau consiste à lui donner un `content`. Le niveau 1 (`src/content/levels/level1.ts`) sert de modèle.

## 1. Écrire le contenu

Créer `src/content/levels/levelN.ts` sur le modèle de `level1.ts` :

| Champ | Ce qu'il faut écrire | Contraintes vérifiées par les tests |
|---|---|---|
| `problem` | La mission, puis la scène où Bob échoue (`say`, `fail`, `gap`), un bilan et une question de transition | au moins un `fail`, 12 étapes maximum |
| `concept` | 1 à 3 écrans : titre, corps, analogie, « à retenir », illustration | 110 mots maximum par écran, analogie de 60 mots maximum |
| `minigame` | L'identifiant du mini-jeu, son titre, son intro, l'XP maximale | — |
| `boss` | Nom, sprite, répliques, `passRatio`, questions | au moins 5 questions, une seule bonne réponse, une explication par choix, bonne réponse pas toujours au même endroit |
| `reward` | XP, identifiants des cartes gagnées, réplique de Bob | cartes existantes et rattachées au niveau |
| `tutor` | Questions-réponses du tuteur hors-ligne, mots-clés, suggestions | mots-clés en minuscules et sans accents |

Texte enrichi disponible dans les corps de texte : `**gras**`, `*italique*` (affiché en couleur), `` `code` ``, listes `- ` ou `1. `, paragraphes séparés par une ligne vide. La flèche `→` est dessinée en pixel art. Les espaces insécables françaises sont ajoutées automatiquement.

Rappels de ton : aucun jargon sans explication, une analogie concrète par concept, des écrans courts, et chaque affirmation technique doit rester vraie fin 2026.

## 2. Écrire les cartes de glossaire

Dans le même fichier, exporter `levelNCards: GlossaryCard[]`, une carte par concept débloqué. Chaque carte produit 3 flashcards (définition, analogie, idée reçue). L'analogie ne doit **pas** contenir le terme : elle sert de question en révision.

## 3. Enregistrer le niveau

Dans `src/content/levels/index.ts` :
- importer `levelN` et `levelNCards` ;
- remplacer l'appel `upcoming('lN', …)` par `levelN` ;
- ajouter `...levelNCards` à `CARDS`.

## 4. Le mini-jeu

Créer `src/minigames/<nom>/` avec un composant qui reçoit `onFinish(score)` (score entre 0 et 1, appelé une seule fois), puis l'ajouter à `src/minigames/registry.tsx`. `RoundHeader` (dans `shared.tsx`) affiche les manches. Mettre la logique pure dans un fichier séparé et la tester (voir `minigames.test.ts`).

Le niveau 7 prévoit l'« atelier de montage » : même modèle, même tâche, on ajoute ou retire des pièces de harnais et le taux de réussite change.

## 5. Illustrations et sprites

- Illustrations des écrans de concept : ajouter un composant à `src/levels/illustrations/index.tsx` et le référencer par sa clé dans `illustration`.
- Boss : dessiner un sprite 32 × 32 dans `src/sprites/bosses.ts`.
- Les 14 pièces de harnais ont déjà leur calque sur Bob (`src/sprites/bob.ts`).
- Vérifier le rendu sur la route cachée `#/atelier-sprites`.

## 6. Niveau 11 et boss final : la couche IA

- Labo de prompt injection : `runInjectionAttempt()` de `src/ai/injection.ts` (vrai modèle si connecté, simulation déterministe sinon). Le principe à faire manipuler : un contenu non fiable n'hérite jamais de l'autorité de l'utilisateur.
- Boss final : définir un `FinalBossCase` (verdict attendu par pièce, réglages, mots-clés de justification) et appeler `evaluateFinalBoss()` de `src/ai/finalBoss.ts`. La note vient toujours de la grille déterministe ; le juge IA ajoute un commentaire. Un exemple complet est dans `src/ai/examples.ts`.

## 7. Vérifier

```bash
npm test
```

```bash
npm run dev
```

Pour tester un niveau sans rejouer les précédents : *Réglages → Débloquer tous les niveaux disponibles*.
