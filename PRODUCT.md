# Product

<!-- impeccable:product-schema 1 -->

> Rédigé à partir du brief initial, sans entretien séparé. Les éléments marqués *(déduit)* sont des inférences à confirmer.

## Platform

web

## Stack

Délégué *(déduit)* : application statique Vite + React + TypeScript, sans serveur. Raison : le jeu doit tourner entièrement dans le navigateur (cœur simulé et déterministe, sauvegarde locale), et le contenu des niveaux sera ajouté un par un sous forme de fichiers typés.

## Users

Étudiant·e en informatique qui connaît le RAG et le fonctionnement global des LLM, mais de façon superficielle. Joue sur ordinateur, en sessions courtes, pour comprendre l'IA agentique jusqu'à l'état de l'art de fin 2026.

## Product Purpose

GitGudAI apprend l'IA agentique en jouant. Chaque niveau part d'un échec concret de la mascotte, explique le concept qui le résout (3 écrans maximum, une analogie par concept), le fait manipuler dans un mini-jeu, le vérifie par un boss (quiz expliqué) et le récompense par une pièce de harnais, une carte de glossaire et de l'XP.

Réussite : l'apprenant sait expliquer pourquoi un agent = modèle + harnais, et quelle pièce du harnais résout quel problème.

## Positioning

La mascotte, Bob Morris, garde le même modèle (« cerveau ») du début à la fin. Seul son harnais s'améliore, pièce après pièce, et reste visible comme un équipement. Message central : on ne rend pas le cerveau plus intelligent, on lui construit un meilleur harnais.

## Operating Context

- Parcours de 13 niveaux (0 à 12) + un boss final, débloqués dans l'ordre.
- Format identique pour chaque niveau : problème → concept → mini-jeu → boss → récompense.
- Mécaniques transversales : accueil avec la mascotte équipée, carte des niveaux avec progression et XP, collection de cartes de glossaire, mode révision (flashcards générées depuis les cartes), sauvegarde dans le navigateur.
- Le contenu des niveaux 2 à 12 et du boss final sera ajouté un par un après la première étape.

## Capabilities and Constraints

- Cœur entièrement simulé et déterministe : le jeu est 100 % jouable sans réseau ni modèle.
- Couche « IA réelle » optionnelle et isolée, pour trois usages seulement : tuteur de la mascotte, évaluation du boss final, labo de prompt injection (niveau 11). Sans modèle connecté, ces usages basculent sur des réponses prédéfinies.
- Le score et l'XP ne dépendent jamais de la couche IA *(déduit, pour garder la progression déterministe)*.
- Langue : français uniquement.

## Brand Commitments

- Nom : GitGudAI. Mascotte : Bob Morris, un agent.
- Ton ludique mais rigoureux : aucun jargon sans explication, une analogie concrète par concept, des écrans courts.
- Direction artistique imposée par le brief : rétro pixel, lisible et jouable sur ordinateur.

## Evidence on Hand

Aucun contenu réel (témoignages, chiffres d'usage) : ne pas en inventer. Les scénarios des niveaux (Inès, réservation de salle…) sont des fictions pédagogiques.

## Product Principles

1. Le modèle ne change jamais ; chaque progrès vient du harnais.
2. Chaque concept naît d'un échec concret de Bob.
3. Court, manipulable, vérifié : expliquer, faire manipuler, puis tester avec des explications.
4. Rigueur avant tout : chaque affirmation technique doit rester vraie fin 2026.
5. L'IA réelle est un bonus, jamais une dépendance.

## Accessibility & Inclusion

- Lisibilité prioritaire : police lisible au choix, taille de texte réglable, effets d'écran désactivables.
- Respect de `prefers-reduced-motion`, navigation complète au clavier, information jamais portée par la seule couleur.
