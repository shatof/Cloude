import type { GlossaryCard, LevelDefinition } from '../types';

export const level6Cards: GlossaryCard[] = [
  {
    id: 'context-engineering',
    term: 'Context engineering',
    levelId: 'l6',
    definition:
      'Art de choisir, à chaque tour, ce qui entre dans le contexte du modèle (consignes, outils, mémoire, documents, historique) et sous quelle forme, pour qu’il ait tout ce qui compte et rien de superflu.',
    analogy: 'Faire sa valise cabine : dix kilos, pas un de plus, donc seulement ce qui servira vraiment pendant le voyage.',
    example: 'Pour corriger un exercice : consignes, énoncé, réponse d’Inès, le chapitre utile et trois outils. Pas les 300 pages ni trois mois d’historique.',
    pitfall: {
      myth: 'Plus on donne de contexte au modèle, meilleures sont ses réponses.',
      truth: 'Au-delà de l’utile, chaque token ajouté coûte, ralentit et dilue l’attention du modèle.',
    },
    rarity: 'épique',
    icon: 'context-engineering',
  },
  {
    id: 'skill',
    term: 'Skill',
    levelId: 'l6',
    definition:
      'Dossier d’instructions, parfois accompagné de scripts ou de modèles, pour une tâche précise. Seule sa courte description reste en permanence dans le contexte ; le contenu complet n’est chargé que lorsque la tâche le demande.',
    analogy: 'Le classeur de fiches recettes : on ne garde sous les yeux que le sommaire, puis on ouvre la seule fiche dont on a besoin ce soir.',
    example: 'La description de `fiche-revision` tient en une ligne ; ses instructions complètes (1 200 tokens) ne sont lues que quand Inès demande une fiche.',
    pitfall: {
      myth: 'Une skill, c’est un nouveau modèle spécialisé.',
      truth: 'C’est du contexte chargé à la demande : le modèle reste le même.',
    },
    rarity: 'rare',
    icon: 'skill',
  },
  {
    id: 'context-rot',
    term: 'Dégradation du contexte',
    levelId: 'l6',
    definition:
      'Baisse de qualité des réponses quand le contexte s’allonge ou se salit : informations perdues au milieu (« lost in the middle »), distraction par le superflu, empoisonnement par une erreur qui se répète.',
    analogy: 'Le bureau couvert de papiers : la feuille importante se perd au milieu de la pile, et un vieux brouillon faux finit recopié comme s’il était juste.',
    example: 'Une date fausse notée en mémoire il y a un mois ressort dans chaque réponse de Bob.',
    pitfall: {
      myth: 'Si une information est dans le contexte, le modèle l’utilisera forcément.',
      truth: 'Noyée au milieu d’un très long contexte, elle peut être ignorée : la place et la quantité comptent.',
    },
    rarity: 'rare',
    icon: 'context-rot',
  },
];

