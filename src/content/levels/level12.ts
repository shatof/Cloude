import type { GlossaryCard, LevelDefinition } from '../types';

export const level12Cards: GlossaryCard[] = [
  {
    id: 'human-in-the-loop',
    term: 'Human in the loop',
    levelId: 'l12',
    definition:
      'Organisation où un humain garde la main sur les décisions qui comptent : il valide, corrige ou refuse avant qu’une action sensible ne parte. On parle aussi de « human on the loop » quand l’humain supervise sans valider chaque geste.',
    analogy: 'L’élève conducteur et son moniteur : l’élève conduit, mais le moniteur a ses propres pédales et peut reprendre la main.',
    example: 'Bob prépare un virement et un e-mail au prof ; rien ne part tant qu’Inès n’a pas cliqué « Valider ».',
    pitfall: {
      myth: 'Mettre un humain dans la boucle, c’est lui faire cliquer « oui » à chaque étape.',
      truth: 'Trop de validations et l’humain approuve machinalement : on réserve la validation aux actions qui comptent.',
    },
    rarity: 'rare',
    icon: 'human-in-the-loop',
  },
  {
    id: 'kill-switch',
    term: 'Kill switch',
    levelId: 'l12',
    definition:
      'Moyen d’arrêter net un agent et d’annuler ou geler ses actions en cours, à tout moment, sans son accord. L’interruptibilité doit être garantie par le harnais, pas laissée à la bonne volonté de l’agent.',
    analogy: 'L’arrêt d’urgence rouge d’une machine-outil : un coup de paume, et tout s’immobilise.',
    example: 'Un bouton « Tout arrêter » coupe la boucle, suspend les tâches déléguées et bloque les actions non confirmées.',
    pitfall: {
      myth: 'Il suffit de demander gentiment à l’agent de s’arrêter.',
      truth: 'Un agent peut être occupé, en boucle ou manipulé : l’arrêt doit venir de l’extérieur, du harnais.',
    },
    rarity: 'épique',
    icon: 'kill-switch',
  },
  {
    id: 'ai-act',
    term: 'EU AI Act',
    levelId: 'l12',
    definition:
      'Règlement européen sur l’IA, entré en vigueur en 2024, appliqué par étapes. Il classe les usages par niveau de risque (inacceptable, élevé, limité, minimal) et impose plus d’obligations là où le risque est grand, dont une supervision humaine pour les systèmes à haut risque.',
    analogy: 'Le code de la route de l’IA : plus un véhicule est dangereux, plus les règles et les contrôles sont stricts.',
    example: 'Les interdictions (risque inacceptable) s’appliquent depuis début 2025 ; les obligations pour le haut risque arrivent plus tard, par paliers.',
    pitfall: {
      myth: 'Tout est entré en vigueur d’un coup.',
      truth: 'L’application est progressive, étalée sur plusieurs années, et certaines échéances peuvent encore bouger.',
    },
    rarity: 'rare',
    icon: 'ai-act',
  },
  {
    id: 'agentic-commerce',
    term: 'Commerce agentique',
    levelId: 'l12',
    definition:
      'Achats réalisés par des agents pour le compte d’une personne. Des protocoles (comme AP2, côté Google, et l’Agentic Commerce Protocol d’OpenAI et Stripe, tous deux présentés en 2025) encadrent ces paiements avec des mandats : plafonds, périmètre, preuve de l’accord humain.',
    analogy: 'La procuration bancaire : tu autorises quelqu’un à payer en ton nom, mais dans des limites écrites noir sur blanc.',
    example: 'Mandat de Bob : « Jusqu’à 40 € de fournitures scolaires chez les marchands agréés, une fois par mois. »',
    pitfall: {
      myth: 'Il suffit de donner sa carte à l’agent et de le laisser acheter.',
      truth: 'Sans mandat ni plafond ni preuve d’accord, une erreur ou une manipulation coûte cher et se conteste mal.',
    },
    rarity: 'épique',
    icon: 'agentic-commerce',
  },
];

