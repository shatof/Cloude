import type { GlossaryCard, LevelDefinition } from '../types';

export const level5Cards: GlossaryCard[] = [
  {
    id: 'long-term-memory',
    term: 'Mémoire long terme',
    levelId: 'l5',
    definition:
      'Informations conservées en dehors du modèle (fichiers, base de données) que le harnais relit au début d’une session ou à la demande. La mémoire court terme, elle, n’est que le contexte de la conversation en cours.',
    analogy: 'Le carnet qu’on relit le lendemain, alors que le post-it du bureau part à la poubelle chaque soir.',
    example: 'Bob note « Inès : L3 info, partiel de réseaux le 12 janvier, aime les schémas » dans `memoire.md`, rechargé à chaque session.',
    pitfall: {
      myth: 'Le modèle apprend de chaque conversation et s’en souvient tout seul.',
      truth: 'Ses poids ne changent pas : sans un harnais qui écrit et relit des notes, tout est oublié à la fin de la session.',
    },
    rarity: 'rare',
    icon: 'long-term-memory',
  },
  {
    id: 'rag',
    term: 'RAG',
    levelId: 'l5',
    definition:
      'Retrieval-Augmented Generation (génération augmentée par la recherche) : avant de répondre, le harnais cherche les passages pertinents dans des documents, les place dans le contexte, et le modèle répond à partir d’eux, en citant ses sources.',
    analogy: 'Le bibliothécaire qui ne connaît pas tous les livres par cœur, mais sait poser sur ta table les trois pages qui répondent à ta question.',
    example: 'Le poly de 300 pages est découpé en passages ; pour une question, on en retrouve trois (p. 212, 214, 37) et Bob répond en citant la page 214.',
    pitfall: {
      myth: 'Avec la recherche, le modèle ne peut plus se tromper.',
      truth: 'Si les passages retrouvés sont mauvais ou incomplets, la réponse le sera aussi : la qualité de la recherche compte autant que le modèle.',
    },
    rarity: 'épique',
    icon: 'rag',
  },
  {
    id: 'prompt-caching',
    term: 'Prompt caching',
    levelId: 'l5',
    definition:
      'Mise en cache, chez le fournisseur du modèle, du calcul d’un début de prompt identique d’une requête à l’autre. Réutiliser ce préfixe coûte moins cher et répond plus vite ; changer quoi que ce soit au début invalide le cache à partir de là.',
    analogy: 'La mise en place du chef : légumes coupés et sauces prêtes le matin, réutilisées pour chaque commande du service.',
    example: 'Consignes + outils + poly en premier (stables, en cache), puis la question d’Inès à la fin (variable).',
    pitfall: {
      myth: 'Le cache rend le modèle plus intelligent ou change ses réponses.',
      truth: 'Il évite seulement de recalculer le même début : le modèle voit exactement le même contexte.',
    },
    rarity: 'rare',
    icon: 'prompt-caching',
  },
];

