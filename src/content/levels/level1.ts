import type { GlossaryCard, LevelDefinition } from '../types';

export const level1Cards: GlossaryCard[] = [
  {
    id: 'agent',
    term: 'Agent',
    levelId: 'l1',
    definition:
      'Système qui poursuit un objectif en enchaînant décisions et actions dans un environnement. Agent = modèle (qui décide) + harnais (qui exécute et relie au monde).',
    analogy:
      'Un joueur d’échecs à l’aveugle et son assistant : l’un annonce les coups, l’autre les joue sur l’échiquier et rapporte la réponse de l’adversaire.',
    example:
      'Bob réserve une salle : il consulte le planning, tente la C101, essuie un refus, réserve la C102, puis vérifie la confirmation.',
    pitfall: {
      myth: 'Un agent, c’est juste un modèle plus intelligent.',
      truth:
        'C’est le système autour qui permet d’agir. Les modèles récents sont aussi entraînés à bien utiliser des outils, mais sans harnais, ils n’agissent sur rien.',
    },
    rarity: 'rare',
    icon: 'agent',
  },
  {
    id: 'harness',
    term: 'Harnais',
    levelId: 'l1',
    definition:
      'Tout le code autour du modèle : il construit le contexte, déclare et exécute les actions, renvoie les résultats, impose des limites et décide quand s’arrêter.',
    analogy:
      'L’attelage d’un cheval de trait : il ne rend pas le cheval plus fort, il rend sa force utile.',
    example:
      'Dans un agent de code, le harnais lit les fichiers, lance les tests, demande la permission avant une commande risquée et résume un historique trop long.',
    pitfall: {
      myth: 'Le harnais, c’est juste l’interface graphique.',
      truth:
        'L’interface n’en est qu’une petite partie. Le harnais, c’est la boucle, les outils, la mémoire, les permissions, les vérifications…',
    },
    rarity: 'épique',
    icon: 'harness',
  },
  {
    id: 'agent-loop',
    term: 'Boucle agentique',
    levelId: 'l1',
    definition:
      'Cycle répété percevoir → raisonner → agir → observer, jusqu’à une réponse finale ou une condition d’arrêt (tours, budget, temps).',
    analogy:
      'Le cuisinier qui goûte sa sauce, ajoute une pincée de sel, regoûte… et s’arrête quand c’est bon.',
    example:
      'Tour 1 : consulter le planning. Tour 2 : réserver C101 → erreur. Tour 3 : réserver C102 → confirmé. Tour 4 : réponse finale, arrêt.',
    pitfall: {
      myth: 'Une erreur d’outil doit arrêter l’agent.',
      truth:
        'Une erreur est une observation comme une autre : elle permet au modèle de changer de plan. On s’arrête sur une réponse finale ou un garde-fou.',
    },
    rarity: 'rare',
    icon: 'loop',
  },
];