export const level6: LevelDefinition = {
  id: 'l6',
  order: 6,
  badge: '6',
  title: 'Context engineering et skills',
  shortTitle: 'Contexte',
  concept: 'Budget de tokens, chargement à la demande (skills), dégradation du contexte : lost-in-the-middle, empoisonnement.',
  zone: 'bibliotheque',
  harnessPieceId: 'skill-cartridges',
  content: {
    problem: {
      mission: {
        title: 'La valise qui déborde',
        brief: 'Bob a maintenant de la mémoire, des documents et des outils. Inès décide de tout lui donner, tout le temps.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Inès branche tout sur Bob : 60 outils, toutes ses notes, les 300 pages du poly et trois mois d’historique.',
        },
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'Rappelle-moi la consigne du prof pour le rendu du projet.' },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Le rendu se fait… par mail, je crois ?' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'La consigne (« dépôt sur Moodle avant vendredi 18 h ») était bien dans le contexte, mais noyée au milieu de 150 000 tokens.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Chaque réponse prend désormais 40 secondes, même pour dire bonjour.' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Tout charger à chaque tour coûte cher et ralentit tout, même quand presque rien ne sert.',
        },
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'Au fait, mon partiel de réseaux, c’est quand ?' },
        { kind: 'say', speaker: 'bob', mood: 'proud', text: 'Le 21 janvier ! C’est écrit dans mes notes.' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Une erreur glissée dans les notes il y a un mois (21 au lieu de 12) empoisonne toutes les réponses depuis.',
        },
      ],
      summary:
        'Plus de contexte n’est pas mieux. Le contexte est un **budget** : il faut y mettre **le bon contenu au bon moment**, charger le reste **à la demande**, et le **garder propre**.',
      question: 'Comment choisir ce qui entre dans le contexte ?',
    },
    concept: [
      {
        id: 'budget',
        title: 'Le contexte est un budget',
        body:
          'Chaque token du contexte se paie : en argent, en temps de réponse, et en attention, car le modèle doit tout prendre en compte à chaque tour. Le **context engineering** consiste à choisir ce qui entre : consignes, outils utiles, notes pertinentes, passages retrouvés, résumé de l’historique.\n\nLe reste attend dehors : recherché si besoin, résumé, ou simplement retiré.',
        analogy: {
          title: 'La valise cabine',
          text: 'Dix kilos maximum. Tu ne prends pas « tout, au cas où » : tu choisis ce qui servira vraiment pendant le voyage, et le reste peut s’acheter ou se trouver sur place.',
        },
        takeaway: 'Le contexte est limité et coûteux : on y met ce qui compte pour la tâche, rien de plus.',
        illustration: 'l6-budget',
      },
      {
        id: 'skills',
        title: 'Les skills : charger à la demande',
        body:
          'Une **skill** est un dossier d’instructions pour une tâche précise : faire une fiche de révision, relire du code, mettre en page un CV. Elle peut contenir des scripts et des modèles.\n\nLe harnais ne met dans le contexte que **le nom et la description** de chaque skill, une ligne chacune. Quand une tâche correspond, l’agent ouvre la skill et charge son contenu complet. Même principe pour les outils : on n’expose que ceux qui servent.',
        analogy: {
          title: 'Le classeur de fiches recettes',
          text: 'Tu ne relis pas tout le classeur avant de cuisiner. Tu parcours le sommaire, puis tu ouvres la seule fiche dont tu as besoin ce soir.',
        },
        takeaway: 'Une ligne de description en permanence, le contenu complet seulement quand il sert.',
        illustration: 'l6-skills',
      },
      {
        id: 'rot',
        title: 'Quand le contexte se dégrade',
        body:
          'Un contexte trop long ou sale fait baisser la qualité. Trois maladies classiques :\n\n- **perdu au milieu** : une information noyée au milieu d’un long contexte est moins bien exploitée qu’au début ou à la fin ;\n- **surcharge** : trop d’outils et de documents inutiles distraient le modèle ;\n- **empoisonnement** : une erreur entrée dans le contexte ou la mémoire est reprise encore et encore.\n\nRemèdes : contexte court, infos clés au début ou à la fin, résumés, notes vérifiées avant d’être écrites.',
        analogy: {
          title: 'Le bureau encombré',
          text: 'Sur un bureau couvert de papiers, la feuille importante se perd au milieu de la pile, et un vieux brouillon faux finit recopié comme s’il était juste.',
        },
        takeaway: 'Un contexte court, ordonné et propre vaut mieux qu’un contexte énorme.',
        illustration: 'l6-rot',
      },
    ],
    minigame: {
      id: 'context-suitcase',
      title: 'La valise de contexte',
      intro:
        'Trois manches : **remplir le contexte** de Bob sous un budget de tokens, **choisir la skill** à charger pour chaque demande, puis **diagnostiquer** les maladies du contexte.',
      xp: 60,
    },
    boss: {
      name: 'L’Entasseur',
      sprite: 'entasseur',
      intro: 'Moi, je prends tout ! Tous les outils, tous les documents, tout l’historique. On ne sait jamais !',
      victory: 'Bon… peut-être que je n’avais pas besoin des 300 pages pour dire bonjour.',
      defeat: 'Ha ! Encore un peu de place pour trois mois d’historique !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-more',
          prompt: 'Donner plus de contexte au modèle améliore-t-il toujours ses réponses ?',
          choices: [
            { id: 'a', text: 'Oui, plus il en sait, mieux c’est.', feedback: 'C’est le credo de l’Entasseur, et c’est faux.' },
            { id: 'b', text: 'Oui, tant que ça tient dans la fenêtre.', feedback: 'Même dans la fenêtre, le superflu coûte et distrait.' },
            {
              id: 'c',
              text: 'Non : au-delà de l’utile, ça coûte, ralentit et dilue l’attention.',
              correct: true,
              feedback: 'Exact : le contexte est un budget.',
            },
            { id: 'd', text: 'Non, le modèle ignore tout ce qui dépasse une page.', feedback: 'Il ne s’arrête pas à une page : c’est une question de qualité, pas de limite fixe.' },
          ],
          explanation: 'Le bon contexte, c’est tout ce qui compte et rien de superflu.',
        },
        {
          id: 'q-skill',
          prompt: 'Qu’est-ce qui reste en permanence dans le contexte quand un agent dispose de skills ?',
          choices: [
            {
              id: 'a',
              text: 'Le nom et la courte description de chaque skill.',
              correct: true,
              feedback: 'Oui : le contenu complet n’est chargé qu’à la demande.',
            },
            { id: 'b', text: 'Le contenu complet de toutes les skills.', feedback: 'C’est justement ce qu’on évite : des milliers de tokens pour rien.' },
            { id: 'c', text: 'Rien : l’agent devine quelle skill existe.', feedback: 'Il faut bien qu’il sache qu’elles existent : d’où les descriptions.' },
            { id: 'd', text: 'Les poids d’un modèle spécialisé.', feedback: 'Une skill n’est pas un modèle : c’est du contexte.' },
          ],
          explanation: 'Une ligne de description en permanence, le contenu complet quand la tâche le demande.',
        },
        {
          id: 'q-middle',
          prompt: 'Que décrit l’effet « lost in the middle » ?',
          choices: [
            { id: 'a', text: 'Un agent qui s’arrête au milieu de sa tâche.', feedback: 'Rien à voir avec l’arrêt de la boucle.' },
            {
              id: 'b',
              text: 'Une information noyée au milieu d’un long contexte, moins bien exploitée.',
              correct: true,
              feedback: 'Exact : le début et la fin sont mieux pris en compte.',
            },
            { id: 'c', text: 'Un token coupé en deux par le tokenizer.', feedback: 'C’est une autre histoire (niveau 0).' },
            { id: 'd', text: 'Une requête perdue sur le réseau.', feedback: 'Ce n’est pas un problème réseau.' },
          ],
          explanation: 'Placer les consignes clés au début ou à la fin, et garder le contexte court.',
        },
        {
          id: 'q-poison',
          prompt: 'Une date fausse a été notée dans la mémoire de Bob. Quel est le risque ?',
          choices: [
            { id: 'a', text: 'Aucun : le modèle la corrigera tout seul.', feedback: 'Il fait plutôt confiance à son contexte.' },
            { id: 'b', text: 'Bob va planter.', feedback: 'Il ne plante pas : il répond avec assurance… et se trompe.' },
            { id: 'c', text: 'La mémoire va s’effacer.', feedback: 'Au contraire, l’erreur y reste et revient.' },
            {
              id: 'd',
              text: 'Elle sera relue et répétée dans toutes les réponses suivantes.',
              correct: true,
              feedback: 'Oui : c’est l’empoisonnement du contexte.',
            },
          ],
          explanation: 'Vérifier une information avant de l’écrire en mémoire, et corriger les notes fausses.',
        },
        {
          id: 'q-tools',
          prompt: 'Bob a 60 outils chargés et se trompe souvent d’outil. Que faire ?',
          choices: [
            { id: 'a', text: 'En ajouter d’autres pour couvrir plus de cas.', feedback: 'Ça aggrave la confusion.' },
            {
              id: 'b',
              text: 'N’exposer que les outils utiles à la tâche, ou les charger à la demande.',
              correct: true,
              feedback: 'Exact : moins de choix, mieux décrits, meilleures décisions.',
            },
            { id: 'c', text: 'Changer de modèle.', feedback: 'Le problème vient du contexte, pas du cerveau.' },
            { id: 'd', text: 'Écrire toutes les descriptions en majuscules.', feedback: 'Crier n’aide pas : il faut réduire le choix.' },
          ],
          explanation: 'Trop d’outils, c’est de la surcharge : on filtre ou on charge à la demande.',
        },
        {
          id: 'q-history',
          prompt: 'Trois mois d’historique encombrent le contexte. Quelle est la meilleure option ?',
          choices: [
            { id: 'a', text: 'Tout garder, au cas où.', feedback: 'Lent, cher, et l’essentiel est noyé.' },
            { id: 'b', text: 'Tout effacer, même les décisions importantes.', feedback: 'On perdrait des informations utiles.' },
            {
              id: 'c',
              text: 'Le remplacer par un résumé des décisions et des faits utiles.',
              correct: true,
              feedback: 'Oui : l’essentiel en quelques lignes.',
            },
            { id: 'd', text: 'Le traduire en anglais pour gagner de la place.', feedback: 'Le gain serait minime, et le problème resterait entier.' },
          ],
          explanation: 'Résumer garde l’essentiel pour une fraction du budget.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob est plus rapide et plus juste depuis ses cartouches de skills. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Il a reçu un modèle plus grand.', feedback: 'Non : c’est toujours le même modèle.' },
            { id: 'b', text: 'Sa fenêtre de contexte a doublé.', feedback: 'Elle n’a pas bougé : c’est son contenu qui a changé.' },
            {
              id: 'c',
              text: 'Son harnais choisit ce qui entre dans le contexte et charge le reste à la demande.',
              correct: true,
              feedback: 'Exactement : même cerveau, contexte mieux choisi.',
            },
            { id: 'd', text: 'Inès pose des questions plus simples.', feedback: 'Elle pose les mêmes questions.' },
          ],
          explanation: 'Le contexte est fabriqué par le harnais : c’est là que se joue la qualité.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['context-engineering', 'skill', 'context-rot'],
      message:
        'Mes cartouches de skills ! Je garde un contexte léger, je charge la bonne cartouche quand la tâche le demande, et je fais le ménage dans mes notes. Même cerveau, mais les idées claires.',
    },
    tutor: {
      suggestions: ['t6-context', 't6-skill', 't6-middle', 't6-poison'],
      entries: [
        {
          id: 't6-context',
          question: 'C’est quoi, le context engineering ?',
          keywords: ['context', 'engineering', 'contexte', 'choisir', 'budget', 'valise'],
          answer:
            'C’est l’art de choisir ce qui entre dans le contexte du modèle à chaque tour : consignes, outils utiles, notes pertinentes, passages retrouvés, résumé de l’historique. Chaque token coûte (argent, temps, attention), donc on met tout ce qui compte et rien de superflu. Comme une valise cabine : dix kilos, pas un de plus.',
        },
        {
          id: 't6-skill',
          question: 'C’est quoi, une skill ?',
          keywords: ['skill', 'skills', 'cartouche', 'demande', 'charger', 'description'],
          answer:
            'Une skill est un dossier d’instructions (parfois avec des scripts ou des modèles) pour une tâche précise. Le harnais ne garde dans le contexte que son nom et une ligne de description ; quand une demande correspond, l’agent charge le contenu complet. C’est du contexte à la demande, pas un nouveau modèle.',
        },
        {
          id: 't6-middle',
          question: 'C’est quoi, « lost in the middle » ?',
          keywords: ['lost', 'middle', 'milieu', 'perdu', 'long', 'debut', 'fin'],
          answer:
            'Des travaux de recherche ont montré que les modèles exploitent moins bien une information placée au milieu d’un très long contexte qu’au début ou à la fin. Conséquences pratiques : garder le contexte court, et placer les consignes importantes au début ou à la fin.',
        },
        {
          id: 't6-poison',
          question: 'C’est quoi, l’empoisonnement du contexte ?',
          keywords: ['empoisonnement', 'poison', 'erreur', 'fausse', 'repete', 'memoire', 'hallucination'],
          answer:
            'C’est quand une information fausse entre dans le contexte ou la mémoire (une hallucination, une erreur de saisie, une page Web douteuse) et se retrouve relue à chaque tour : le modèle la répète avec assurance. Remède : vérifier avant d’écrire en mémoire, corriger les notes fausses, et se méfier des contenus non fiables (on y reviendra au niveau 11).',
        },
        {
          id: 't6-rot',
          question: 'Pourquoi un contexte trop long dégrade-t-il les réponses ?',
          keywords: ['degradation', 'rot', 'trop', 'long', 'qualite', 'baisse', 'surcharge'],
          answer:
            'Parce que le modèle doit répartir son attention sur tout ce qui s’y trouve. Plus il y a de superflu, plus l’essentiel est dilué : informations perdues au milieu, mauvais choix d’outils parmi trop d’options, contradictions entre vieilles et nouvelles infos. Sans compter le coût et la lenteur.',
        },
        {
          id: 't6-tools',
          question: 'Faut-il donner tous les outils à l’agent ?',
          keywords: ['outils', 'tous', 'nombre', 'trop', 'filtrer', 'choix'],
          answer:
            'Non. Chaque outil exposé prend de la place (sa définition) et ajoute un choix possible. Avec des dizaines d’outils, l’agent se trompe plus souvent. Mieux vaut n’exposer que les outils utiles à la tâche, ou permettre de les découvrir et de les charger à la demande, comme les skills.',
        },
      ],
    },
  },
};