export const level5: LevelDefinition = {
  id: 'l5',
  order: 5,
  badge: '5',
  title: 'La mémoire',
  shortTitle: 'Mémoire',
  concept: 'Mémoire court terme et long terme, RAG, mémoire sur fichiers et caching.',
  zone: 'bibliotheque',
  harnessPieceId: 'memory-pack',
  content: {
    problem: {
      mission: {
        title: 'Le poisson rouge',
        brief: 'Bob planifie comme un chef. Mais Inès revient le lendemain… et découvre que Bob ne se souvient de rien.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès (lundi)',
          text: 'Je suis en L3 info, mon partiel de réseaux est le 12 janvier, et j’aime les explications avec des schémas.',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'C’est noté !' },
        { kind: 'say', speaker: 'user', who: 'Inès (mardi)', text: 'Tu peux me faire un planning de révision avant mon partiel ?' },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Avec plaisir ! Quel partiel ? À quelle date ? Tu es en quelle année ?' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Une nouvelle conversation repart d’un contexte vide : tout ce qu’Inès a dit lundi a disparu.',
        },
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'Dans mon poly de 300 pages, quel exercice le prof conseille-t-il de refaire avant le partiel ?' },
        { kind: 'say', speaker: 'bob', mood: 'neutral', text: 'Sans doute l’exercice sur le modèle OSI, c’est un grand classique !' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Bob n’a pas accès au poly : il invente une réponse plausible. La bonne réponse était l’exercice 7, page 214.',
        },
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Inès colle alors le poly entier dans chaque message. Bob répond juste… mais chaque question met une éternité et coûte cher.',
        },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Les 300 pages sont recalculées à chaque question, alors que deux ou trois passages suffisaient.',
        },
      ],
      summary:
        'Le cerveau de Bob ne garde rien entre deux sessions : il ne voit que son contexte. Pour se souvenir, le harnais doit **écrire et relire** ce qui compte, **aller chercher** les bons passages au lieu de tout charger, et **réutiliser** le calcul déjà fait.',
      question: 'Comment donner de la mémoire à un agent ?',
    },
    concept: [
      {
        id: 'short-long',
        title: 'Court terme, long terme',
        body:
          'La **mémoire court terme** d’un agent, c’est son contexte : la conversation en cours, les résultats d’outils. Elle disparaît à la fin de la session, ou quand la fenêtre déborde.\n\nLa **mémoire long terme** vit en dehors du modèle : des fichiers ou une base de données que le harnais relit au démarrage. De plus en plus, l’agent l’entretient lui-même avec des outils : il note les préférences d’Inès, corrige ce qui a changé, oublie ce qui ne sert plus.',
        analogy: {
          title: 'Le post-it et le carnet',
          text: 'Sur ton bureau, les post-it t’aident pendant la journée, puis finissent à la poubelle. Ce qui doit durer, tu le recopies dans ton carnet, que tu relis le lendemain matin.',
        },
        takeaway: 'Court terme = le contexte, qui s’efface. Long terme = des notes écrites hors du modèle, que le harnais relit.',
        illustration: 'l5-memory',
      },
      {
        id: 'rag',
        title: 'Le RAG : chercher avant de répondre',
        body:
          'Le poly fait 300 pages : inutile de tout charger pour une question. Avec le **RAG** (génération augmentée par la recherche), on découpe d’abord les documents en petits passages. À chaque question, le harnais retrouve les passages les plus proches, souvent grâce à des *embeddings* (des listes de nombres qui représentent le sens d’un texte), et les place dans le contexte.\n\nLe modèle répond à partir de ces passages et peut citer la page : la réponse devient vérifiable.',
        analogy: {
          title: 'Le bibliothécaire',
          text: 'Un bon bibliothécaire n’a pas lu tous les livres par cœur. Mais il sait où chercher : en deux minutes, il pose sur ta table les trois pages qui répondent à ta question.',
        },
        takeaway: 'RAG : retrouver les bons passages, les mettre dans le contexte, répondre en citant ses sources.',
        illustration: 'l5-rag',
      },
      {
        id: 'cache',
        title: 'Ne pas tout recalculer : le prompt caching',
        body:
          'D’une question à l’autre, le début du prompt est souvent identique : consignes, outils, documents. Le **prompt caching** permet au fournisseur du modèle de garder en mémoire le calcul de ce début et de le réutiliser : la réponse arrive plus vite et coûte moins cher.\n\nRègle d’or : mettre le **stable au début** et le **variable à la fin**. Une date, ou une virgule modifiée tout au début, et le cache ne sert plus à partir de là.',
        analogy: {
          title: 'La mise en place du chef',
          text: 'Le matin, le chef coupe ses légumes et prépare ses sauces. Pendant le service, chaque commande réutilise cette préparation : seule la fin de la recette change. S’il change la sauce de base, il doit tout refaire.',
        },
        takeaway: 'Un début de prompt identique se réutilise : plus rapide, moins cher. Le stable d’abord, le variable ensuite.',
        illustration: 'l5-cache',
      },
    ],
    minigame: {
      id: 'librarian',
      title: 'Le bibliothécaire',
      intro:
        'Trois manches : **trier** ce que Bob doit retenir, **choisir les bons passages** à donner au modèle, puis **organiser** le prompt et la mémoire pour qu’ils servent longtemps.',
      xp: 60,
    },
    boss: {
      name: 'Le Poisson rouge',
      sprite: 'poisson',
      intro: 'Bonjour ! On se connaît ? Moi, je ne retiens rien, et je m’en porte très bien. Bonjour ! On se connaît ?',
      victory: 'Attends, je note ça quelque part… Où est-ce que je l’ai mis, déjà ?',
      defeat: 'Bravo ! Euh… bravo pour quoi, déjà ?',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-short',
          prompt: 'Qu’est-ce que la mémoire court terme d’un agent ?',
          choices: [
            { id: 'a', text: 'Les poids du modèle.', feedback: 'Les poids contiennent ce qui a été appris à l’entraînement, pas la conversation.' },
            { id: 'b', text: 'Un fichier relu à chaque session.', feedback: 'Ça, c’est de la mémoire long terme.' },
            {
              id: 'c',
              text: 'Le contexte de la session en cours.',
              correct: true,
              feedback: 'Exact : ce que le modèle voit maintenant, qui s’efface ensuite.',
            },
            { id: 'd', text: 'Le disque dur de l’ordinateur.', feedback: 'Le modèle ne lit rien de lui-même : seul le contexte compte.' },
          ],
          explanation: 'Court terme = le contexte. Il disparaît à la fin de la session ou quand la fenêtre déborde.',
        },
        {
          id: 'q-long',
          prompt: 'Comment Bob peut-il se souvenir la semaine prochaine qu’Inès aime les schémas ?',
          choices: [
            {
              id: 'a',
              text: 'En l’écrivant dans un fichier de mémoire que le harnais relit à chaque session.',
              correct: true,
              feedback: 'Oui : la mémoire long terme vit hors du modèle.',
            },
            { id: 'b', text: 'En le répétant très fort dans la conversation.', feedback: 'La conversation s’efface à la fin de la session.' },
            { id: 'c', text: 'En modifiant ses propres poids.', feedback: 'Un agent ne modifie pas ses poids en cours d’usage.' },
            { id: 'd', text: 'Il n’a rien à faire, il s’en souviendra.', feedback: 'C’est exactement l’erreur du début du niveau.' },
          ],
          explanation: 'Pour durer, une information doit être écrite hors du modèle, puis relue.',
        },
        {
          id: 'q-rag',
          prompt: 'Que fait le harnais dans un système RAG, avant que le modèle réponde ?',
          choices: [
            { id: 'a', text: 'Il réentraîne le modèle sur les documents.', feedback: 'Aucun entraînement : on cherche et on place dans le contexte.' },
            {
              id: 'b',
              text: 'Il cherche les passages pertinents et les place dans le contexte.',
              correct: true,
              feedback: 'Exact : récupérer, puis générer à partir de ce qui a été trouvé.',
            },
            { id: 'c', text: 'Il colle tous les documents en entier.', feedback: 'C’est justement ce que le RAG évite.' },
            { id: 'd', text: 'Il demande à l’utilisateur de chercher lui-même.', feedback: 'Le but est que l’agent trouve les passages.' },
          ],
          explanation: 'RAG = Retrieval-Augmented Generation : la recherche nourrit la génération.',
        },
        {
          id: 'q-embedding',
          prompt: 'À quoi servent les embeddings dans la recherche de passages ?',
          choices: [
            { id: 'a', text: 'À compresser les fichiers pour gagner de la place.', feedback: 'Ce n’est pas leur rôle : ils représentent le sens.' },
            { id: 'b', text: 'À traduire les documents en anglais.', feedback: 'Aucune traduction ici.' },
            { id: 'c', text: 'À chiffrer les données.', feedback: 'Rien à voir avec la sécurité.' },
            {
              id: 'd',
              text: 'À représenter le sens des textes par des nombres, pour retrouver ceux qui sont proches d’une question.',
              correct: true,
              feedback: 'Oui : deux textes au sens voisin ont des embeddings voisins.',
            },
          ],
          explanation: 'Un embedding est une liste de nombres qui capture le sens : on compare ces listes pour trouver les passages proches.',
        },
        {
          id: 'q-wrong-chunks',
          prompt: 'La recherche ramène des passages sur UDP alors qu’Inès demande TCP. Que risque la réponse ?',
          choices: [
            {
              id: 'a',
              text: 'D’être fausse, car le modèle s’appuie sur ce qu’on lui donne.',
              correct: true,
              feedback: 'Exact : de mauvais passages donnent une mauvaise réponse.',
            },
            { id: 'b', text: 'Rien : le modèle corrigera toujours tout seul.', feedback: 'Pas toujours : il fait confiance à son contexte.' },
            { id: 'c', text: 'D’être plus rapide.', feedback: 'La vitesse n’est pas le problème ici.' },
            { id: 'd', text: 'Le RAG refusera de répondre.', feedback: 'Le RAG n’a pas de garde-fou magique contre ça.' },
          ],
          explanation: 'La qualité de la recherche compte autant que celle du modèle.',
        },
        {
          id: 'q-cache',
          prompt: 'Pour profiter au mieux du prompt caching, comment ordonner le prompt ?',
          choices: [
            { id: 'a', text: 'La question d’abord, les consignes à la fin.', feedback: 'La question change à chaque fois : le cache ne servirait jamais.' },
            { id: 'b', text: 'La date et l’heure tout au début.', feedback: 'Elles changent à chaque requête : tout le reste serait recalculé.' },
            {
              id: 'c',
              text: 'Les parties stables (consignes, outils, documents) d’abord, la partie variable à la fin.',
              correct: true,
              feedback: 'Oui : le long début identique est réutilisé d’une requête à l’autre.',
            },
            { id: 'd', text: 'Dans un ordre différent à chaque fois.', feedback: 'Le cache demande justement un début identique.' },
          ],
          explanation: 'Le cache réutilise un préfixe identique : le stable d’abord, le variable ensuite.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob se souvient enfin d’Inès d’une semaine à l’autre. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Son modèle a appris Inès par cœur.', feedback: 'Ses poids n’ont pas bougé.' },
            { id: 'b', text: 'Sa fenêtre de contexte est devenue infinie.', feedback: 'Elle a toujours la même taille.' },
            { id: 'c', text: 'Inès lui répète tout à chaque fois.', feedback: 'Justement, elle n’a plus besoin de le faire.' },
            {
              id: 'd',
              text: 'Son harnais écrit des notes, les relit et va chercher les bons documents.',
              correct: true,
              feedback: 'Exactement : même cerveau, harnais avec mémoire.',
            },
          ],
          explanation: 'La mémoire d’un agent est une affaire de harnais : écrire, relire, retrouver.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['long-term-memory', 'rag', 'prompt-caching'],
      message:
        'Mon sac à mémoire ! J’y range mes notes d’une session à l’autre, je sais retrouver les bonnes pages, et je ne recalcule plus ce qui ne change pas. Même cerveau, mais je n’oublie plus Inès.',
    },
    tutor: {
      suggestions: ['t5-short-long', 't5-rag', 't5-embedding', 't5-cache'],
      entries: [
        {
          id: 't5-short-long',
          question: 'Quelle différence entre mémoire court terme et long terme ?',
          keywords: ['court', 'long', 'terme', 'memoire', 'difference', 'souvenir', 'oublie'],
          answer:
            'La mémoire court terme, c’est le contexte : la conversation en cours et les résultats d’outils. Elle s’efface à la fin de la session. La mémoire long terme est écrite hors du modèle (fichiers, base de données) et relue par le harnais au démarrage ou à la demande. C’est la différence entre un post-it jeté le soir et un carnet relu le lendemain.',
        },
        {
          id: 't5-file',
          question: 'Comment un agent écrit-il sa propre mémoire ?',
          keywords: ['ecrire', 'fichier', 'fichiers', 'notes', 'note', 'memoire', 'markdown', 'outil'],
          answer:
            'Le harnais lui donne des outils pour lire et écrire des notes, souvent de simples fichiers texte. L’agent y consigne ce qui doit durer (préférences, décisions, avancement), corrige ce qui change et supprime ce qui ne sert plus. Au début de chaque session, le harnais recharge ces notes dans le contexte.',
        },
        {
          id: 't5-rag',
          question: 'C’est quoi, le RAG ?',
          keywords: ['rag', 'retrieval', 'recherche', 'passages', 'documents', 'bibliothecaire', 'chercher'],
          answer:
            'RAG veut dire Retrieval-Augmented Generation, génération augmentée par la recherche. On découpe les documents en passages ; pour chaque question, le harnais retrouve les plus pertinents, les met dans le contexte, et le modèle répond à partir d’eux en citant ses sources. Comme un bibliothécaire qui pose sur ta table les trois pages utiles.',
        },
        {
          id: 't5-embedding',
          question: 'C’est quoi, un embedding ?',
          keywords: ['embedding', 'embeddings', 'vecteur', 'vecteurs', 'sens', 'nombres', 'proche', 'similaire'],
          answer:
            'Un embedding est une liste de nombres qui représente le sens d’un texte. Deux textes au sens proche ont des embeddings proches, même s’ils n’emploient pas les mêmes mots. Pour le RAG, on calcule l’embedding de chaque passage et celui de la question, puis on garde les passages les plus proches.',
        },
        {
          id: 't5-cache',
          question: 'C’est quoi, le prompt caching ?',
          keywords: ['cache', 'caching', 'prefixe', 'cout', 'rapide', 'recalculer', 'prix'],
          answer:
            'C’est la réutilisation, chez le fournisseur du modèle, du calcul d’un début de prompt identique d’une requête à l’autre. Consignes, outils et documents stables sont calculés une fois, puis réutilisés : plus rapide et moins cher. La règle : le stable au début, le variable à la fin, car toute modification du début invalide le cache à partir de là.',
        },
        {
          id: 't5-why-not-all',
          question: 'Pourquoi ne pas tout mettre dans le contexte ?',
          keywords: ['tout', 'mettre', 'charger', 'fenetre', 'grande', 'pourquoi', 'entier'],
          answer:
            'Même quand ça tient dans la fenêtre, tout charger coûte cher, ralentit chaque réponse, et noie les informations utiles parmi des centaines de pages inutiles : le modèle les exploite moins bien. Mieux vaut chercher les bons passages. On verra au niveau suivant comment gérer ce budget de contexte.',
        },
      ],
    },
  },
};
