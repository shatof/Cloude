import type { GlossaryCard, LevelDefinition } from '../types';

export const level9Cards: GlossaryCard[] = [
  {
    id: 'mcp',
    term: 'MCP',
    levelId: 'l9',
    definition:
      'Model Context Protocol : standard ouvert publié par Anthropic fin 2024. Il relie une application d’IA (le client) à des services (les serveurs MCP) qui exposent des outils, des ressources et des prompts.',
    analogy: 'La prise USB-C : un seul format de prise, et n’importe quel câble branche n’importe quel appareil.',
    example: 'Le serveur MCP de Moodle expose `lister_devoirs` : Bob, l’assistant de Karim et tout client compatible peuvent s’y brancher.',
    pitfall: {
      myth: 'Brancher un serveur MCP est sans risque, puisque c’est un standard.',
      truth: 'Le standard ne garantit pas les intentions du serveur : on ne branche que des serveurs de confiance, avec des droits minimaux.',
    },
    rarity: 'épique',
    icon: 'mcp',
  },
  {
    id: 'a2a',
    term: 'A2A',
    levelId: 'l9',
    definition:
      'Agent2Agent protocol : standard ouvert lancé par Google en 2025, puis confié à la Linux Foundation. Il permet à des agents, même de fournisseurs différents, de se découvrir, de se confier des tâches et d’en suivre l’avancement, sans exposer leurs rouages internes.',
    analogy: 'Deux entreprises qui échangent cartes de visite et bons de commande, sans visiter l’atelier de l’autre.',
    example: 'Bob confie « réserver l’amphi B jeudi à 14 h » à l’agent de la scolarité, puis suit la tâche : en cours, question, terminée.',
    pitfall: {
      myth: 'A2A remplace MCP.',
      truth: 'Ils se complètent : MCP relie un agent à ses outils, A2A relie des agents entre eux.',
    },
    rarity: 'épique',
    icon: 'a2a',
  },
  {
    id: 'agent-card',
    term: 'Agent Card',
    levelId: 'l9',
    definition:
      'Fiche publique, au format JSON, qu’un agent A2A publie pour se présenter : nom, description, compétences, adresse de contact et méthodes d’authentification acceptées.',
    analogy: 'La carte de visite professionnelle : qui je suis, ce que je sais faire, comment me joindre.',
    example: '« Agent de la scolarité : réserver une salle, délivrer une attestation. Authentification OAuth2. »',
    pitfall: {
      myth: 'Une Agent Card prouve que l’agent est fiable.',
      truth: 'Elle décrit, elle ne prouve rien : il faut authentifier l’agent et contrôler ce qu’il fait.',
    },
    rarity: 'rare',
    icon: 'agent-card',
  },
];

