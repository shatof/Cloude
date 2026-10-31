import type { GlossaryCard, LevelDefinition } from '../types';

export const level0Cards: GlossaryCard[] = [
  {
    id: 'token',
    term: 'Token',
    levelId: 'l0',
    definition:
      'Morceau de texte (mot entier, bout de mot ou signe) tiré d’un vocabulaire fixe et converti en numéro. C’est l’unité de base qu’un LLM lit et écrit.',
    analogy:
      'Une maquette décrite uniquement par des numéros de briques : on devine la forme, pas le détail de chaque brique.',
    example: '« arrière-grand-mère » → arr | ière | - | grand | - | mère : 6 morceaux pour 18 caractères.',
    pitfall: {
      myth: 'Un token, c’est un mot.',
      truth:
        'Un token peut être un mot entier, un morceau de mot ou un signe. En français, compte en gros 1 à 2 tokens par mot.',
    },
    rarity: 'commune',
    icon: 'token',
  },
  {
    id: 'next-token',
    term: 'Prédiction du token suivant',
    levelId: 'l0',
    definition:
      'Mécanique de base d’un LLM : calculer la probabilité de chaque token possible pour la suite du texte, en tirer un, l’ajouter, puis recommencer.',
    analogy:
      'L’autocomplétion du clavier de ton téléphone, en version géante : elle propose ce qui sonne juste, sans rien vérifier.',
    example:
      '« La capitale de l’Australie est… » → « Canberra » est le plus probable, mais « Sydney » garde une vraie chance d’être tiré.',
    pitfall: {
      myth: 'Le modèle va chercher la bonne réponse dans une base de données.',
      truth:
        'Il génère la suite la plus plausible. Quand cette suite est fausse, on parle d’hallucination.',
    },
    rarity: 'rare',
    icon: 'dice',
  },
  {
    id: 'context-window',
    term: 'Fenêtre de contexte',
    levelId: 'l0',
    definition:
      'Nombre maximal de tokens qu’un modèle peut prendre en compte en une fois : instructions, historique, documents et réponse en cours.',
    analogy:
      'Un tableau blanc de taille fixe : quand il est plein, il faut effacer pour écrire la suite.',
    example:
      'Une conversation trop longue : le début est coupé, et le prénom donné au premier message n’est plus visible.',
    pitfall: {
      myth: 'Le modèle se souvient de nos conversations précédentes.',
      truth:
        'Le modèle est sans état : à chaque appel, on lui renvoie ce qu’il doit savoir. Le reste n’existe pas pour lui.',
    },
    rarity: 'rare',
    icon: 'window',
  },
];

