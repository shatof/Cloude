import type { TutorEntry } from './types';

/** Questions auxquelles le tuteur hors-ligne sait répondre partout dans le jeu. */
export const GLOBAL_TUTOR_ENTRIES: TutorEntry[] = [
  {
    id: 'g-brain',
    question: 'Pourquoi ton cerveau ne change-t-il jamais ?',
    keywords: ['cerveau', 'modele', 'change', 'changer', 'jamais', 'intelligent', 'meilleur', 'ameliorer', 'bob'],
    answer:
      'C’est le cœur du jeu : pour obtenir un meilleur agent, on n’a pas toujours besoin d’un meilleur modèle. À modèle égal, le harnais fait une énorme différence : boucle, outils, mémoire, permissions, vérifications… Chaque niveau t’apprend une pièce de harnais et la fixe sur moi. Mon cerveau reste exactement le même, du niveau 0 au boss final. On ne rend pas le cerveau plus intelligent : on lui construit un meilleur harnais.',
  },
  {
    id: 'g-game',
    question: 'Comment fonctionne GitGudAI ?',
    keywords: ['jeu', 'comment', 'fonctionne', 'marche', 'jouer', 'xp', 'niveau', 'niveaux', 'etape', 'etapes', 'regles', 'gitgudai'],
    answer:
      'Chaque niveau suit cinq étapes : j’échoue à une tâche (le problème), tu découvres le concept qui règle ça (3 écrans maximum), tu le manipules dans un mini-jeu, tu affrontes un boss (un quiz expliqué), puis tu gagnes une pièce de harnais, des cartes de glossaire et de l’XP. Tes progrès sont sauvegardés dans ce navigateur.',
  },
  {
    id: 'g-review',
    question: 'À quoi sert le mode révision ?',
    keywords: ['revision', 'reviser', 'revoir', 'flashcard', 'flashcards', 'carte', 'cartes', 'leitner', 'memoriser'],
    answer:
      'Il transforme tes cartes de glossaire en flashcards : définition, analogie, idée reçue à démonter. Tu réponds de tête, tu retournes la carte et tu dis honnêtement si tu savais. Les cartes bien sues reviennent de moins en moins souvent (méthode des boîtes de Leitner). Une carte qui atteint la dernière boîte est maîtrisée et rapporte de l’XP.',
  },
  {
    id: 'g-ai',
    question: 'Peut-on connecter une vraie IA ?',
    keywords: ['ia', 'connecter', 'connexion', 'api', 'cle', 'vraie', 'reelle', 'claude', 'anthropic', 'llm'],
    answer:
      'Oui, en option, dans les Réglages : avec ta propre clé API, le tuteur (moi !), l’évaluation du boss final et le labo d’injection du niveau 11 utilisent un vrai modèle. Sans connexion, ils répondent avec des réponses préparées à l’avance. Le reste du jeu, scores et XP compris, ne dépend jamais de l’IA : il est entièrement simulé.',
  },
];

export const GLOBAL_SUGGESTIONS = ['g-brain', 'g-game'];