export const level1: LevelDefinition = {
  id: 'l1',
  order: 1,
  badge: '1',
  title: 'Du chatbot à l’agent',
  shortTitle: 'Agent',
  concept: 'Modèle + harnais = agent ; la boucle percevoir → raisonner → agir → observer.',
  zone: 'fondations',
  harnessPieceId: 'loop-engine',
  content: {
    problem: {
      mission: {
        title: 'Réserver une salle de révision',
        brief:
          'Inès veut une salle pour réviser jeudi à 14 h. Bob a maintenant une jauge de contexte… mais rien d’autre autour de son cerveau.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Bob, réserve-moi une salle de révision libre jeudi à 14 h, s’il te plaît.',
        },
        {
          kind: 'say',
          speaker: 'bob',
          mood: 'happy',
          text: 'C’est fait ! J’ai réservé la salle B204 pour jeudi à 14 h. Bonnes révisions !',
        },
        { kind: 'gap', text: 'Jeudi, 14 h. Inès arrive devant la B204…' },
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'La B204 est occupée par un TD, et personne n’a jamais reçu de réservation à mon nom !',
        },
        {
          kind: 'fail',
          label: 'Échec',
          detail: 'Bob n’a rien réservé. Il a seulement écrit la suite la plus plausible : « C’est fait ! ».',
        },
        {
          kind: 'say',
          speaker: 'bob',
          mood: 'sad',
          text: 'Je… je n’ai pas d’yeux pour consulter le planning, ni de mains pour cliquer sur « Réserver ». Je ne sais faire qu’une chose : écrire du texte.',
        },
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Et même avec des mains, une seule réponse ne suffirait pas : il faut regarder les salles libres, réserver, puis vérifier la confirmation.',
        },
      ],
      summary:
        'Un chatbot répond **en un seul coup**, avec **du texte**. Pour agir dans le monde, Bob a besoin d’un système autour de son cerveau : un **harnais** qui exécute ses actions et lui montre ce qu’elles ont donné.',
      question: 'Qu’est-ce qui transforme un chatbot en agent ?',
    },
    concept: [
      {
        id: 'model-plus-harness',
        title: 'Agent = modèle + harnais',
        body:
          'Un **agent** est un système qui poursuit un objectif en agissant dans un environnement. Il a deux parties :\n\n- le **modèle** (le LLM), qui décide en écrivant du texte ;\n- le **harnais**, tout le code autour : il fournit le contexte, exécute les actions demandées, renvoie les résultats et décide quand s’arrêter.\n\nLe cerveau de Bob reste identique : c’est le harnais qui va le rendre capable d’agir. Les agents de code comme Claude Code ou Codex sont exactement ça : un modèle dans un harnais très travaillé.',
        analogy: {
          title: 'Le cheval et son attelage',
          text: 'Un cheval de trait est puissant, mais sans harnais, ni rênes, ni charrue, il ne laboure aucun champ. On ne rend pas le cheval plus fort : on l’équipe pour que sa force serve à quelque chose.',
        },
        takeaway: 'Agent = modèle + harnais. Le modèle décide, le harnais exécute et relie au monde.',
        illustration: 'model-harness',
      },
      {
        id: 'agent-loop',
        title: 'La boucle agentique',
        body:
          'Un agent ne répond pas en un coup : il tourne en **boucle**.\n\n1. **Percevoir** : le harnais rassemble l’objectif et les dernières informations dans le contexte.\n2. **Raisonner** : le modèle analyse et choisit la prochaine action.\n3. **Agir** : le harnais exécute cette action (consulter le planning, réserver…).\n4. **Observer** : le résultat est ajouté au contexte.\n\nPuis on recommence, jusqu’à ce que l’objectif soit atteint.',
        analogy: {
          title: 'Le cuisinier qui goûte',
          text: 'Un bon cuisinier ne sale pas sa sauce en une fois, les yeux fermés. Il goûte (percevoir), réfléchit (raisonner), ajoute une pincée (agir), regoûte (observer)… et s’arrête quand c’est bon.',
        },
        takeaway: 'Percevoir → raisonner → agir → observer, en boucle jusqu’au but.',
        illustration: 'agent-loop',
      },
      {
        id: 'who-does-what',
        title: 'Qui fait quoi ? Et quand s’arrêter ?',
        body:
          'Le modèle ne touche jamais le monde : il **écrit** une demande d’action structurée, par exemple `reserver_salle(salle="C101")`. C’est le harnais qui l’**exécute**, puis lui rapporte le résultat.\n\nLe harnais décide aussi quand **arrêter** la boucle : quand le modèle donne sa réponse finale, ou quand un **garde-fou** est atteint (nombre de tours, budget, temps). Sans garde-fou, un agent coincé peut tourner en rond indéfiniment.',
        analogy: {
          title: 'Les échecs à l’aveugle',
          text: 'Une joueuse d’échecs aux yeux bandés annonce « cavalier en f3 ». Elle ne touche pas l’échiquier : un assistant déplace la pièce et lui annonce la réponse de l’adversaire. Elle décide, l’assistant exécute et rapporte, et l’arbitre siffle la fin de la partie.',
        },
        takeaway: 'Le modèle propose une action ; le harnais l’exécute, rapporte le résultat et décide quand s’arrêter.',
        illustration: 'who-does-what',
      },
    ],
    minigame: {
      id: 'loop-runner',
      title: 'Tu es le harnais',
      intro:
        'Trois manches : **assemble** la boucle agentique, **trie** les tâches entre modèle et harnais, puis **fais tourner** la boucle pour aider Bob à réserver une vraie salle.',
      xp: 60,
    },
    boss: {
      name: 'Le Baratineur',
      sprite: 'baratineur',
      intro: 'C’est fait ! C’est réservé ! C’est vérifié ! Enfin… je l’ai écrit, c’est pareil, non ? Prouve-moi le contraire !',
      victory: 'Bon, d’accord… écrire « c’est fait », ce n’est pas le faire…',
      defeat: 'Ha ! Tu vois bien que du texte suffit ! … Non ? Reviens me battre.',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-equation',
          prompt: 'Quelle équation résume le mieux un agent ?',
          choices: [
            {
              id: 'a',
              text: 'Agent = modèle + harnais',
              correct: true,
              feedback: 'Oui : le modèle décide, le harnais relie au monde.',
            },
            {
              id: 'b',
              text: 'Agent = un modèle plus gros',
              feedback: 'La taille du modèle ne donne ni outils, ni boucle, ni conditions d’arrêt.',
            },
            {
              id: 'c',
              text: 'Agent = chatbot + jolie interface',
              feedback: 'Une interface ne fait pas agir le modèle : il faut exécuter ses actions.',
            },
            {
              id: 'd',
              text: 'Agent = modèle + base de données',
              feedback: 'Une base de données peut servir d’outil, mais ne suffit pas à faire un agent.',
            },
          ],
          explanation:
            'Un même modèle peut être un simple chatbot ou un agent puissant : tout dépend du harnais qui l’entoure.',
        },
        {
          id: 'q-impossible',
          prompt: 'Bob-chatbot affirme avoir réservé la salle B204. Pourquoi est-ce impossible ?',
          choices: [
            {
              id: 'a',
              text: 'Le serveur de réservation était en panne.',
              feedback: 'Bob ne l’a jamais contacté : il n’avait aucun moyen de le faire.',
            },
            {
              id: 'b',
              text: 'Il manquait de place dans sa fenêtre de contexte.',
              feedback: 'La fenêtre n’était pas pleine : le problème est l’absence d’action réelle.',
            },
            {
              id: 'c',
              text: 'Il ne produit que du texte : sans harnais pour exécuter l’action, rien ne se passe dans le monde.',
              correct: true,
              feedback: 'Exact : « C’est fait ! » était juste la suite la plus plausible.',
            },
            {
              id: 'd',
              text: 'Il avait mal compris l’heure demandée.',
              feedback: 'Il avait bien compris… mais il ne peut qu’écrire.',
            },
          ],
          explanation:
            'Un modèle seul ne peut qu’écrire. Agir (cliquer, réserver, envoyer) exige un harnais qui exécute.',
        },
        {
          id: 'q-order',
          prompt: 'Dans quel ordre tourne la boucle agentique ?',
          choices: [
            {
              id: 'a',
              text: 'Agir → percevoir → raisonner → observer',
              feedback: 'Agir avant d’avoir perçu, c’est agir à l’aveugle.',
            },
            {
              id: 'b',
              text: 'Raisonner → observer → agir → percevoir',
              feedback: 'On observe le résultat d’une action après l’avoir faite, pas avant.',
            },
            {
              id: 'c',
              text: 'Observer → agir → raisonner → percevoir',
              feedback: 'On réfléchit avant d’agir, pas après.',
            },
            {
              id: 'd',
              text: 'Percevoir → raisonner → agir → observer',
              correct: true,
              feedback: 'Oui, puis on recommence jusqu’au but.',
            },
          ],
          explanation:
            'À chaque tour : le harnais prépare le contexte, le modèle choisit, le harnais exécute, le résultat revient dans le contexte.',
        },
        {
          id: 'q-executor',
          prompt: 'Qui exécute concrètement l’appel reserver_salle(salle="C102") ?',
          choices: [
            {
              id: 'a',
              text: 'Le modèle, directement.',
              feedback: 'Le modèle écrit la demande, mais n’a aucun accès direct au système.',
            },
            {
              id: 'b',
              text: 'Le harnais.',
              correct: true,
              feedback: 'Oui : il lit la demande, appelle le vrai système, puis rapporte le résultat.',
            },
            {
              id: 'c',
              text: 'Inès, à la main.',
              feedback: 'Inès pourra valider certaines actions (on le verra), mais ici c’est le harnais qui exécute.',
            },
            {
              id: 'd',
              text: 'Personne : l’outil se déclenche dès que le modèle y pense.',
              feedback: 'Penser à une action ne l’exécute pas : il faut du code.',
            },
          ],
          explanation:
            'Le modèle propose, le harnais dispose : c’est la séparation des rôles au cœur des agents.',
        },
        {
          id: 'q-observe',
          prompt: 'À quoi sert l’étape « observer » ?',
          choices: [
            {
              id: 'a',
              text: 'À remettre le résultat de l’action dans le contexte, pour que le modèle ajuste la suite.',
              correct: true,
              feedback: 'Exact : sans observation, Bob agirait à l’aveugle.',
            },
            {
              id: 'b',
              text: 'À réentraîner le modèle en temps réel.',
              feedback: 'Les poids du modèle ne changent pas pendant la boucle : seul le contexte évolue.',
            },
            {
              id: 'c',
              text: 'À afficher une animation à l’utilisateur.',
              feedback: 'L’observation est destinée au modèle, pas à la décoration.',
            },
            {
              id: 'd',
              text: 'À surveiller ce que fait l’utilisateur.',
              feedback: 'On observe le résultat des actions de l’agent, pas l’utilisateur.',
            },
          ],
          explanation:
            'Quand la C101 a été prise, c’est l’observation de l’erreur qui a permis à Bob de choisir la C102.',
        },
        {
          id: 'q-limit',
          prompt: 'Pourquoi un harnais impose-t-il une limite de tours (ou de budget) ?',
          choices: [
            {
              id: 'a',
              text: 'Parce que le modèle se fatigue.',
              feedback: 'Un modèle ne se fatigue pas… mais il peut répéter la même erreur sans fin.',
            },
            {
              id: 'b',
              text: 'Pour rendre le modèle plus intelligent.',
              feedback: 'Une limite ne rend pas plus intelligent : elle évite les dégâts.',
            },
            {
              id: 'c',
              text: 'Pour éviter qu’un agent tourne indéfiniment (coût, temps, actions répétées).',
              correct: true,
              feedback: 'Oui : c’est une condition d’arrêt de sécurité, un garde-fou.',
            },
            {
              id: 'd',
              text: 'Parce que l’API refuse plus de 10 appels.',
              feedback: 'Aucune API ne fixe cette limite à ta place : c’est au harnais de la choisir.',
            },
          ],
          explanation:
            'Deux façons d’arrêter la boucle : une réponse finale, ou un garde-fou (tours, budget, temps).',
        },
        {
          id: 'q-brain',
          prompt: 'Bob a maintenant une boucle. Qu’est-ce qui a changé dans son cerveau, le modèle ?',
          choices: [
            {
              id: 'a',
              text: 'Rien : ses poids (les paramètres appris à l’entraînement) sont identiques ; c’est le système autour qui le rend capable d’agir.',
              correct: true,
              feedback: 'Exactement. On ne rend pas le cerveau plus intelligent : on lui construit un meilleur harnais.',
            },
            {
              id: 'b',
              text: 'Il a été réentraîné pour devenir un agent.',
              feedback: 'Aucun réentraînement : même modèle, nouveau harnais.',
            },
            {
              id: 'c',
              text: 'Il a grossi pour gérer la boucle.',
              feedback: 'Le modèle n’a pas bougé d’un paramètre.',
            },
            {
              id: 'd',
              text: 'Il a gagné une mémoire permanente.',
              feedback: 'La mémoire viendra d’une autre pièce du harnais (niveau 5)… et le modèle restera le même.',
            },
          ],
          explanation:
            'C’est le message clé de GitGudAI : à modèle égal, un meilleur harnais fait un bien meilleur agent.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['agent', 'harness', 'agent-loop'],
      message:
        'Mon moteur de boucle ! Je peux enfin enchaîner percevoir, raisonner, agir, observer. Toujours le même cerveau… mais me voilà agent. Prochaine étape : de vrais outils.',
    },
    tutor: {
      suggestions: ['t1-agent', 't1-harness', 't1-chatbot', 't1-stop'],
      entries: [
        {
          id: 't1-agent',
          question: 'C’est quoi, un agent ?',
          keywords: ['agent', 'agents', 'agentique', 'definition', 'autonome', 'autonomie'],
          answer:
            'Un agent est un système qui poursuit un objectif en enchaînant décisions et actions : il consulte, agit, regarde le résultat, recommence. Il combine un modèle, qui décide en écrivant, et un harnais, qui exécute et relie au monde. Comme une joueuse d’échecs à l’aveugle et son assistant : l’une choisit les coups, l’autre déplace les pièces et annonce la réponse de l’adversaire.',
        },
        {
          id: 't1-harness',
          question: 'C’est quoi, le harnais ?',
          keywords: ['harnais', 'harness', 'scaffolding', 'code', 'autour', 'systeme', 'piece', 'pieces', 'equipement'],
          answer:
            'C’est tout le code autour du modèle : il construit le contexte, déclare les actions possibles, exécute celles que le modèle demande, lui renvoie les résultats, impose des limites et décide quand s’arrêter. Le harnais ne rend pas le modèle plus intelligent : il rend son intelligence utile, comme l’attelage d’un cheval de trait. Chaque pièce que tu gagnes dans ce jeu est un morceau de harnais.',
        },
        {
          id: 't1-chatbot',
          question: 'Quelle différence entre un chatbot et un agent ?',
          keywords: ['chatbot', 'chat', 'difference', 'differences', 'assistant', 'compare', 'comparer', 'versus'],
          answer:
            'Un chatbot répond en un seul coup, avec du texte : il ne peut ni vérifier, ni agir. Un agent tourne en boucle : il choisit une action, le harnais l’exécute, le résultat revient, et il ajuste son plan jusqu’au but. Même cerveau dans les deux cas ! Bob-chatbot affirmait avoir réservé la salle ; Bob-agent consulte le planning, réserve, puis vérifie la confirmation.',
        },
        {
          id: 't1-loop',
          question: 'Pourquoi l’agent tourne-t-il en boucle ?',
          keywords: ['boucle', 'loop', 'cycle', 'tour', 'tours', 'iteration', 'iterations', 'percevoir', 'observer'],
          answer:
            'Parce qu’une vraie tâche demande plusieurs étapes et que le monde réserve des surprises. La boucle percevoir → raisonner → agir → observer permet de corriger le tir : quand la salle C101 a été prise, l’observation de l’erreur a permis à Bob de choisir la C102. C’est le cuisinier qui goûte, ajuste et regoûte, au lieu de tout saler d’un coup les yeux fermés.',
        },
        {
          id: 't1-exec',
          question: 'Qui exécute vraiment les actions ?',
          keywords: ['execute', 'executer', 'execution', 'action', 'actions', 'outil', 'outils', 'appel', 'appeler', 'fonction', 'reserver'],
          answer:
            'Le harnais. Le modèle écrit seulement une demande structurée, par exemple reserver_salle(salle="C102"). Le harnais la lit, appelle le vrai système, puis renvoie le résultat au modèle sous forme de texte. Le modèle ne touche jamais directement le monde : c’est ce qui permet au harnais de contrôler, limiter ou refuser certaines actions. On y reviendra avec les permissions.',
        },
        {
          id: 't1-stop',
          question: 'Quand l’agent s’arrête-t-il ?',
          keywords: ['arreter', 'arret', 'arrete', 'stop', 'fin', 'finir', 'limite', 'infini', 'infinie', 'budget', 'gardefou', 'quand'],
          answer:
            'Le harnais arrête la boucle dans deux cas : quand le modèle donne sa réponse finale, ou quand un garde-fou est atteint (nombre maximal de tours, budget de tokens, temps, ou demande de l’utilisateur). Sans garde-fou, un agent bloqué peut répéter la même action indéfiniment, comme un aspirateur robot coincé contre un mur. Les conditions d’arrêt seront approfondies au niveau 7.',
        },
        {
          id: 't1-learn',
          question: 'Le modèle apprend-il pendant la boucle ?',
          keywords: ['apprend', 'apprendre', 'apprentissage', 'entraine', 'entrainement', 'poids', 'parametres', 'ameliore', 'evolue', 'reentraine'],
          answer:
            'Non. Ses poids, les paramètres appris pendant l’entraînement, ne bougent pas. Ce qui change à chaque tour, c’est son contexte : on y ajoute les résultats des actions. Bob « apprend » que la C101 est prise uniquement parce que cette information est écrite dans sa fenêtre. C’est tout le message de GitGudAI : même cerveau, meilleur harnais.',
        },
        {
          id: 't1-examples',
          question: 'Des exemples d’agents réels ?',
          keywords: ['exemple', 'exemples', 'reel', 'reels', 'concret', 'concrets', 'codex', 'cursor', 'produit', 'produits', 'existe'],
          answer:
            'Les agents de code comme Claude Code ou Codex lisent ton projet, modifient des fichiers, lancent les tests et recommencent jusqu’à ce que tout passe. D’autres agents remplissent des formulaires web, trient des e-mails ou mènent des recherches documentaires en plusieurs étapes. Tous suivent le même schéma : un modèle de langage dans un harnais qui exécute ses actions en boucle.',
        },
      ],
    },
  },
};
