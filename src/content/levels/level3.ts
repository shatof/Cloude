import type { GlossaryCard, LevelDefinition } from '../types';

export const level3Cards: GlossaryCard[] = [
  {
    id: 'chain-of-thought',
    term: 'Chaîne de raisonnement',
    levelId: 'l3',
    definition:
      'Technique qui consiste à faire écrire au modèle ses étapes intermédiaires avant la réponse finale (« chain of thought »). Chaque étape devient du contexte pour la suivante, ce qui améliore la justesse sur les problèmes à plusieurs étapes.',
    analogy: 'Poser une division sur papier plutôt que de la faire de tête : chaque ligne s’appuie sur la précédente.',
    example: '« Balle = x ; x + (x + 1) = 1,10 ; donc x = 0,05 €. »',
    pitfall: {
      myth: 'Le raisonnement affiché est une transcription exacte de ce que calcule le modèle.',
      truth: 'Il aide beaucoup, mais sa fidélité n’est pas garantie : on vérifie les résultats.',
    },
    rarity: 'rare',
    icon: 'chain-of-thought',
  },
  {
    id: 'react',
    term: 'ReAct',
    levelId: 'l3',
    definition:
      'Motif d’agent (Reason + Act) qui alterne pensée (raisonner sur la suite), action (appel d’outil) et observation (résultat), en boucle jusqu’au but.',
    analogy: 'L’enquêteur qui note une hypothèse avant chaque interrogatoire, consigne la réponse, puis révise son plan.',
    example:
      'Pensée : « il me faut les salles libres » → Action : `consulter_planning` → Observation : « C102 libre » → Pensée : « je réserve C102 ».',
    pitfall: {
      myth: 'Il suffit de réfléchir une fois au début, puis d’enchaîner les actions.',
      truth: 'On repense après chaque observation : c’est ce qui permet de s’adapter aux surprises.',
    },
    rarity: 'rare',
    icon: 'react',
  },
  {
    id: 'test-time-compute',
    term: 'Test-time compute',
    levelId: 'l3',
    definition:
      'Calcul supplémentaire dépensé au moment de répondre (par exemple plus de tokens de réflexion) pour améliorer la qualité, sans modifier le modèle. Il se règle par un effort ou un budget de réflexion.',
    analogy: 'Le joueur d’échecs qui garde ses longues minutes de pendule pour les positions critiques et joue vite les coups évidents.',
    example: 'Effort faible pour traduire un mot, effort élevé pour débugger un test qui échoue au hasard.',
    pitfall: {
      myth: 'Plus le modèle réfléchit, mieux c’est, à tous les coups.',
      truth: 'Au-delà d’un certain point, la réflexion coûte plus qu’elle ne rapporte : on la dose selon la difficulté.',
    },
    rarity: 'épique',
    icon: 'test-time-compute',
  },
];