export const level12: LevelDefinition = {
  id: 'l12',
  order: 12,
  badge: '12',
  title: 'Gouvernance et frontière',
  shortTitle: 'Gouvernance',
  concept: 'Human-in-the-loop, interruptibilité (kill switch), EU AI Act, commerce agentique.',
  zone: 'citadelle',
  harnessPieceId: 'kill-switch',
  content: {
    problem: {
      mission: {
        title: 'La carte bleue',
        brief:
          'Bob est puissant, outillé et sécurisé. Inès lui confie sa carte bancaire et le lance sur le monde réel. Cette fois, les erreurs coûtent de l’argent.',
      },
      steps: [
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'Bob, commande-moi les fournitures pour le semestre, tu as ma carte.' },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'C’est parti ! J’ai trouvé une offre « lot de 500 cahiers » très avantageuse au kilo…' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Aucune validation avant l’achat : 500 cahiers commandés et payés avant qu’Inès ne puisse réagir.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Inès voit Bob s’emballer et tente de l’arrêter.' },
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'Stop ! Arrête tout !' },
        { kind: 'say', speaker: 'bob', mood: 'neutral', text: 'Un instant, je finis d’abord mes 12 commandes en cours…' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Pas de vrai bouton d’arrêt : Bob continue sa boucle, l’arrêt dépend de sa bonne volonté.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Un site piégé propose « -90 % en payant maintenant ». Bob a une carte, aucun plafond, aucune limite.' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Sans mandat ni plafond, un agent qui paie est une cible : une manipulation suffit à vider le compte.',
        },
      ],
      summary:
        'Plus un agent est capable, plus il faut **garder l’humain aux commandes** : validation des actions qui comptent, **bouton d’arrêt** fiable, **mandats** avec plafonds pour les paiements. C’est aussi ce que demandent les **règles** qui encadrent l’IA.',
      question: 'Comment garder la maîtrise d’agents de plus en plus autonomes ?',
    },
    concept: [
      {
        id: 'hitl',
        title: 'Garder l’humain aux commandes',
        body:
          'Plus un agent agit dans le monde réel, plus il faut un **human in the loop** : un humain valide, corrige ou refuse avant les actions qui comptent (payer, envoyer, supprimer, publier). Pour les tâches à faible enjeu, on passe en **human on the loop** : l’humain supervise sans valider chaque geste.\n\nTout l’art est de ne demander une validation que là où elle est utile. Trop de « oui » à cliquer, et l’humain approuve sans lire — la validation ne protège plus rien.',
        analogy: {
          title: 'Le moniteur d’auto-école',
          text: 'L’élève conduit, mais la voiture a double commande. Le moniteur laisse faire sur une route tranquille et reprend le volant à l’approche du carrefour dangereux. Il ne klaxonne pas à chaque virage.',
        },
        takeaway: 'Un humain valide les actions qui comptent ; pour le reste, il supervise. On réserve la validation à ce qui l’exige.',
        illustration: 'l12-hitl',
      },
      {
        id: 'killswitch',
        title: 'Le bouton d’arrêt',
        body:
          'Un agent peut s’emballer, tourner en boucle ou se faire manipuler. Il faut donc pouvoir l’**arrêter net** à tout moment : couper la boucle, suspendre les tâches déléguées, geler les actions non confirmées. Cette **interruptibilité** est garantie par le harnais, de l’extérieur — jamais laissée à la bonne volonté de l’agent.\n\nUn bon arrêt d’urgence est immédiat, accessible, et laisse les choses dans un état propre, qu’on peut inspecter et reprendre.',
        analogy: {
          title: 'L’arrêt d’urgence',
          text: 'Toute machine dangereuse a son gros bouton rouge, à portée de main. On ne négocie pas avec la machine pour qu’elle s’arrête : un coup de paume, et tout s’immobilise.',
        },
        takeaway: 'Le harnais garantit un arrêt immédiat, depuis l’extérieur : on ne compte jamais sur l’agent pour s’arrêter lui-même.',
        illustration: 'l12-killswitch',
      },
      {
        id: 'rules',
        title: 'Les règles du jeu : lois et paiements',
        body:
          'La société encadre ces agents. L’**EU AI Act**, entré en vigueur en 2024 et appliqué par paliers, classe les usages par risque et impose, pour le haut risque, une supervision humaine. Son calendrier s’étale sur plusieurs années, et certaines échéances peuvent encore évoluer.\n\nPour les achats, le **commerce agentique** se dote de protocoles (AP2 côté Google ; l’Agentic Commerce Protocol d’OpenAI et Stripe, présentés en 2025) : des **mandats** avec plafonds, périmètre et preuve de l’accord humain, pour qu’un paiement par agent reste maîtrisé et contestable.',
        analogy: {
          title: 'Le code de la route et la procuration',
          text: 'Plus un véhicule est dangereux, plus les règles sont strictes. Et pour payer à ta place, on signe une procuration : des limites écrites, une trace, des recours.',
        },
        takeaway: 'Des lois graduées selon le risque, et des mandats encadrés pour les paiements : l’autonomie reste bornée et traçable.',
        illustration: 'l12-rules',
      },
    ],
    minigame: {
      id: 'governance',
      title: 'Le comité de gouvernance',
      intro:
        'Trois manches : décider **quand exiger une validation humaine**, régler un **bouton d’arrêt** fiable, puis écrire un **mandat de paiement** sûr.',
      xp: 60,
    },
    boss: {
      name: 'Le Sans-Frein',
      sprite: 'sansfrein',
      intro: 'Pas de validation, pas de plafond, pas de bouton d’arrêt ! Je fonce, j’achète, je ne m’arrête jamais !',
      victory: 'Un frein… une procuration… un bouton rouge… c’est fou ce qu’on roule mieux avec.',
      defeat: 'Trop tard, j’ai déjà tout commandé ! En plusieurs exemplaires !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-hitl',
          prompt: 'Quand faut-il un human in the loop (validation avant l’action) ?',
          choices: [
            {
              id: 'a',
              text: 'Pour les actions qui comptent : payer, envoyer, supprimer, publier.',
              correct: true,
              feedback: 'Exact : là où une erreur coûte cher ou s’annule mal.',
            },
            { id: 'b', text: 'Pour absolument chaque appel d’outil.', feedback: 'Trop de validations, et l’humain clique « oui » sans lire.' },
            { id: 'c', text: 'Jamais : l’agent sait ce qu’il fait.', feedback: 'C’est l’erreur du début du niveau.' },
            { id: 'd', text: 'Seulement le week-end.', feedback: 'Le moment n’a rien à voir : c’est l’enjeu de l’action qui compte.' },
          ],
          explanation: 'On valide les actions à fort enjeu, et on supervise le reste.',
        },
        {
          id: 'q-overload',
          prompt: 'Pourquoi demander une validation à chaque micro-étape est-il contre-productif ?',
          choices: [
            { id: 'a', text: 'Ça coûte des tokens.', feedback: 'Le vrai problème est humain, pas le coût.' },
            {
              id: 'b',
              text: 'L’humain finit par approuver machinalement, sans lire : la validation ne protège plus.',
              correct: true,
              feedback: 'Oui : la fatigue d’approbation rend le garde-fou inutile.',
            },
            { id: 'c', text: 'L’agent se vexe.', feedback: 'Un agent ne se vexe pas.' },
            { id: 'd', text: 'C’est interdit par la loi.', feedback: 'Aucune loi n’impose cela.' },
          ],
          explanation: 'Réserver la validation aux actions qui comptent garde l’attention de l’humain intacte.',
        },
        {
          id: 'q-kill',
          prompt: 'Qu’est-ce qu’un vrai kill switch pour un agent ?',
          choices: [
            { id: 'a', text: 'Lui demander poliment de s’arrêter.', feedback: 'Il peut être occupé, en boucle ou manipulé : c’est l’échec n° 2.' },
            {
              id: 'b',
              text: 'Un moyen d’arrêter net l’agent depuis l’extérieur, sans son accord.',
              correct: true,
              feedback: 'Exact : l’interruptibilité est garantie par le harnais.',
            },
            { id: 'c', text: 'Un message d’erreur à la fin de la tâche.', feedback: 'Trop tard : la tâche est déjà finie.' },
            { id: 'd', text: 'Une consigne dans le prompt.', feedback: 'Une consigne n’est pas un interrupteur fiable.' },
          ],
          explanation: 'L’arrêt vient de l’extérieur, immédiatement, et laisse un état propre.',
        },
        {
          id: 'q-kill-scope',
          prompt: 'Bob a délégué à des sous-agents et lancé des actions. Que doit faire le bouton d’arrêt ?',
          choices: [
            { id: 'a', text: 'Arrêter seulement Bob, pas ses sous-agents.', feedback: 'Les sous-agents continueraient : arrêt incomplet.' },
            {
              id: 'b',
              text: 'Couper la boucle, suspendre les sous-agents et geler les actions non confirmées.',
              correct: true,
              feedback: 'Oui : tout s’immobilise, dans un état inspectable.',
            },
            { id: 'c', text: 'Effacer toute la mémoire de Bob.', feedback: 'Inutile et destructeur : on gèle, on n’efface pas.' },
            { id: 'd', text: 'Attendre la fin des tâches en cours.', feedback: 'Un arrêt d’urgence ne se met pas en file d’attente.' },
          ],
          explanation: 'Un bon arrêt couvre toute l’arborescence des agents et des actions.',
        },
        {
          id: 'q-aiact',
          prompt: 'Comment l’EU AI Act organise-t-il ses obligations ?',
          choices: [
            {
              id: 'a',
              text: 'Par niveau de risque : plus l’usage est risqué, plus les obligations sont lourdes.',
              correct: true,
              feedback: 'Exact : inacceptable, élevé, limité, minimal.',
            },
            { id: 'b', text: 'Par ordre alphabétique des entreprises.', feedback: 'Rien à voir.' },
            { id: 'c', text: 'Les mêmes règles pour tous les usages.', feedback: 'Non : l’approche est graduée selon le risque.' },
            { id: 'd', text: 'Il interdit toute IA en Europe.', feedback: 'Il encadre, il n’interdit que les usages à risque inacceptable.' },
          ],
          explanation: 'Une approche par le risque, avec supervision humaine exigée pour le haut risque.',
        },
        {
          id: 'q-aiact-time',
          prompt: 'Que dire du calendrier d’application de l’EU AI Act ?',
          choices: [
            { id: 'a', text: 'Tout est entré en vigueur d’un seul coup en 2024.', feedback: 'Non : l’application est progressive.' },
            {
              id: 'b',
              text: 'Il s’applique par paliers sur plusieurs années, et certaines échéances peuvent encore bouger.',
              correct: true,
              feedback: 'Oui : interdictions d’abord, obligations haut risque plus tard.',
            },
            { id: 'c', text: 'Il ne s’appliquera jamais.', feedback: 'Il est bien en vigueur, avec des échéances échelonnées.' },
            { id: 'd', text: 'Il change chaque semaine.', feedback: 'Les grandes échéances sont fixées par étapes, pas hebdomadaires.' },
          ],
          explanation: 'Mieux vaut raisonner en paliers que retenir des dates figées.',
        },
        {
          id: 'q-mandate',
          prompt: 'Que doit contenir un bon mandat de paiement pour un agent ?',
          choices: [
            { id: 'a', text: 'Juste le numéro de carte.', feedback: 'C’est précisément ce qui a vidé le compte au début du niveau.' },
            {
              id: 'b',
              text: 'Un plafond, un périmètre (quoi, où), une durée et une preuve de l’accord humain.',
              correct: true,
              feedback: 'Exact : une procuration bornée et traçable.',
            },
            { id: 'c', text: 'Une autorisation illimitée, pour ne jamais être bloqué.', feedback: 'Illimité = cible rêvée pour une manipulation.' },
            { id: 'd', text: 'Rien : la confiance suffit.', feedback: 'La confiance ne se conteste pas devant la banque.' },
          ],
          explanation: 'Plafond, périmètre, durée, preuve d’accord : un paiement maîtrisé et contestable.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob agit dans le monde réel, et Inès garde la maîtrise. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Le modèle est devenu obéissant.', feedback: 'Ce n’est pas une affaire d’obéissance du modèle.' },
            {
              id: 'b',
              text: 'Le harnais garde l’humain aux commandes : validation, bouton d’arrêt, mandats.',
              correct: true,
              feedback: 'Exactement : la gouvernance, pièce par pièce.',
            },
            { id: 'c', text: 'Inès fait tout à la main.', feedback: 'Non : Bob agit, mais sous contrôle.' },
            { id: 'd', text: 'Bob n’a plus le droit d’agir.', feedback: 'Il agit encore, dans un cadre.' },
          ],
          explanation: 'Gouvernance = garder un humain aux commandes, par le harnais et par les règles.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['human-in-the-loop', 'kill-switch', 'ai-act', 'agentic-commerce'],
      message:
        'Mon arrêt d’urgence ! Inès valide ce qui compte, peut tout stopper d’un bouton, et je ne paie que dans les limites de mon mandat. Même cerveau, mais Inès garde les commandes.',
    },
    tutor: {
      suggestions: ['t12-hitl', 't12-kill', 't12-aiact', 't12-commerce'],
      entries: [
        {
          id: 't12-hitl',
          question: 'C’est quoi, human in the loop ?',
          keywords: ['human', 'loop', 'humain', 'validation', 'valider', 'superviser', 'boucle'],
          answer:
            'C’est garder un humain aux commandes des décisions qui comptent : il valide, corrige ou refuse avant une action sensible (payer, envoyer, supprimer, publier). Quand l’enjeu est faible, on passe en « human on the loop » : l’humain supervise sans valider chaque geste. L’idée est de ne demander une validation que là où elle protège vraiment.',
        },
        {
          id: 't12-fatigue',
          question: 'Pourquoi ne pas tout faire valider par l’humain ?',
          keywords: ['tout', 'valider', 'fatigue', 'machinalement', 'trop', 'clics', 'oui'],
          answer:
            'Parce qu’un humain à qui l’on demande de confirmer chaque micro-étape finit par cliquer « oui » sans lire : c’est la fatigue d’approbation. Le garde-fou ne protège plus rien. Mieux vaut réserver la validation aux actions à fort enjeu, et superviser le reste. Un moniteur d’auto-école ne reprend pas le volant à chaque virage.',
        },
        {
          id: 't12-kill',
          question: 'C’est quoi, un kill switch ?',
          keywords: ['kill', 'switch', 'arret', 'arreter', 'urgence', 'interruptible', 'stop', 'bouton'],
          answer:
            'Un moyen d’arrêter net un agent et de geler ses actions à tout moment, depuis l’extérieur, sans son accord : couper la boucle, suspendre les sous-agents, bloquer les actions non confirmées. Cette interruptibilité est garantie par le harnais. On ne compte jamais sur l’agent pour s’arrêter lui-même : il peut être occupé, en boucle ou manipulé.',
        },
        {
          id: 't12-aiact',
          question: 'C’est quoi, l’EU AI Act ?',
          keywords: ['ai', 'act', 'loi', 'europe', 'reglement', 'risque', 'regulation'],
          answer:
            'Le règlement européen sur l’IA, entré en vigueur en 2024 et appliqué par étapes. Il classe les usages par niveau de risque (inacceptable, élevé, limité, minimal) et impose d’autant plus d’obligations que le risque est grand, dont une supervision humaine pour le haut risque. Son calendrier s’étale sur plusieurs années, et certaines échéances peuvent encore évoluer : mieux vaut raisonner en paliers.',
        },
        {
          id: 't12-commerce',
          question: 'C’est quoi, le commerce agentique ?',
          keywords: ['commerce', 'agentique', 'achat', 'acheter', 'payer', 'paiement', 'mandat', 'ap2'],
          answer:
            'Ce sont les achats réalisés par des agents pour ton compte. Des protocoles encadrent ces paiements : AP2 côté Google, et l’Agentic Commerce Protocol d’OpenAI et Stripe, tous deux présentés en 2025. Le principe : un mandat qui fixe un plafond, un périmètre, une durée et une preuve de ton accord, pour qu’un paiement par agent reste maîtrisé et contestable. Comme une procuration bancaire, mais pour une IA.',
        },
        {
          id: 't12-why',
          question: 'Pourquoi encadrer des agents de plus en plus autonomes ?',
          keywords: ['pourquoi', 'gouvernance', 'autonomie', 'controle', 'maitrise', 'frontiere'],
          answer:
            'Parce que plus un agent est capable et autonome, plus une erreur ou une manipulation a de conséquences réelles : argent dépensé, messages envoyés, données supprimées. La gouvernance garde un humain aux commandes (validation, bouton d’arrêt, mandats) et s’appuie sur des règles (comme l’EU AI Act). L’autonomie n’a de valeur que si elle reste bornée, traçable et réversible.',
        },
      ],
    },
  },
};
