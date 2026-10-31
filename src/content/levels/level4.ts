import type { GlossaryCard, LevelDefinition } from '../types';

export const level4Cards: GlossaryCard[] = [
  {
    id: 'task-decomposition',
    term: 'Décomposition de tâche',
    levelId: 'l4',
    definition:
      'Découper un objectif trop gros pour être fait d’un coup en sous-tâches petites, vérifiables, avec leurs dépendances (ce qui doit être fini avant quoi).',
    analogy: 'La recette de cuisine : « faire un gâteau » devient peser, mélanger, préchauffer, enfourner, chacun dans le bon ordre.',
    example: '« Organiser la soirée de révisions » devient : sondage des dates, réservation de salle, invitations, commande de pizzas.',
    pitfall: {
      myth: 'Plus on découpe finement, mieux c’est.',
      truth: 'Trop de micro-étapes noient l’essentiel : chaque sous-tâche doit avoir un résultat clair et vérifiable.',
    },
    rarity: 'commune',
    icon: 'task-decomposition',
  },
  {
    id: 'todo-plan',
    term: 'Liste de tâches (plan)',
    levelId: 'l4',
    definition:
      'Plan écrit que le harnais garde visible (dans le contexte ou un fichier) : l’agent y coche ce qui est fait, voit ce qui reste et le met à jour au fil de la mission.',
    analogy: 'La check-list du pilote : même expérimenté, il la suit point par point pour ne rien oublier.',
    example: '[x] Sondage des dates · [x] Réserver la salle · [ ] Envoyer les invitations · [ ] Commander les pizzas',
    pitfall: {
      myth: 'Le modèle garde son plan en tête, inutile de l’écrire.',
      truth: 'Sur une longue mission, un plan non écrit se perd ou s’oublie : l’écrire le garde sous les yeux.',
    },
    rarity: 'rare',
    icon: 'todo-plan',
  },
  {
    id: 'replanning',
    term: 'Replanification',
    levelId: 'l4',
    definition:
      'Mettre le plan à jour quand une observation le contredit (outil en erreur, information nouvelle, demande qui change), au lieu de suivre l’ancien plan à l’aveugle.',
    analogy: 'Le GPS qui recalcule l’itinéraire quand une rue est barrée, sans repartir du point de départ.',
    example: 'La salle C204 est annulée : Bob réserve la B012, puis corrige l’adresse dans les invitations déjà prêtes.',
    pitfall: {
      myth: 'Un bon plan ne change jamais.',
      truth: 'Un bon plan est fait pour être révisé : ce qui compte, c’est de réagir aux observations.',
    },
    rarity: 'rare',
    icon: 'replanning',
  },
];

