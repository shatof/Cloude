# GitGudAI

Apprends l'IA agentique en équipant **Bob Morris**, un agent dont le cerveau ne change jamais.

GitGudAI est une application web pédagogique et ludique, en français et en pixel art rétro, qui va des bases des LLM jusqu'à l'état de l'art des agents fin 2026. Message central : **agent = modèle + harnais**. On ne rend pas le cerveau plus intelligent : on lui construit un meilleur harnais.

## Démarrer

Prérequis : Node.js 20.19+ ou 22.12+.

```bash
npm install
```

```bash
npm run dev
```

Puis ouvrir l'adresse affichée (par défaut http://localhost:5173).

```bash
npm test
```

```bash
npm run build
```

Le dossier `dist/` produit par le build est un site statique : il peut être servi depuis n'importe quel hébergement, y compris un sous-dossier (GitHub Pages…). Aucun serveur n'est nécessaire.

## Ce que contient cette première étape

| Élément | État |
|---|---|
| Accueil : Bob, son cerveau verrouillé et sa fiche d'équipement (14 emplacements) | ✅ |
| Carte des niveaux avec progression et XP | ✅ |
| Système d'XP et de rangs | ✅ |
| Collection de cartes de glossaire | ✅ |
| Mode révision : flashcards générées depuis les cartes (boîtes de Leitner) + défi éclair | ✅ |
| Sauvegarde dans le navigateur, export / import / réinitialisation | ✅ |
| Niveau 0 « Qu'est-ce qu'un LLM ? » (complet) | ✅ |
| Niveau 1 « Du chatbot à l'agent » (complet) | ✅ |
| Niveaux 2 à 12 et boss final : titre, concept et récompense affichés | contenu à venir |
| Couche « IA réelle » optionnelle (tuteur, juge du boss final, labo d'injection) | ✅ avec réponses prédéfinies |

### Le format d'un niveau

Chaque niveau suit les mêmes 5 phases :

1. **Problème** : Bob échoue à une tâche concrète.
2. **Concept** : le concept qui résout ce problème, en 3 écrans maximum, une analogie par concept, avec une illustration interactive.
3. **Mini-jeu** : on manipule le concept (3 manches).
4. **Boss** : un quiz où chaque réponse, juste ou fausse, est expliquée.
5. **Récompense** : une pièce de harnais fixée sur Bob, des cartes de glossaire et de l'XP.

Rejouer une phase ne rapporte que l'amélioration par rapport à son meilleur score : l'XP reste bornée (250 par niveau).

## Architecture

```
src/
  content/        Contenu pédagogique typé (niveaux, cartes, tuteur hors-ligne)
    levels/       level0.ts, level1.ts, index.ts (registre + niveaux à venir)
  game/           Cœur déterministe : état, XP, sauvegarde, révision, harnais
  levels/         Lecteur de niveau (5 phases) et illustrations des concepts
  minigames/      Mini-jeux (registre + un dossier par jeu)
  screens/        Accueil, carte, collection, révision, réglages
  sprites/        Moteur de pixel art (SVG), Bob et ses calques, boss, icônes
  ai/             Couche IA optionnelle et isolée
  ui/             Composants partagés (barre du haut, dialogues, cartes…)
```

- **Cœur entièrement simulé et déterministe** : aucun `Math.random()` dans ce qui touche au score ; les mélanges utilisent un générateur à graine.
- **Pixel art en code** : chaque sprite est une grille de couleurs de la palette Sweetie 16, rendue en SVG net à toute taille. Chaque pièce de harnais est un calque superposé à Bob. La route cachée `#/atelier-sprites` affiche tous les sprites (pratique pour dessiner ceux des prochains niveaux).
- **Aucune dépendance réseau** : polices embarquées, aucune requête externe tant qu'aucun modèle n'est connecté.

## La couche « IA réelle » (optionnelle)

Le jeu est entièrement jouable sans IA. En option, un vrai modèle peut animer trois fonctions :

| Usage | Avec un modèle | Sans modèle (ou en cas d'erreur) |
|---|---|---|
| Tuteur (bouton « Tuteur » en haut) | Réponse sur mesure, ancrée dans le contenu du niveau | Réponse prédéfinie la plus proche de la question |
| Évaluation du boss final | Note de la grille + retour personnalisé d'un juge (LLM-as-judge) | Note et retour de la grille déterministe |
| Labo de prompt injection (niveau 11) | Un vrai modèle lit l'attaque, le harnais applique les défenses | Simulation déterministe des comportements typiques |

**Les scores et l'XP ne dépendent jamais du modèle** : pour le boss final, la note vient toujours de la grille déterministe, le juge ne fait que commenter.

Connexion : *Réglages → IA réelle → Connecter un modèle Anthropic*, coller sa clé API, charger la liste des modèles (récupérée depuis l'API, rien n'est codé en dur), puis « Tester et enregistrer ». Le panneau « Tester la couche IA » lance un exemple de chacun des trois usages.

Confidentialité :
- la clé est stockée à part de la sauvegarde (`gitgudai.ia`), jamais incluse dans l'export ;
- sans « mémoriser », elle est oubliée à la fermeture de l'onglet ;
- les appels partent directement du navigateur vers l'API Anthropic (SDK officiel, chargé seulement quand un modèle est connecté) et sont facturés sur ton compte.

Pour ajouter un autre fournisseur, il suffit d'implémenter l'interface `AIProvider` de `src/ai/types.ts` et de la brancher dans `src/ai/client.ts`.

## Sauvegarde

La progression est enregistrée automatiquement dans `localStorage` (clé `gitgudai.save`). Une sauvegarde corrompue est mise de côté (`gitgudai.save.corrompue`) plutôt que perdue. Les réglages permettent d'exporter la progression en JSON, de la réimporter et de la réinitialiser.

## Accessibilité

- Police pixel ou police lisible (Atkinson Hyperlegible), taille du texte 100 / 115 / 130 %.
- Vitesse des dialogues réglable, effets d'écran désactivables, respect de `prefers-reduced-motion`.
- Navigation complète au clavier (boss : touches 1 à 4), états jamais signalés par la seule couleur.

## Ajouter un niveau

Voir [docs/AJOUTER-UN-NIVEAU.md](docs/AJOUTER-UN-NIVEAU.md). Les tests de `src/content/content.test.ts` vérifient automatiquement que chaque niveau respecte le format commun.