export const level0: LevelDefinition = {
  id: 'l0',
  order: 0,
  badge: '0',
  title: 'Qu’est-ce qu’un LLM ?',
  shortTitle: 'LLM',
  concept: 'Tokens, prédiction du token suivant et fenêtre de contexte.',
  zone: 'fondations',
  harnessPieceId: 'context-gauge',
  content: {
    problem: {
      mission: {
        title: 'Le premier test de Bob',
        brief:
          'Pour l’instant, Bob n’est qu’un cerveau : un grand modèle de langage (LLM), sans rien autour. Inès, en L3 d’informatique, lui pose trois questions simples.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Salut Bob ! Je m’appelle Inès. Première question : combien y a-t-il de « r » dans « arrière-grand-mère » ?',
        },
        {
          kind: 'say',
          speaker: 'bob',
          mood: 'happy',
          text: 'Bonjour Inès ! Il y a 3 « r » dans « arrière-grand-mère ».',
        },
        { kind: 'fail', label: 'Échec n° 1', detail: 'Il y en a 5 : aRRièRe-gRand-mèRe.' },
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Hum. Deuxième question : quel jour sommes-nous ?',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'Nous sommes le mardi 12 mars.' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Bob n’a ni horloge ni calendrier. Il a répondu avec aplomb… au hasard.',
        },
        { kind: 'gap', text: '… trois heures et 400 messages plus tard …' },
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Dernière question : tu te souviens de mon prénom ? Je te l’ai donné tout au début.',
        },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Bien sûr ! Tu t’appelles… Camille ?' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Le début de la conversation n’est plus visible pour Bob.',
        },
      ],
      summary:
        'Trois échecs. Pourtant, le cerveau de Bob a « lu » une immense partie du Web. Le souci n’est pas son intelligence : c’est la façon dont un LLM **lit**, **écrit** et **voit** le texte.',
      question: 'Ouvrons le capot du LLM pour comprendre ces trois ratés.',
    },
    concept: [
      {
        id: 'tokens',
        title: 'Bob lit des tokens, pas des lettres',
        body:
          'Avant d’entrer dans le modèle, le texte est découpé en **tokens** : des morceaux de mots tirés d’un vocabulaire fixe (de quelques dizaines à plus de 200 000 morceaux selon les modèles). Chaque token devient un simple numéro.\n\n« arrière-grand-mère » peut ainsi devenir « arr | ière | - | grand | - | mère » : 6 tokens. Bob ne voit jamais les lettres une à une : pour compter les « r », il doit deviner l’orthographe cachée dans chaque morceau. En français, compte en gros 1 à 2 tokens par mot.',
        analogy: {
          title: 'Les briques numérotées',
          text: 'On te décrit une maquette uniquement par des numéros de briques : « 4021, 877, 12… ». Tu devines la forme générale, mais pour dire combien de tenons rouges elle porte, il faut te souvenir du contenu exact de chaque brique.',
        },
        takeaway: 'Un LLM manipule des tokens, des morceaux de texte numérotés, pas des lettres.',
        illustration: 'tokenizer',
      },
      {
        id: 'next-token',
        title: 'Écrire, c’est prédire le token suivant',
        body:
          'Un LLM est entraîné sur d’immenses quantités de texte à **prédire le token suivant**, puis affiné pour devenir un assistant utile. Pour répondre, il calcule une probabilité pour chaque token possible, en tire un, l’ajoute au texte… et recommence.\n\nIl produit donc la suite la plus *plausible*, pas forcément la plus *vraie*. « Nous sommes le… » appelle une date plausible : Bob n’a pas de calendrier, il complète la phrase. Quand la suite plausible est fausse, on parle d’**hallucination**.',
        analogy: {
          title: 'L’autocomplétion géante',
          text: 'Le clavier de ton téléphone propose le mot suivant d’après ce que tu tapes souvent. Un LLM fait pareil, en infiniment plus puissant : il a « lu » une part énorme du Web. Mais, comme ton clavier, il ne vérifie rien : il propose ce qui sonne juste.',
        },
        takeaway: 'Un LLM génère, token par token, la suite la plus probable : plausible, pas forcément vraie.',
        illustration: 'next-token',
      },
      {
        id: 'context-window',
        title: 'La fenêtre de contexte : tout ce que Bob voit',
        body:
          'Le modèle ne retient rien d’un appel à l’autre. À chaque message, on lui renvoie tout l’historique… et il ne peut en lire qu’une quantité limitée : sa **fenêtre de contexte**, mesurée en tokens (de l’ordre de 100 000 à 1 million selon les modèles de 2026).\n\nQuand la conversation dépasse la fenêtre, il faut couper : souvent, le début disparaît. Le prénom d’Inès était tout au début… Choisir ce qui reste dans la fenêtre deviendra l’un des grands métiers du harnais.',
        analogy: {
          title: 'Le tableau blanc',
          text: 'Bob travaille devant un tableau blanc de taille fixe. Tout ce qu’il sait de la conversation doit y être écrit. Quand le tableau est plein, il faut effacer pour écrire la suite, et ce qui est effacé n’existe plus pour lui.',
        },
        takeaway: 'Le modèle ne voit que ce qui tient dans sa fenêtre de contexte, renvoyée à chaque appel.',
        illustration: 'context-window',
      },
    ],
    minigame: {
      id: 'token-workshop',
      title: 'L’atelier des tokens',
      intro:
        'Trois manches pour penser comme un LLM : **découper** du texte en tokens, **prédire** le token suivant, puis **regarder glisser** une fenêtre de contexte.',
      xp: 60,
    },
    boss: {
      name: 'Le Tokenivore',
      sprite: 'tokenivore',
      intro: 'GROAR ! Je dévore les lettres et je recrache des tokens ! Réponds à mes questions… si tu sais les lire !',
      victory: 'Argh… Tu lis dans les tokens comme dans un livre ouvert…',
      defeat: 'Miam ! Reviens quand tu sauras ce que mange un LLM !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-letters',
          prompt: 'Pourquoi Bob s’est-il trompé en comptant les « r » de « arrière-grand-mère » ?',
          choices: [
            {
              id: 'a',
              text: 'Il voit des tokens (des morceaux de mots numérotés), pas les lettres une à une.',
              correct: true,
              feedback: 'Exact. Pour compter, il doit deviner l’orthographe cachée dans chaque token.',
            },
            {
              id: 'b',
              text: 'Il n’a jamais appris l’alphabet.',
              feedback: 'Il a vu énormément de texte… mais toujours découpé en tokens, jamais lettre par lettre.',
            },
            {
              id: 'c',
              text: 'Les accents font planter le modèle.',
              feedback: 'Les accents sont découpés en tokens comme le reste : ce n’est pas la cause.',
            },
            {
              id: 'd',
              text: 'Il savait, mais il a voulu faire une blague.',
              feedback: 'Aucune intention de plaisanter ici : l’erreur vient de la façon dont il lit le texte.',
            },
          ],
          explanation:
            'Compter, épeler ou inverser un mot sont des tâches piégeuses pour un LLM, parce qu’il raisonne sur des tokens.',
        },
        {
          id: 'q-generation',
          prompt: 'Que fait fondamentalement un LLM quand il rédige une réponse ?',
          choices: [
            {
              id: 'a',
              text: 'Il cherche la réponse exacte dans une base de données.',
              feedback: 'Il n’interroge aucune base : il génère le texte.',
            },
            {
              id: 'b',
              text: 'Il prédit un token probable, l’ajoute, puis recommence.',
              correct: true,
              feedback: 'Oui : c’est la génération autorégressive, token après token.',
            },
            {
              id: 'c',
              text: 'Il écrit la phrase entière d’un coup, puis la vérifie.',
              feedback: 'La génération se fait token par token, sans relecture automatique.',
            },
            {
              id: 'd',
              text: 'Il consulte Internet en temps réel.',
              feedback: 'Pas tout seul : sans outil fourni par un harnais, il n’a accès à rien.',
            },
          ],
          explanation:
            'Générer, c’est enchaîner des prédictions du token suivant. Chaque token produit rejoint le contexte du suivant.',
        },
        {
          id: 'q-date',
          prompt: 'Bob affirme « Nous sommes le mardi 12 mars » sans hésiter. Quelle est la meilleure explication ?',
          choices: [
            {
              id: 'a',
              text: 'Son horloge interne est déréglée.',
              feedback: 'Un LLM n’a pas d’horloge du tout.',
            },
            {
              id: 'b',
              text: 'Il complète la phrase avec une suite plausible, sans aucun accès à la date réelle.',
              correct: true,
              feedback: 'Oui : plausible ne veut pas dire vrai. C’est une hallucination.',
            },
            {
              id: 'c',
              text: 'Il ment pour cacher qu’il ne sait pas.',
              feedback: 'Mentir suppose une intention ; ici, c’est la mécanique de prédiction qui parle.',
            },
            {
              id: 'd',
              text: 'Il a lu la date dans ton navigateur.',
              feedback: 'Le modèle seul ne voit que le texte qu’on lui envoie.',
            },
          ],
          explanation:
            'Une hallucination est une réponse plausible mais fausse. Pour connaître la date, il faudra que le harnais la lui donne… ou lui fournisse un outil.',
        },
        {
          id: 'q-window',
          prompt: 'Qu’est-ce que la fenêtre de contexte ?',
          choices: [
            {
              id: 'a',
              text: 'La quantité maximale de tokens que le modèle peut prendre en compte en une fois.',
              correct: true,
              feedback: 'Exact. Tout ce qui dépasse n’est pas vu.',
            },
            {
              id: 'b',
              text: 'La fenêtre de l’application où s’affiche la réponse.',
              feedback: 'C’est une limite du modèle, pas un élément d’interface.',
            },
            {
              id: 'c',
              text: 'Le nombre de conversations que le modèle garde en mémoire à vie.',
              feedback: 'Le modèle ne garde aucune conversation : il ne voit que ce qu’on lui envoie à chaque appel.',
            },
            {
              id: 'd',
              text: 'Le temps maximal dont dispose le modèle pour répondre.',
              feedback: 'Elle se mesure en tokens, pas en secondes.',
            },
          ],
          explanation:
            'La fenêtre contient tout : instructions, historique, documents… et la réponse en cours d’écriture.',
        },
        {
          id: 'q-stateless',
          prompt: 'Entre deux messages, que retient le modèle lui-même de la conversation ?',
          choices: [
            {
              id: 'a',
              text: 'Tout : il a une mémoire parfaite.',
              feedback: 'Sans l’historique renvoyé, il repart de zéro.',
            },
            {
              id: 'b',
              text: 'Rien : c’est le programme autour qui lui renvoie l’historique à chaque appel.',
              correct: true,
              feedback: 'Oui ! Ce programme autour du modèle, c’est le début du harnais.',
            },
            {
              id: 'c',
              text: 'Seulement les 10 derniers messages.',
              feedback: 'Ce n’est pas le modèle qui choisit : il ne garde rien du tout.',
            },
            {
              id: 'd',
              text: 'Uniquement les informations importantes.',
              feedback: 'Le modèle ne trie rien entre deux appels : il est sans état.',
            },
          ],
          explanation:
            'Un modèle est « sans état » : la mémoire de la conversation est gérée à l’extérieur, par le harnais.',
        },
        {
          id: 'q-overflow',
          prompt: 'Une conversation dépasse la fenêtre de contexte. Si rien n’est prévu, que se passe-t-il ?',
          choices: [
            {
              id: 'a',
              text: 'Le modèle devient plus intelligent grâce à tout ce texte.',
              feedback: 'Au-delà de la limite, le texte n’est même pas lu.',
            },
            {
              id: 'b',
              text: 'Une partie du texte (souvent le début) est coupée, ou la requête est refusée.',
              correct: true,
              feedback: 'Exact. D’où l’intérêt de surveiller le remplissage.',
            },
            {
              id: 'c',
              text: 'Le modèle compresse tout sans rien perdre.',
              feedback: 'Aucune compression magique : résumer est un choix du harnais (la compaction, au niveau 7).',
            },
            {
              id: 'd',
              text: 'La fenêtre s’agrandit automatiquement.',
              feedback: 'Sa taille est fixée par le modèle.',
            },
          ],
          explanation:
            'Gérer ce qui entre dans la fenêtre (couper, résumer, épingler) est un travail du harnais, pas du modèle.',
        },
        {
          id: 'q-temperature',
          prompt: 'Dans le mini-jeu, à quoi sert la température ?',
          choices: [
            {
              id: 'a',
              text: 'À refroidir les serveurs.',
              feedback: 'Bien essayé ! C’est un réglage de génération, pas de climatisation.',
            },
            {
              id: 'b',
              text: 'À rendre le modèle plus savant.',
              feedback: 'Elle ne change pas ce que le modèle sait, seulement la façon dont il tire le token suivant.',
            },
            {
              id: 'c',
              text: 'À régler le hasard du tirage : basse, le plus probable ; haute, plus de variété.',
              correct: true,
              feedback: 'Oui. Haute température : plus de variété… et plus de risques.',
            },
            {
              id: 'd',
              text: 'À limiter la longueur des réponses.',
              feedback: 'La longueur se règle autrement, avec un nombre maximal de tokens.',
            },
          ],
          explanation:
            'La température accentue ou aplatit la distribution de probabilités avant le tirage du token.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['token', 'next-token', 'context-window'],
      message:
        'Ma jauge de contexte ! Mon harnais compte maintenant les tokens qu’il m’envoie et sait quand la fenêtre approche de sa limite. Mon cerveau, lui, n’a pas bougé d’un octet.',
    },
    tutor: {
      suggestions: ['t0-token', 't0-letters', 't0-hallu', 't0-window'],
      entries: [
        {
          id: 't0-token',
          question: 'C’est quoi, un token ?',
          keywords: ['token', 'tokens', 'jeton', 'jetons', 'morceau', 'morceaux', 'decoupe', 'decouper', 'tokeniseur', 'tokenisation', 'vocabulaire'],
          answer:
            'Un token est un morceau de texte : un mot entier, un bout de mot ou un signe. Le modèle découpe tout texte en tokens tirés d’un vocabulaire fixe, puis travaille sur leurs numéros. Imagine des briques numérotées : le modèle assemble des briques, il ne voit pas la matière dont elles sont faites. C’est pour ça qu’on compte les coûts et les limites en tokens, pas en mots.',
        },
        {
          id: 't0-letters',
          question: 'Pourquoi un LLM se trompe-t-il en comptant des lettres ?',
          keywords: ['compter', 'compte', 'lettre', 'lettres', 'epeler', 'orthographe', 'caractere', 'caracteres', 'strawberry'],
          answer:
            'Parce qu’il ne voit pas les lettres ! « arrière-grand-mère » lui arrive en 6 morceaux numérotés, pas en 18 caractères. Pour compter les « r », il doit se souvenir de l’orthographe de chaque morceau, et il se trompe souvent. Les agents modernes contournent le problème en confiant ce genre de calcul à un outil, par exemple un bout de code : ce sera le niveau 2.',
        },
        {
          id: 't0-hallu',
          question: 'C’est quoi, une hallucination ?',
          keywords: ['hallucination', 'hallucinations', 'halluciner', 'invente', 'inventer', 'faux', 'fausse', 'ment', 'mentir', 'mensonge', 'plausible', 'erreur'],
          answer:
            'C’est une réponse plausible mais fausse, affirmée avec aplomb. Elle vient de la mécanique même du LLM : il produit la suite la plus probable du texte, sans vérifier si elle est vraie. Comme l’autocomplétion de ton téléphone, il propose ce qui « sonne juste ». Pour réduire les hallucinations, un harnais peut fournir des sources fiables (la recherche documentaire du niveau 5) ou des outils de vérification.',
        },
        {
          id: 't0-predict',
          question: 'Comment un LLM choisit-il ses mots ?',
          keywords: ['choisir', 'choisit', 'choix', 'probabilite', 'probabilites', 'prediction', 'predire', 'predit', 'suivant', 'generer', 'genere', 'generation', 'autoregressif', 'autoregressive', 'mot', 'mots'],
          answer:
            'Token par token. À chaque étape, il calcule une probabilité pour chacun des tokens de son vocabulaire, en tire un, l’ajoute au texte et recommence avec ce texte allongé : c’est la génération autorégressive. Un peu comme écrire une histoire où chaque mot dépend de tous ceux d’avant… sans jamais pouvoir revenir en arrière.',
        },
        {
          id: 't0-temp',
          question: 'À quoi sert la température ?',
          keywords: ['temperature', 'hasard', 'aleatoire', 'creatif', 'creativite', 'tirage', 'echantillonnage', 'sampling', 'variete'],
          answer:
            'La température règle le hasard du tirage. Basse : le modèle prend presque toujours le token le plus probable, c’est stable mais répétitif. Haute : les tokens moins probables ont leur chance, c’est plus varié… et plus risqué. Imagine un DJ prudent qui passe toujours le tube du moment, et un DJ audacieux qui tente des morceaux rares. Certaines API récentes ne laissent plus régler ce paramètre, mais le principe reste.',
        },
        {
          id: 't0-window',
          question: 'C’est quoi, la fenêtre de contexte ?',
          keywords: ['fenetre', 'contexte', 'limite', 'longueur', 'taille', 'context', 'window', 'deborde', 'deborder'],
          answer:
            'C’est la quantité maximale de tokens que le modèle peut prendre en compte d’un coup : instructions, historique, documents, et même la réponse qu’il est en train d’écrire. Au-delà, le texte n’est tout simplement pas vu. Pense à un tableau blanc de taille fixe : quand il est plein, il faut effacer quelque chose. Décider quoi effacer ou résumer est un travail du harnais (niveaux 6 et 7).',
        },
        {
          id: 't0-memory',
          question: 'Le modèle se souvient-il de nos conversations ?',
          keywords: ['souvenir', 'souviens', 'souvient', 'memoire', 'retenir', 'retient', 'oublie', 'oublier', 'etat', 'historique', 'conversation', 'conversations'],
          answer:
            'Non : le modèle lui-même est « sans état », il ne garde rien entre deux appels. Si tu as l’impression qu’il se souvient, c’est que le programme autour de lui (le harnais) lui renvoie l’historique à chaque message. Comme une personne amnésique qui relit ses notes avant chaque réponse : sans les notes, plus rien. La vraie mémoire long terme arrive au niveau 5.',
        },
        {
          id: 't0-date',
          question: 'Pourquoi Bob ne connaît-il pas la date du jour ?',
          keywords: ['date', 'jour', 'aujourd', 'aujourdhui', 'heure', 'actualite', 'actualites', 'recent', 'recente', 'coupure', 'cutoff', 'calendrier'],
          answer:
            'Parce qu’un LLM n’a ni horloge ni accès au monde : il ne connaît que ses données d’entraînement, qui s’arrêtent à une date précise (la date de coupure), et le texte qu’on lui envoie. Si on lui demande la date, il complète la phrase avec une date plausible. La solution vient du harnais : écrire la date dans le contexte, ou lui donner un outil pour la consulter.',
        },
      ],
    },
  },
};