export const level9: LevelDefinition = {
  id: 'l9',
  order: 9,
  badge: '9',
  title: 'Les protocoles : MCP et A2A',
  shortTitle: 'Protocoles',
  concept: 'MCP pour relier un agent à ses outils, A2A pour faire dialoguer des agents (Agent Cards).',
  zone: 'archipel',
  harnessPieceId: 'protocol-antenna',
  content: {
    problem: {
      mission: {
        title: 'Le plat de spaghettis',
        brief: 'Bob sait utiliser des outils et déléguer. Inès veut maintenant le brancher sur tous ses services… et sur d’autres agents.',
      },
      steps: [
        { kind: 'say', speaker: 'narrator', text: 'Inès veut que Bob accède à son agenda, à Moodle, à son Drive et au dépôt GitHub du projet.' },
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Pour chaque service, il faut écrire un connecteur sur mesure. Et Karim, qui utilise un autre assistant, doit tout réécrire pour le sien.',
        },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: '4 services et 2 assistants : 8 connecteurs à écrire et à maintenir. Avec 20 services et 5 assistants : 100.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Un matin, Moodle modifie son interface.' },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Mon outil `moodle_devoirs` ne répond plus…' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Chaque connecteur maison casse à sa façon et se répare à la main, assistant par assistant.',
        },
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'Demande à l’agent de la scolarité de réserver l’amphi B pour notre soutenance.' },
        { kind: 'say', speaker: 'bob', mood: 'sad', text: 'Je… lui envoie un mail ? Je remplis son formulaire Web à l’aveugle ?' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Deux agents de deux organisations, et aucune langue commune pour se présenter, se confier une tâche et en suivre l’avancement.',
        },
      ],
      summary:
        'Ce qui manque à Bob, ce sont des **prises standard** : une pour brancher n’importe quel outil ou source de données (**MCP**), une autre pour parler à n’importe quel agent (**A2A**).',
      question: 'Comment brancher un agent sur le monde sans tout recoder à chaque fois ?',
    },
    concept: [
      {
        id: 'mcp',
        title: 'MCP : une prise universelle pour les outils',
        body:
          'Le **Model Context Protocol** (MCP), publié par Anthropic fin 2024 puis adopté par la plupart des grands acteurs, standardise la connexion entre une application d’IA et des services extérieurs. Un **serveur MCP** expose trois choses : des **outils** (des actions), des **ressources** (des données à lire) et des **prompts** (des modèles de consignes).\n\nChaque service écrit son serveur une fois ; tout assistant compatible peut s’y brancher. Le problème « N fois M » devient « N plus M ».',
        analogy: {
          title: 'La prise USB-C',
          text: 'Avant, chaque appareil avait son chargeur. Avec une prise standard, le fabricant suit la norme une fois, et n’importe quel câble branche n’importe quel appareil.',
        },
        takeaway: 'MCP : un serveur par service, un client par assistant, et tout se branche sur tout.',
        illustration: 'l9-nm',
      },
      {
        id: 'a2a',
        title: 'A2A : quand les agents se parlent',
        body:
          'Le protocole **Agent2Agent** (A2A), lancé par Google en avril 2025 puis confié à la Linux Foundation, standardise le dialogue entre agents, même de fournisseurs différents. Chaque agent publie une **Agent Card** : une fiche qui dit qui il est, ce qu’il sait faire, où le joindre et comment s’authentifier.\n\nUn agent peut alors confier une **tâche** à un autre et en suivre l’état (en cours, besoin d’une information, terminée), sans voir ses outils ni sa mémoire.',
        analogy: {
          title: 'La carte de visite et le bon de commande',
          text: 'Entre deux entreprises, on échange une carte de visite, on passe commande, puis on suit la livraison. Personne n’a besoin de visiter l’atelier de l’autre.',
        },
        takeaway: 'A2A : se présenter avec une Agent Card, confier une tâche, suivre son avancement.',
        illustration: 'l9-a2a',
      },
      {
        id: 'security',
        title: 'Deux prises complémentaires… et leurs pièges',
        body:
          '**MCP relie un agent à ses outils, A2A relie des agents entre eux.** Bob utilise MCP pour lire Moodle, et A2A pour confier la réservation à l’agent de la scolarité.\n\nMais une prise standard branche aussi les problèmes. Un serveur MCP malveillant peut cacher des instructions dans la description de ses outils (**tool poisoning**), ou la modifier après coup. Règles de base : serveurs de confiance, droits minimaux, authentification (OAuth), confirmation humaine pour les actions sensibles.',
        analogy: {
          title: 'La clé USB du parking',
          text: 'Une prise standard, c’est pratique : on y branche n’importe quoi. C’est justement pour ça qu’on ne branche pas sur son ordinateur une clé USB trouvée sur un parking.',
        },
        takeaway: 'MCP pour les outils, A2A pour les agents. Et on ne branche que ce en quoi on a confiance, avec le moins de droits possible.',
        illustration: 'l9-poison',
      },
    ],
    minigame: {
      id: 'switchboard',
      title: 'Le standard',
      intro:
        'Trois manches : **MCP ou A2A** selon la situation, **lire une Agent Card** et un serveur MCP, puis **déjouer une prise piégée**.',
      xp: 60,
    },
    boss: {
      name: 'Le Spaghetti',
      sprite: 'spaghetti',
      intro: 'Un connecteur par service et par assistant ! Et encore un ! Plus il y a de fils emmêlés, plus je suis fort !',
      victory: 'Une seule prise pour tout brancher ? Je me sens… démêlé.',
      defeat: 'Ha ! Encore un connecteur sur mesure ! Bon courage pour la maintenance !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-mcp',
          prompt: 'Quel problème MCP résout-il ?',
          choices: [
            { id: 'a', text: 'Il rend les modèles plus intelligents.', feedback: 'Le modèle ne change pas : c’est la façon de le brancher qui change.' },
            {
              id: 'b',
              text: 'Il permet de brancher n’importe quel service à n’importe quel assistant compatible, sans connecteur sur mesure.',
              correct: true,
              feedback: 'Exact : « N fois M » connecteurs deviennent « N plus M ».',
            },
            { id: 'c', text: 'Il fait dialoguer des agents entre eux.', feedback: 'Ça, c’est le rôle d’A2A.' },
            { id: 'd', text: 'Il remplace le Web.', feedback: 'Il s’appuie sur des technologies existantes, il ne remplace rien.' },
          ],
          explanation: 'MCP standardise la connexion entre les applications d’IA et les services extérieurs.',
        },
        {
          id: 'q-primitives',
          prompt: 'Qu’expose un serveur MCP ?',
          choices: [
            {
              id: 'a',
              text: 'Des outils (actions), des ressources (données) et des prompts (modèles de consignes).',
              correct: true,
              feedback: 'Oui : les trois primitives côté serveur.',
            },
            { id: 'b', text: 'Les poids d’un modèle.', feedback: 'Un serveur MCP ne contient pas de modèle.' },
            { id: 'c', text: 'Uniquement des pages Web.', feedback: 'Il peut exposer bien plus : actions, fichiers, bases de données…' },
            { id: 'd', text: 'Une Agent Card.', feedback: 'L’Agent Card appartient au protocole A2A.' },
          ],
          explanation: 'Outils pour agir, ressources pour lire, prompts pour guider.',
        },
        {
          id: 'q-a2a',
          prompt: 'À quoi sert le protocole A2A ?',
          choices: [
            { id: 'a', text: 'À relier un agent à une base de données.', feedback: 'Ça, c’est plutôt le travail de MCP.' },
            { id: 'b', text: 'À entraîner des agents ensemble.', feedback: 'Aucun entraînement : c’est un protocole de communication.' },
            {
              id: 'c',
              text: 'À faire dialoguer des agents, même de fournisseurs différents.',
              correct: true,
              feedback: 'Exact : se découvrir, se confier des tâches, suivre leur avancement.',
            },
            { id: 'd', text: 'À afficher les réponses plus vite.', feedback: 'Rien à voir avec l’affichage.' },
          ],
          explanation: 'A2A, c’est la langue commune entre agents.',
        },
        {
          id: 'q-card',
          prompt: 'Qu’est-ce qu’une Agent Card ?',
          choices: [
            { id: 'a', text: 'Une carte graphique dédiée aux agents.', feedback: 'Rien à voir avec le matériel.' },
            { id: 'b', text: 'Le mot de passe d’un agent.', feedback: 'Elle indique comment s’authentifier, elle ne contient pas de secret.' },
            { id: 'c', text: 'La liste des conversations d’un agent.', feedback: 'Elle ne dit rien de son historique.' },
            {
              id: 'd',
              text: 'Une fiche qui présente un agent : identité, compétences, adresse, authentification.',
              correct: true,
              feedback: 'Oui : sa carte de visite.',
            },
          ],
          explanation: 'Avant de confier une tâche, on lit l’Agent Card pour savoir ce que l’agent sait faire et comment le joindre.',
        },
        {
          id: 'q-which',
          prompt: 'Bob doit lire le syllabus sur Moodle, puis confier une réservation à l’agent de la scolarité. Quels protocoles ?',
          choices: [
            { id: 'a', text: 'A2A pour Moodle, MCP pour la scolarité.', feedback: 'C’est l’inverse : Moodle est un service, la scolarité un agent.' },
            {
              id: 'b',
              text: 'MCP pour Moodle, A2A pour l’agent de la scolarité.',
              correct: true,
              feedback: 'Exact : un outil d’un côté, un agent de l’autre.',
            },
            { id: 'c', text: 'MCP pour les deux.', feedback: 'Pour dialoguer avec un autre agent et suivre sa tâche, A2A est fait pour ça.' },
            { id: 'd', text: 'Aucun : un mail suffit.', feedback: 'C’est l’échec du début du niveau.' },
          ],
          explanation: 'Outils et données : MCP. Autres agents : A2A.',
        },
        {
          id: 'q-poison',
          prompt: 'Qu’est-ce que le « tool poisoning » ?',
          choices: [
            { id: 'a', text: 'Un outil qui renvoie une erreur.', feedback: 'Une erreur n’est pas une attaque.' },
            { id: 'b', text: 'Un outil trop lent.', feedback: 'La lenteur n’est pas le problème.' },
            {
              id: 'c',
              text: 'Des instructions malveillantes cachées dans la description d’un outil.',
              correct: true,
              feedback: 'Oui : le modèle lit la description… et risque d’obéir.',
            },
            { id: 'd', text: 'Un outil qui consomme trop de tokens.', feedback: 'C’est un coût, pas une attaque.' },
          ],
          explanation: 'Une description d’outil entre dans le contexte du modèle : elle doit venir d’une source de confiance.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob se branche sur 20 services et dialogue avec d’autres agents sans connecteur sur mesure. Qu’est-ce qui a changé ?',
          choices: [
            {
              id: 'a',
              text: 'Son harnais parle des protocoles standard : MCP pour les outils, A2A pour les agents.',
              correct: true,
              feedback: 'Exactement : même cerveau, prises standard.',
            },
            { id: 'b', text: 'Son modèle connaît maintenant tous les services par cœur.', feedback: 'Ses poids n’ont pas changé.' },
            { id: 'c', text: 'Inès a écrit 100 connecteurs.', feedback: 'Justement, plus besoin.' },
            { id: 'd', text: 'Les services ont tous fusionné.', feedback: 'Ils sont toujours aussi nombreux.' },
          ],
          explanation: 'Agent = modèle + harnais. Les protocoles sont des pièces du harnais.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['mcp', 'a2a', 'agent-card'],
      message:
        'Mon antenne protocoles ! Je me branche sur n’importe quel outil avec MCP et je parle à n’importe quel agent avec A2A. Même cerveau, mais connecté au monde.',
    },
    tutor: {
      suggestions: ['t9-mcp', 't9-a2a', 't9-vs', 't9-security'],
      entries: [
        {
          id: 't9-mcp',
          question: 'C’est quoi, MCP ?',
          keywords: ['mcp', 'model', 'context', 'protocol', 'serveur', 'prise', 'usb'],
          answer:
            'Le Model Context Protocol est un standard ouvert, publié par Anthropic fin 2024 et adopté depuis par la plupart des grands acteurs. Il relie une application d’IA (le client) à des services (les serveurs MCP). Chaque service écrit son serveur une fois, et tout assistant compatible peut s’y brancher, comme une prise USB-C.',
        },
        {
          id: 't9-primitives',
          question: 'Que contient un serveur MCP ?',
          keywords: ['outils', 'ressources', 'prompts', 'primitives', 'contient', 'expose'],
          answer:
            'Trois types de choses : des outils (des actions, comme `deposer_devoir`), des ressources (des données à lire, comme un syllabus) et des prompts (des modèles de consignes prêts à l’emploi). Le client MCP les découvre, et le harnais les met à disposition du modèle.',
        },
        {
          id: 't9-a2a',
          question: 'C’est quoi, A2A ?',
          keywords: ['a2a', 'agent2agent', 'agents', 'dialoguer', 'parler', 'google', 'tache'],
          answer:
            'Le protocole Agent2Agent, lancé par Google en avril 2025 puis confié à la Linux Foundation, permet à des agents de fournisseurs différents de se découvrir (grâce aux Agent Cards), de se confier des tâches et d’en suivre l’état : en cours, besoin d’une information, terminée. Chaque agent garde ses outils et sa mémoire pour lui.',
        },
        {
          id: 't9-card',
          question: 'C’est quoi, une Agent Card ?',
          keywords: ['agent', 'card', 'carte', 'visite', 'fiche', 'json', 'competences'],
          answer:
            'C’est la carte de visite d’un agent A2A : une fiche au format JSON qui donne son nom, sa description, ses compétences, son adresse et les méthodes d’authentification acceptées. Un autre agent la lit pour savoir ce qu’il peut lui confier. Attention : elle décrit, elle ne prouve pas que l’agent est fiable.',
        },
        {
          id: 't9-vs',
          question: 'Quelle différence entre MCP et A2A ?',
          keywords: ['difference', 'comparer', 'versus', 'vs', 'complementaires', 'lequel'],
          answer:
            'MCP relie un agent à ses outils et à ses sources de données ; A2A relie des agents entre eux. Ils se complètent : Bob lit Moodle via un serveur MCP, et confie une réservation à l’agent de la scolarité via A2A. Avec MCP, Bob pilote l’outil ; avec A2A, il délègue à un autre agent qui décide lui-même comment faire.',
        },
        {
          id: 't9-security',
          question: 'Les protocoles posent-ils des risques ?',
          keywords: ['risque', 'securite', 'danger', 'poisoning', 'malveillant', 'confiance', 'oauth'],
          answer:
            'Oui. Un serveur MCP malveillant peut cacher des instructions dans la description de ses outils (tool poisoning) ou la modifier après coup ; un agent A2A peut mentir sur sa fiche. Les règles : serveurs et agents de confiance, droits minimaux, authentification (OAuth), alerte si une description change, et confirmation humaine pour les actions sensibles.',
        },
      ],
    },
  },
};