export const level3: LevelDefinition = {
  id: 'l3',
  order: 3,
  badge: '3',
  title: 'Le raisonnement',
  shortTitle: 'Raisonner',
  concept: 'Chain of thought, ReAct et test-time compute : réfléchir avant et pendant l’action.',
  zone: 'atelier',
  harnessPieceId: 'thinking-hourglass',
  content: {
    problem: {
      mission: {
        title: 'Le casse-tête du TD',
        brief:
          'Bob a désormais une boucle et des outils. Inès lui soumet un petit problème de TD, puis une tâche en plusieurs étapes.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Une batte et une balle coûtent 1,10 € en tout. La batte coûte 1 € de plus que la balle. Combien coûte la balle ?',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: '10 centimes, facile !' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Avec une balle à 0,10 €, la batte coûterait 1,10 € et le total 1,20 €. La bonne réponse est 0,05 € : Bob a répondu au premier réflexe.',
        },
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Autre chose : trouve la salle libre la plus proche de l’amphi B pour jeudi 14 h, et réserve-la.',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: '`reserver_salle(salle="C101", jour="jeudi", heure="14:00")`, c’est fait !' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Bob a réservé sans consulter le planning ni les distances : il a agi avant de se demander ce qui lui manquait.',
        },
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Inès ajoute « réfléchis étape par étape » à toutes ses demandes. Bob trouve enfin 0,05 €… puis rédige trois paragraphes avant de répondre « oui » à « Le TD a lieu demain ? ».',
        },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Réfléchir longuement sur une question triviale coûte du temps et des tokens pour rien.',
        },
      ],
      summary:
        'Le même cerveau peut répondre au réflexe ou prendre le temps de raisonner. Un bon harnais lui donne **de la place pour réfléchir**, **l’habitude de penser avant d’agir**… et **dose l’effort** selon la difficulté.',
      question: 'Comment faire raisonner un modèle, et combien ?',
    },
    concept: [
      {
        id: 'cot',
        title: 'Penser par étapes : la chaîne de raisonnement',
        body:
          'Un LLM produit un token après l’autre, et chaque token est calculé à partir de tous les précédents. Écrire les étapes intermédiaires (**chain of thought**) lui donne donc plus de calcul et un brouillon sur lequel s’appuyer : sur les problèmes à plusieurs étapes, la justesse augmente nettement.\n\nAvec « batte = balle + 1 € » et « batte + balle = 1,10 € », la balle vaut 0,05 €. Attention : le raisonnement affiché n’est pas une fenêtre parfaite sur le calcul réel du modèle.',
        analogy: {
          title: 'La division posée',
          text: 'De tête, 1 836 ÷ 4, c’est risqué. Posée sur papier, étape par étape, la division devient presque mécanique : chaque ligne s’appuie sur la précédente, et une erreur se repère.',
        },
        takeaway: 'Écrire les étapes donne au modèle plus de calcul et un brouillon : il se trompe moins sur les problèmes complexes.',
        illustration: 'l3-cot',
      },
      {
        id: 'react',
        title: 'ReAct : penser, agir, observer',
        body:
          'Pour un agent, raisonner ne suffit pas : il faut aussi agir. Le motif **ReAct** (Reason + Act) alterne une **pensée** (« il me manque le planning »), une **action** (un appel d’outil) et une **observation** (le résultat), puis recommence.\n\nLa pensée sert à décider quoi faire, l’observation à corriger le tir. C’est la boucle agentique du niveau 1, avec un raisonnement explicite avant chaque action.',
        analogy: {
          title: 'L’enquêteur et son carnet',
          text: 'Un bon enquêteur note son hypothèse avant chaque interrogatoire (« le témoin peut confirmer l’heure »), interroge, consigne la réponse, puis révise son hypothèse. Il ne fonce pas interroger tout le monde au hasard.',
        },
        takeaway: 'ReAct : une pensée avant chaque action, une observation après, et on ajuste.',
        illustration: 'l3-react',
      },
      {
        id: 'test-time',
        title: 'Réfléchir plus longtemps : le test-time compute',
        body:
          'Les modèles « de raisonnement » peuvent consacrer beaucoup de tokens à réfléchir avant de répondre : c’est le **test-time compute**, du calcul dépensé au moment de répondre plutôt qu’à l’entraînement. Plus de réflexion améliore souvent les problèmes difficiles (maths, code, planification).\n\nMais cela coûte du temps et de l’argent. Les harnais exposent donc un réglage d’**effort** ou de budget de réflexion : élevé pour un problème dur, faible pour une question simple.',
        analogy: {
          title: 'La pendule d’échecs',
          text: 'Un joueur d’échecs gère sa pendule : il joue vite les coups évidents et garde de longues minutes pour les positions critiques. Réfléchir partout aussi longtemps le ferait perdre au temps.',
        },
        takeaway: 'Plus de réflexion aide sur les tâches difficiles, mais coûte : on dose l’effort selon la tâche.',
        illustration: 'l3-effort',
      },
    ],
    minigame: {
      id: 'scratchpad',
      title: 'Le carnet de brouillon',
      intro:
        'Trois manches : **remettre une trace ReAct dans l’ordre**, **trouver l’étape fautive** dans des brouillons de Bob, puis **doser l’effort** de réflexion selon la tâche.',
      xp: 60,
    },
    boss: {
      name: 'Le Réflexe',
      sprite: 'reflexe',
      intro: 'Je réponds avant même que tu finisses ta question ! Réfléchir, c’est pour les lents !',
      victory: 'Hum… j’aurais peut-être dû y réfléchir à deux fois.',
      defeat: 'Trop lent ! J’avais déjà répondu… faux, mais vite !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-why-cot',
          prompt: 'Pourquoi demander au modèle d’écrire ses étapes améliore-t-il ses réponses sur un problème complexe ?',
          choices: [
            {
              id: 'a',
              text: 'Chaque étape écrite devient du contexte pour la suivante : plus de calcul et un brouillon.',
              correct: true,
              feedback: 'Exact : chaque token produit s’appuie sur les précédents.',
            },
            { id: 'b', text: 'Le modèle se sent plus motivé.', feedback: 'Pas d’émotions ici : c’est une question de calcul et de contexte.' },
            { id: 'c', text: 'Écrire plus de tokens rend le modèle plus savant.', feedback: 'Ses connaissances ne changent pas : c’est le chemin de calcul qui s’allonge.' },
            { id: 'd', text: 'Cela réentraîne le modèle pendant la réponse.', feedback: 'Aucun réentraînement : les poids restent identiques.' },
          ],
          explanation: 'La chaîne de raisonnement sert de brouillon : le modèle découpe le problème au lieu de sauter à la réponse.',
        },
        {
          id: 'q-bat-ball',
          prompt: 'La batte et la balle coûtent 1,10 € ; la batte coûte 1 € de plus que la balle. Combien coûte la balle ?',
          choices: [
            { id: 'a', text: '0,10 €', feedback: 'Le réflexe ! Avec 0,10 €, la batte coûterait 1,10 € et le total 1,20 €.' },
            { id: 'b', text: '0,05 €', correct: true, feedback: 'Oui : balle 0,05 € + batte 1,05 € = 1,10 €.' },
            { id: 'c', text: '0,55 €', feedback: 'La batte coûterait alors 1,55 € : le total dépasse.' },
            { id: 'd', text: '1,00 €', feedback: 'C’est l’écart de prix, pas le prix de la balle.' },
          ],
          explanation: 'Poser l’équation (x + x + 1 = 1,10) évite le piège du premier réflexe.',
        },
        {
          id: 'q-react',
          prompt: 'Dans le motif ReAct, que fait l’agent entre deux actions ?',
          choices: [
            { id: 'a', text: 'Il attend que l’utilisateur valide.', feedback: 'Pas forcément : ReAct décrit la boucle interne de l’agent.' },
            { id: 'b', text: 'Il relance la même action pour être sûr.', feedback: 'Répéter sans réfléchir, c’est l’inverse de ReAct.' },
            {
              id: 'c',
              text: 'Il observe le résultat, puis écrit une pensée qui décide de la suite.',
              correct: true,
              feedback: 'Exact : penser, agir, observer, et on recommence.',
            },
            { id: 'd', text: 'Il efface son contexte pour repartir à zéro.', feedback: 'Il garde au contraire les observations pour s’ajuster.' },
          ],
          explanation: 'ReAct = Reason + Act : chaque action est précédée d’une pensée et suivie d’une observation.',
        },
        {
          id: 'q-ttc',
          prompt: 'Qu’appelle-t-on « test-time compute » ?',
          choices: [
            { id: 'a', text: 'Le calcul utilisé pour entraîner le modèle.', feedback: 'Ça, c’est le calcul d’entraînement, pas celui dépensé en répondant.' },
            {
              id: 'b',
              text: 'Le calcul dépensé au moment de répondre, par exemple en réfléchissant plus longtemps.',
              correct: true,
              feedback: 'Oui : plus de tokens de réflexion pendant la réponse.',
            },
            { id: 'c', text: 'Le temps de chargement de la page.', feedback: 'Rien à voir avec l’interface.' },
            { id: 'd', text: 'Les tests automatiques du code de l’agent.', feedback: 'Malgré le nom, il ne s’agit pas de tests logiciels.' },
          ],
          explanation: 'On peut améliorer une réponse en donnant au modèle plus de temps de réflexion, sans changer ses poids.',
        },
        {
          id: 'q-effort',
          prompt: 'Bob doit traduire « merci » en anglais. Quel effort de réflexion choisir ?',
          choices: [
            { id: 'a', text: 'Faible : la tâche est simple.', correct: true, feedback: 'Oui : réfléchir plus n’apporterait rien, sauf du coût.' },
            { id: 'b', text: 'Maximal, au cas où.', feedback: 'Gaspillage : plus de temps et de tokens pour le même résultat.' },
            { id: 'c', text: 'Moyen, toujours le même pour tout.', feedback: 'Un réglage unique pour tout est rarement le bon.' },
            { id: 'd', text: 'Aucun : il faut forcément un outil de traduction.', feedback: 'Le modèle sait traduire « merci » sans outil.' },
          ],
          explanation: 'On dose l’effort : faible pour le simple, élevé pour le difficile.',
        },
        {
          id: 'q-faithful',
          prompt: 'Le raisonnement affiché par un modèle reflète-t-il toujours fidèlement son calcul interne ?',
          choices: [
            { id: 'a', text: 'Oui, c’est une transcription exacte.', feedback: 'Des travaux de recherche montrent que ce n’est pas garanti.' },
            {
              id: 'b',
              text: 'Pas toujours : c’est un texte utile, mais pas une preuve de ce qui s’est réellement passé.',
              correct: true,
              feedback: 'Exact : il aide, mais on vérifie les résultats.',
            },
            { id: 'c', text: 'Jamais : il est toujours inventé.', feedback: 'C’est excessif : il est souvent utile et cohérent.' },
            { id: 'd', text: 'Seulement quand il est écrit en anglais.', feedback: 'La langue n’y change rien.' },
          ],
          explanation: 'On vérifie les résultats (tests, sources) plutôt que de se fier au seul raisonnement affiché.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob raisonne mieux depuis qu’il a son sablier. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Son cerveau a été remplacé par un modèle plus gros.', feedback: 'Non : c’est toujours le même modèle.' },
            { id: 'b', text: 'Il a appris les maths pendant la nuit.', feedback: 'Aucun apprentissage : ses poids n’ont pas bougé.' },
            { id: 'c', text: 'Il cherche les réponses en ligne en cachette.', feedback: 'Il n’a pas d’outil de recherche Web ici.' },
            {
              id: 'd',
              text: 'Son harnais lui laisse du temps et de la place pour réfléchir, et dose cet effort.',
              correct: true,
              feedback: 'Exactement : même cerveau, meilleur harnais.',
            },
          ],
          explanation: 'Le temps de réflexion est réglé par le harnais : le modèle, lui, n’a pas changé.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['chain-of-thought', 'react', 'test-time-compute'],
      message:
        'Mon sablier de réflexion ! Mon harnais me laisse le temps de penser avant d’agir, et règle cet effort selon la difficulté. Même cerveau, meilleures décisions.',
    },
    tutor: {
      suggestions: ['t3-cot', 't3-react', 't3-ttc', 't3-effort'],
      entries: [
        {
          id: 't3-cot',
          question: 'C’est quoi, la chaîne de raisonnement ?',
          keywords: ['chain', 'thought', 'chaine', 'raisonnement', 'etapes', 'etape', 'cot', 'brouillon'],
          answer:
            'C’est le fait de faire écrire au modèle ses étapes intermédiaires avant sa réponse (« chain of thought »). Comme chaque token est calculé à partir des précédents, ces étapes lui servent de brouillon : il découpe le problème au lieu de sauter à la conclusion. C’est comme poser une division sur papier plutôt que de la faire de tête.',
        },
        {
          id: 't3-why',
          question: 'Pourquoi réfléchir étape par étape aide-t-il un LLM ?',
          keywords: ['pourquoi', 'aide', 'ameliore', 'mieux', 'marche', 'fonctionne'],
          answer:
            'Parce qu’un LLM calcule un token à la fois. Sans étapes, il doit « sauter » directement à la réponse en un seul pas de calcul, ce qui marche mal sur les problèmes à plusieurs étapes. En écrivant les étapes, il ajoute du calcul et un contexte intermédiaire sur lequel chaque étape suivante s’appuie. Ses connaissances ne changent pas : c’est le chemin qui s’allonge.',
        },
        {
          id: 't3-react',
          question: 'C’est quoi, ReAct ?',
          keywords: ['react', 'reason', 'act', 'pensee', 'observation', 'enqueteur'],
          answer:
            'ReAct (Reason + Act) est un motif d’agent : une pensée (« il me manque le planning »), une action (un appel d’outil), une observation (le résultat), et on recommence. La pensée décide de l’action, l’observation corrige le plan. Comme un enquêteur qui note son hypothèse avant chaque interrogatoire, puis la révise après la réponse.',
        },
        {
          id: 't3-ttc',
          question: 'C’est quoi, le test-time compute ?',
          keywords: ['test', 'time', 'compute', 'calcul', 'reflexion', 'reflechir', 'longtemps'],
          answer:
            'C’est du calcul dépensé au moment de répondre plutôt qu’à l’entraînement : le modèle « réfléchit » plus longtemps, avec davantage de tokens de réflexion, avant de donner sa réponse. Les modèles dits de raisonnement exploitent beaucoup cette idée. Ça améliore souvent les tâches difficiles (maths, code, planification), au prix de plus de temps et de coût.',
        },
        {
          id: 't3-effort',
          question: 'Faut-il toujours réfléchir au maximum ?',
          keywords: ['toujours', 'maximum', 'max', 'effort', 'cout', 'couteux', 'budget', 'lent'],
          answer:
            'Non. Sur une question simple, réfléchir plus ne change presque rien au résultat, mais multiplie le temps et le coût. Les harnais exposent donc un réglage d’effort (ou un budget de réflexion) : faible pour traduire un mot, élevé pour un bug retors. Comme un joueur d’échecs qui garde son temps de pendule pour les positions critiques.',
        },
        {
          id: 't3-faithful',
          question: 'Le raisonnement affiché par le modèle est-il fiable ?',
          keywords: ['fiable', 'fidele', 'vrai', 'confiance', 'verifier', 'affiche', 'transparent'],
          answer:
            'Il est utile, mais pas garanti fidèle : des travaux de recherche montrent qu’un modèle peut afficher un raisonnement qui ne reflète pas exactement ce qui a déterminé sa réponse. Bonne pratique : vérifier les résultats eux-mêmes (tests, calculs, sources) plutôt que de se fier au texte du raisonnement.',
        },
      ],
    },
  },
};