export const level4: LevelDefinition = {
  id: 'l4',
  order: 4,
  badge: '4',
  title: 'Planifier et décomposer',
  shortTitle: 'Planifier',
  concept: 'Découper une mission en sous-tâches ordonnées, puis ajuster le plan en route.',
  zone: 'atelier',
  harnessPieceId: 'plan-board',
  content: {
    problem: {
      mission: {
        title: 'La soirée de révisions',
        brief:
          'Bob sait réfléchir et utiliser des outils. Inès lui confie une vraie mission, en plusieurs morceaux : organiser la soirée de révisions de la promo.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Organise notre soirée de révisions avant le partiel : trouve une date, une salle, préviens les autres et prévois à manger.',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'Je m’y mets tout de suite ! J’envoie les invitations pour jeudi 18 h et je commande 8 pizzas.' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Les invitations partent sans salle réservée, et les pizzas sont commandées avant de savoir combien de personnes viennent.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Jeudi, 18 h. Aucune salle n’est libre. Treize personnes répondent « présent ».' },
        {
          kind: 'say',
          speaker: 'bob',
          mood: 'confused',
          text: 'Ah. Je réserve une salle… j’ai déjà oublié le sondage des dates… et je ne sais plus où j’en suis.',
        },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Sans plan écrit, Bob perd le fil : il oublie des étapes et ne sait plus ce qui est fait.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Bob finit par réserver la C204. Une heure plus tard, la scolarité annule la réservation.' },
        { kind: 'say', speaker: 'bob', mood: 'neutral', text: 'J’envoie le rappel : « Rendez-vous en C204 ! »' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'L’annulation n’a rien changé au plan de Bob : il continue comme si de rien n’était.',
        },
      ],
      summary:
        'Bob n’est pas moins intelligent qu’avant : il lui manque un **plan**. Découper la mission en étapes **dans le bon ordre**, garder ce plan **sous les yeux**, et le **réviser** quand la réalité change.',
      question: 'Comment un agent planifie-t-il une mission en plusieurs étapes ?',
    },
    concept: [
      {
        id: 'decomposition',
        title: 'Décomposer : de la mission aux étapes',
        body:
          'Une mission comme « organiser la soirée » est trop grosse pour un seul appel d’outil. L’agent la **décompose** en sous-tâches petites et vérifiables : sondage des dates, réservation de salle, invitations, commande de repas.\n\nCertaines dépendent d’autres : on ne commande pas les pizzas avant de connaître le nombre de participants. Ces **dépendances** fixent l’ordre ; les tâches indépendantes peuvent avancer en parallèle.',
        analogy: {
          title: 'La recette',
          text: '« Faire un gâteau », c’est flou. La recette le découpe : peser, mélanger, préchauffer le four, enfourner. On peut préchauffer pendant qu’on mélange, mais pas enfourner une pâte qui n’existe pas encore.',
        },
        takeaway: 'Une grosse mission devient une suite de petites étapes vérifiables, dans l’ordre imposé par leurs dépendances.',
        illustration: 'l4-decompose',
      },
      {
        id: 'todo',
        title: 'Le plan écrit, tenu par le harnais',
        body:
          'Un plan gardé « en tête » se perd vite : le contexte se remplit, l’attention dérive. Les harnais modernes donnent donc à l’agent une **liste de tâches** écrite, souvent via un outil dédié ou un fichier : il la crée, coche ce qui est fait et la relit avant chaque étape.\n\nBonus : l’humain voit où en est l’agent. Il peut corriger le plan avant que les actions ne partent.',
        analogy: {
          title: 'La check-list du pilote',
          text: 'Même avec des milliers d’heures de vol, un pilote suit sa check-list avant le décollage, point par point. Pas par manque de compétence : parce qu’un oubli coûte cher et que la mémoire flanche sous la pression.',
        },
        takeaway: 'Le harnais garde un plan écrit sous les yeux de l’agent : rien ne s’oublie, et l’humain peut suivre.',
        illustration: 'l4-todo',
      },
      {
        id: 'replan',
        title: 'Replanifier quand la réalité change',
        body:
          'Aucun plan ne survit intact : une salle est annulée, un outil renvoie une erreur, Inès change d’avis. Après chaque observation importante, l’agent se demande : « Mon plan tient-il encore ? »\n\nSi non, il **replanifie** : il garde ce qui est fait, modifie les étapes touchées et en ajoute si besoin. Suivre l’ancien plan à l’aveugle est l’erreur classique des agents.',
        analogy: {
          title: 'Le GPS',
          text: 'Une rue est barrée ? Le GPS ne s’entête pas et ne te renvoie pas au point de départ : il recalcule l’itinéraire à partir de l’endroit où tu es.',
        },
        takeaway: 'Le plan est un outil, pas un contrat : on le met à jour dès qu’une observation le contredit.',
        illustration: 'l4-replan',
      },
    ],
    minigame: {
      id: 'project-lead',
      title: 'Le chef de projet',
      intro:
        'Trois manches : **choisir les bonnes sous-tâches** pour une mission, les **ordonner** selon leurs dépendances, puis **replanifier** quand les imprévus tombent.',
      xp: 60,
    },
    boss: {
      name: 'Le Dispersé',
      sprite: 'disperse',
      intro: 'Un plan ? Pour quoi faire ? Je commence tout en même temps, et je verrai bien !',
      victory: 'Bon… j’aurais peut-être dû faire une liste.',
      defeat: 'Tu vois ? Tout est commencé ! Rien n’est fini, mais tout est commencé !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-why-decompose',
          prompt: 'Pourquoi un agent décompose-t-il une grosse mission en sous-tâches ?',
          choices: [
            { id: 'a', text: 'Pour consommer plus de tokens.', feedback: 'Ce n’est pas un objectif : c’est même plutôt un coût.' },
            {
              id: 'b',
              text: 'Parce que chaque petite étape est plus facile à réussir et à vérifier.',
              correct: true,
              feedback: 'Exact : une étape claire se réussit et se vérifie bien mieux qu’un objectif flou.',
            },
            { id: 'c', text: 'Parce que le modèle ne sait faire qu’une seule chose par jour.', feedback: 'Aucune limite de ce genre : c’est une question de fiabilité.' },
            { id: 'd', text: 'Pour éviter d’utiliser des outils.', feedback: 'Au contraire : chaque sous-tâche utilise souvent un outil.' },
          ],
          explanation: 'Décomposer transforme un objectif flou en étapes vérifiables.',
        },
        {
          id: 'q-dependency',
          prompt: 'Laquelle de ces étapes doit attendre la fin du sondage des dates ?',
          choices: [
            { id: 'a', text: 'Rédiger le brouillon de l’invitation.', feedback: 'On peut préparer le texte en parallèle, quitte à compléter la date ensuite.' },
            { id: 'b', text: 'Demander la liste des salles du bâtiment.', feedback: 'Cette liste ne dépend pas de la date.' },
            {
              id: 'c',
              text: 'Réserver la salle.',
              correct: true,
              feedback: 'Oui : on réserve pour une date précise, qu’il faut connaître avant.',
            },
            { id: 'd', text: 'Lister les allergies de la promo.', feedback: 'Indépendant de la date : peut se faire en parallèle.' },
          ],
          explanation: 'Une dépendance, c’est « B a besoin du résultat de A ». Le reste peut avancer en parallèle.',
        },
        {
          id: 'q-todo',
          prompt: 'À quoi sert la liste de tâches tenue par le harnais ?',
          choices: [
            {
              id: 'a',
              text: 'À garder le plan sous les yeux de l’agent et à suivre ce qui est fait.',
              correct: true,
              feedback: 'Exact : rien ne s’oublie, et l’humain peut suivre l’avancement.',
            },
            { id: 'b', text: 'À remplacer les outils.', feedback: 'Elle organise le travail, mais n’exécute rien.' },
            { id: 'c', text: 'À entraîner le modèle sur les tâches passées.', feedback: 'Aucun entraînement : c’est un simple document de travail.' },
            { id: 'd', text: 'À cacher le plan à l’utilisateur.', feedback: 'C’est l’inverse : elle rend le plan visible.' },
          ],
          explanation: 'Un plan écrit résiste mieux au temps qu’un plan gardé « en tête ».',
        },
        {
          id: 'q-replan',
          prompt: 'La salle réservée est annulée. Que doit faire un bon agent ?',
          choices: [
            { id: 'a', text: 'Continuer le plan comme prévu.', feedback: 'C’est l’erreur de Bob : tout le monde ira dans une salle fermée.' },
            { id: 'b', text: 'Tout recommencer depuis le sondage des dates.', feedback: 'Inutile : la date reste valable, il suffit de changer la salle.' },
            { id: 'c', text: 'Abandonner la mission.', feedback: 'Trop radical : le problème est réparable.' },
            {
              id: 'd',
              text: 'Garder ce qui est fait, réserver une autre salle et corriger les invitations.',
              correct: true,
              feedback: 'Oui : on ne modifie que ce que l’imprévu touche.',
            },
          ],
          explanation: 'Replanifier, c’est réviser seulement les étapes touchées par l’observation.',
        },
        {
          id: 'q-granularity',
          prompt: 'Quelle sous-tâche est la mieux formulée ?',
          choices: [
            { id: 'a', text: '« S’occuper de la nourriture. »', feedback: 'Trop vague : quand est-ce « fini » ?' },
            {
              id: 'b',
              text: '« Commander 13 pizzas pour jeudi 18 h et obtenir la confirmation. »',
              correct: true,
              feedback: 'Précise et vérifiable : on sait exactement quand elle est terminée.',
            },
            { id: 'c', text: '« Ouvrir l’application de livraison. »', feedback: 'Trop petite : c’est un geste, pas une étape utile du plan.' },
            { id: 'd', text: '« Faire en sorte que la soirée soit réussie. »', feedback: 'C’est la mission entière, pas une sous-tâche.' },
          ],
          explanation: 'Une bonne sous-tâche a un résultat clair : on sait dire si elle est faite.',
        },
        {
          id: 'q-visible',
          prompt: 'Bob affiche son plan à Inès avant de commencer. Quel est l’intérêt ?',
          choices: [
            { id: 'a', text: 'Aucun, c’est juste pour faire joli.', feedback: 'Il y a un vrai intérêt : corriger avant d’agir.' },
            { id: 'b', text: 'Cela rend Bob plus rapide.', feedback: 'Pas forcément plus rapide, mais bien plus sûr.' },
            {
              id: 'c',
              text: 'Inès peut corriger le plan avant que des actions irréversibles soient lancées.',
              correct: true,
              feedback: 'Exact : corriger un plan coûte bien moins cher que d’annuler des actions.',
            },
            { id: 'd', text: 'Cela empêche toute replanification.', feedback: 'Au contraire, le plan reste modifiable.' },
          ],
          explanation: 'Un plan visible permet à l’humain de rattraper les erreurs tôt.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob ne perd plus le fil depuis qu’il a son carnet de plan. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Son modèle a reçu une mémoire plus grande.', feedback: 'Non : c’est toujours le même modèle.' },
            {
              id: 'b',
              text: 'Son harnais lui fait écrire, suivre et réviser un plan.',
              correct: true,
              feedback: 'Exactement : même cerveau, harnais mieux organisé.',
            },
            { id: 'c', text: 'Il a été réentraîné à organiser des soirées.', feedback: 'Aucun réentraînement : ses poids n’ont pas bougé.' },
            { id: 'd', text: 'Inès fait le plan à sa place.', feedback: 'Elle le relit, mais c’est Bob qui le construit.' },
          ],
          explanation: 'La planification est une affaire de harnais : un plan écrit, suivi et révisé.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['task-decomposition', 'todo-plan', 'replanning'],
      message:
        'Mon carnet de plan ! J’y découpe la mission, je coche ce qui est fait et je corrige le plan quand la réalité change. Même cerveau, mais je ne perds plus le fil.',
    },
    tutor: {
      suggestions: ['t4-decompose', 't4-dependency', 't4-todo', 't4-replan'],
      entries: [
        {
          id: 't4-decompose',
          question: 'C’est quoi, décomposer une tâche ?',
          keywords: ['decomposer', 'decomposition', 'sous', 'taches', 'decouper', 'etapes', 'recette'],
          answer:
            'C’est découper un objectif trop gros pour un seul geste en sous-tâches petites et vérifiables. « Organiser la soirée » devient : sonder les dates, réserver une salle, inviter, commander à manger. Comme une recette qui transforme « faire un gâteau » en étapes simples, chacune avec un résultat clair.',
        },
        {
          id: 't4-dependency',
          question: 'C’est quoi, une dépendance entre tâches ?',
          keywords: ['dependance', 'dependances', 'ordre', 'avant', 'apres', 'parallele'],
          answer:
            'Une tâche B dépend d’une tâche A quand B a besoin du résultat de A : on ne réserve pas la salle avant de connaître la date. Les dépendances fixent l’ordre minimal ; les tâches sans dépendance entre elles peuvent avancer en parallèle (préparer le texte de l’invitation pendant le sondage, par exemple).',
        },
        {
          id: 't4-todo',
          question: 'Pourquoi écrire le plan plutôt que le garder en tête ?',
          keywords: ['ecrire', 'liste', 'todo', 'plan', 'tete', 'oublier', 'checklist', 'fichier'],
          answer:
            'Parce que, sur une longue mission, le contexte se remplit et les premières intentions se diluent. Un plan écrit (via un outil de liste de tâches ou un fichier) reste sous les yeux de l’agent : il coche ce qui est fait et sait ce qui reste. L’humain peut aussi le lire et le corriger. C’est la check-list du pilote.',
        },
        {
          id: 't4-replan',
          question: 'Que faire quand le plan ne marche plus ?',
          keywords: ['replanifier', 'replanification', 'imprevu', 'changer', 'erreur', 'annule', 'gps'],
          answer:
            'Replanifier : garder ce qui est déjà fait, modifier seulement les étapes touchées par l’imprévu, en ajouter si besoin. Comme un GPS qui recalcule l’itinéraire depuis là où tu es, sans te renvoyer au départ. L’erreur classique est de suivre l’ancien plan à l’aveugle.',
        },
        {
          id: 't4-granularity',
          question: 'Comment savoir si une sous-tâche est bien découpée ?',
          keywords: ['taille', 'granularite', 'precis', 'vague', 'verifiable', 'fini', 'bien'],
          answer:
            'Une bonne sous-tâche a un résultat clair : on peut dire sans hésiter si elle est faite. « S’occuper de la nourriture » est trop vague ; « ouvrir l’application » est trop petit ; « commander 13 pizzas pour jeudi 18 h et obtenir la confirmation » est juste. Trop de micro-étapes noient l’essentiel.',
        },
        {
          id: 't4-show',
          question: 'Pourquoi l’agent montre-t-il son plan avant d’agir ?',
          keywords: ['montrer', 'valider', 'humain', 'relire', 'avant', 'agir', 'confirmer'],
          answer:
            'Pour que l’humain puisse le corriger tôt. Modifier une ligne du plan ne coûte rien ; annuler 30 invitations déjà envoyées, beaucoup plus. Beaucoup de harnais proposent ainsi un mode « plan d’abord » : l’agent propose, l’humain valide, puis l’agent exécute.',
        },
      ],
    },
  },
};
