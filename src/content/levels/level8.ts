import type { GlossaryCard, LevelDefinition } from '../types';

export const level8Cards: GlossaryCard[] = [
  {
    id: 'orchestrator',
    term: 'Orchestrateur',
    levelId: 'l8',
    definition:
      'Agent qui découpe une mission, lance des sous-agents avec un brief précis, puis assemble leurs résultats. Il garde la vue d’ensemble sans faire lui-même tout le travail.',
    analogy: 'La rédactrice en chef qui répartit les sujets entre ses journalistes, puis relit et assemble le journal.',
    example: '30 articles à résumer : 5 sous-agents de 6 articles chacun, puis une synthèse des tendances.',
    pitfall: {
      myth: 'Plus on lance d’agents, mieux c’est.',
      truth: 'Chaque agent coûte des tokens et de la coordination : on en lance autant que la tâche le justifie.',
    },
    rarity: 'épique',
    icon: 'orchestrator',
  },
  {
    id: 'subagent',
    term: 'Sous-agent',
    levelId: 'l8',
    definition:
      'Agent lancé par un autre pour une sous-tâche, avec son propre contexte, tout neuf, et ses propres outils. Il rend un résultat condensé, pas ses brouillons.',
    analogy: 'Le journaliste envoyé sur un seul sujet, avec une consigne claire, qui rend son article et pas ses carnets de notes.',
    example: '« Articles 13 à 18 : 5 lignes chacun (question, méthode, résultat, limite), PDF fournis uniquement. »',
    pitfall: {
      myth: 'Un sous-agent sait tout ce que sait l’agent qui l’a lancé.',
      truth: 'Il ne voit que son brief : tout ce qui n’y est pas écrit, il l’ignore.',
    },
    rarity: 'rare',
    icon: 'subagent',
  },
  {
    id: 'swarm',
    term: 'Essaim (swarm)',
    levelId: 'l8',
    definition:
      'Organisation sans chef central : des agents spécialisés se passent le relais (handoff) selon la demande, en transmettant le contexte utile. Souple, mais plus difficile à contrôler.',
    analogy: 'La fourmilière : aucune fourmi ne commande, chacune réagit aux signaux de ses voisines, et pourtant le travail avance.',
    example: 'Accueil → facturation → remboursements, chaque agent passant la main avec un résumé de la demande.',
    pitfall: {
      myth: 'Sans chef, les agents s’organisent toujours bien tout seuls.',
      truth: 'Sans règles de transmission ni limite de relais, ils peuvent se renvoyer la balle indéfiniment.',
    },
    rarity: 'rare',
    icon: 'swarm',
  },
];

export const level8: LevelDefinition = {
  id: 'l8',
  order: 8,
  badge: '8',
  title: 'Multi-agents',
  shortTitle: 'Multi-agents',
  concept: 'Orchestrateur, sous-agents et swarms : le harnais qui lance d’autres agents.',
  zone: 'archipel',
  harnessPieceId: 'drone-bay',
  content: {
    problem: {
      mission: {
        title: 'Les trente articles',
        brief: 'Bob a un harnais solide. Mais Inès lui confie une mission bien trop large pour un seul agent.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Pour mon mémoire, j’ai 30 articles sur les agents. Résume chacun (question, méthode, résultat), puis dégage les tendances.',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'Je les lis tous, dans l’ordre ! Article 1… article 2…' },
        { kind: 'say', speaker: 'narrator', text: 'Trois heures plus tard, Bob en est à l’article 19. Son contexte a été compacté quatre fois.' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Les articles sont indépendants, mais Bob les traite un par un : la mission prend des heures.',
        },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Tendance : l’article 4 montre que… ou était-ce l’article 17 ?' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Trente articles dans un seul contexte : les résumés se mélangent, et chaque compaction efface des détails.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Inès lui demande en plus de vérifier toutes les citations et la bibliographie.' },
        { kind: 'say', speaker: 'bob', mood: 'sad', text: 'Je résume, je vérifie, je mets en forme, je… où en étais-je ?' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Un seul agent jongle avec des tâches très différentes : il les fait toutes moins bien.',
        },
      ],
      summary:
        'Un agent seul a un seul contexte et ne fait qu’une chose à la fois. Pour une mission **large**, le harnais peut lancer **d’autres agents** : chacun reçoit une sous-tâche, travaille dans **son propre contexte**, **en parallèle**, et rend un résultat condensé.',
      question: 'Comment faire travailler plusieurs agents ensemble ?',
    },
    concept: [
      {
        id: 'orchestrator',
        title: 'L’orchestrateur et ses sous-agents',
        body:
          'Un agent **orchestrateur** découpe la mission et lance des **sous-agents**, chacun avec un brief précis : objectif, format attendu, périmètre, outils autorisés. Chaque sous-agent travaille dans **son propre contexte**, tout neuf, concentré sur sa sous-tâche.\n\nIl ne rend pas ses brouillons, seulement un résultat condensé. L’orchestrateur assemble les morceaux et garde la vue d’ensemble.',
        analogy: {
          title: 'La rédactrice en chef',
          text: 'Elle n’écrit pas tout le journal. Elle répartit les sujets entre ses journalistes, chacun avec une consigne et une longueur, puis relit et assemble. Elle lit leurs articles, pas leurs carnets de notes.',
        },
        takeaway: 'L’orchestrateur délègue des sous-tâches à des sous-agents au contexte propre, puis assemble leurs résultats condensés.',
        illustration: 'l8-orchestra',
      },
      {
        id: 'when',
        title: 'Quand paralléliser, et quand s’abstenir',
        body:
          'Plusieurs agents brillent sur les tâches **larges et indépendantes** : 30 articles, 12 fournisseurs à comparer, 5 bases documentaires. Ils avancent en parallèle et chaque contexte reste léger.\n\nMais cela coûte cher : chaque sous-agent consomme ses propres tokens. En 2025, Anthropic a rapporté que son système de recherche multi-agents consommait environ 15 fois plus de tokens qu’une simple conversation. Et ça marche mal sur les tâches **très liées**, comme modifier ensemble des fichiers qui dépendent les uns des autres.',
        analogy: {
          title: 'Le déménagement',
          text: 'À dix amis, on vide un appartement bien plus vite : chacun porte ses cartons. Mais pour monter une armoire, dix personnes qui serrent les mêmes vis en même temps, c’est le chaos.',
        },
        takeaway: 'Plusieurs agents pour le large et l’indépendant ; un seul pour le très lié. Et toujours un œil sur le coût.',
        illustration: 'l8-when',
      },
      {
        id: 'swarm',
        title: 'Essaims et passages de relais',
        body:
          'Autre organisation, sans chef : dans un **essaim** (swarm), des agents spécialisés se passent le relais (**handoff**) selon la demande. L’accueil transmet à la facturation, qui transmet aux remboursements, à chaque fois avec un résumé utile.\n\nC’est souple, mais plus difficile à contrôler : des agents peuvent se renvoyer la balle, et la responsabilité se dilue. Il faut des règles de transmission claires et une limite au nombre de relais.',
        analogy: {
          title: 'La fourmilière',
          text: 'Aucune fourmi ne dirige la fourmilière. Chacune réagit aux signaux de ses voisines et passe le relais, et pourtant le travail avance. Mais qu’un signal soit trompeur, et toute une file tourne en rond.',
        },
        takeaway: 'Un essaim se passe le relais sans chef : souple, à condition de fixer des règles et des limites.',
        illustration: 'l8-swarm',
      },
    ],
    minigame: {
      id: 'conductor',
      title: 'Le chef d’orchestre',
      intro:
        'Trois manches : décider s’il faut **un agent ou plusieurs**, composer le **brief parfait** d’un sous-agent, puis éviter les **pièges de la coordination**.',
      xp: 60,
    },
    boss: {
      name: 'L’Hydre',
      sprite: 'hydre',
      intro: 'Trois têtes valent mieux qu’une ! Surtout quand elles font toutes la même chose, en même temps, sans se parler !',
      victory: 'Bon… peut-être qu’une tête pour coordonner les autres, ce n’était pas idiot.',
      defeat: 'Toutes mes têtes ont résumé l’article 1 ! Trois fois ! Quelle efficacité !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-orchestrator',
          prompt: 'Que fait l’orchestrateur dans un système multi-agents ?',
          choices: [
            {
              id: 'a',
              text: 'Il découpe la mission, lance des sous-agents et assemble leurs résultats.',
              correct: true,
              feedback: 'Exact : il délègue et garde la vue d’ensemble.',
            },
            { id: 'b', text: 'Il fait tout lui-même, mais plus vite.', feedback: 'Alors ce ne serait qu’un agent seul.' },
            { id: 'c', text: 'Il entraîne les sous-agents.', feedback: 'Personne n’est entraîné : il leur donne un brief.' },
            { id: 'd', text: 'Il joue de la musique pendant que les agents travaillent.', feedback: 'Joli, mais non.' },
          ],
          explanation: 'Découper, déléguer, assembler : c’est le rôle de l’orchestrateur.',
        },
        {
          id: 'q-context',
          prompt: 'Pourquoi chaque sous-agent a-t-il son propre contexte ?',
          choices: [
            { id: 'a', text: 'Pour qu’il ne sache rien de la mission.', feedback: 'Il en connaît sa part : celle de son brief.' },
            { id: 'b', text: 'Parce qu’il utilise un autre modèle.', feedback: 'Pas forcément : souvent le même modèle, avec un autre contexte.' },
            {
              id: 'c',
              text: 'Pour rester concentré sur sa sous-tâche, sans être noyé par le reste.',
              correct: true,
              feedback: 'Oui : un contexte léger et ciblé, c’est un travail plus précis.',
            },
            { id: 'd', text: 'Pour coûter moins cher au total.', feedback: 'Au total, c’est plutôt l’inverse.' },
          ],
          explanation: 'Isoler les contextes évite le mélange et la surcharge.',
        },
        {
          id: 'q-return',
          prompt: 'Que doit renvoyer un sous-agent à l’orchestrateur ?',
          choices: [
            { id: 'a', text: 'Toutes ses notes et tous les résultats d’outils, pour être complet.', feedback: 'Le contexte de l’orchestrateur déborderait.' },
            {
              id: 'b',
              text: 'Un résultat condensé, au format demandé dans le brief.',
              correct: true,
              feedback: 'Exact : il lit beaucoup et rend peu.',
            },
            { id: 'c', text: 'Rien : il écrit directement dans le document final.', feedback: 'Risque de conflits entre sous-agents.' },
            { id: 'd', text: 'Une copie de son contexte entier.', feedback: 'C’est justement ce qu’on veut éviter.' },
          ],
          explanation: 'Un bon retour est court, structuré, et sourcé.',
        },
        {
          id: 'q-when',
          prompt: 'Pour quelle mission plusieurs agents en parallèle sont-ils le plus utiles ?',
          choices: [
            { id: 'a', text: 'Corriger une fonction de 10 lignes.', feedback: 'Trop petit : la coordination coûterait plus que la tâche.' },
            { id: 'b', text: 'Modifier ensemble trois fichiers qui dépendent les uns des autres.', feedback: 'Tâche très liée : les agents se marcheraient dessus.' },
            { id: 'c', text: 'Répondre « bonjour ».', feedback: 'Un seul agent suffit largement.' },
            {
              id: 'd',
              text: 'Comparer les offres de 12 fournisseurs indépendants.',
              correct: true,
              feedback: 'Oui : large, indépendant, parallélisable.',
            },
          ],
          explanation: 'Large et indépendant : plusieurs agents. Petit ou très lié : un seul.',
        },
        {
          id: 'q-cost',
          prompt: 'Quel est le principal inconvénient d’un système multi-agents ?',
          choices: [
            {
              id: 'a',
              text: 'Il consomme beaucoup plus de tokens, donc coûte plus cher.',
              correct: true,
              feedback: 'Exact : chaque sous-agent a son contexte et ses appels.',
            },
            { id: 'b', text: 'Il est toujours plus lent.', feedback: 'En parallèle, il est souvent bien plus rapide.' },
            { id: 'c', text: 'Il nécessite un modèle différent par agent.', feedback: 'Le même modèle peut servir partout.' },
            { id: 'd', text: 'Il interdit l’usage des outils.', feedback: 'Chaque sous-agent peut avoir les siens.' },
          ],
          explanation: 'Le multi-agents se justifie quand le gain de temps ou de qualité vaut le surcoût.',
        },
        {
          id: 'q-swarm',
          prompt: 'Dans un essaim (swarm), comment le travail circule-t-il ?',
          choices: [
            { id: 'a', text: 'Un chef central distribue tout.', feedback: 'Ça, c’est un orchestrateur.' },
            { id: 'b', text: 'Chaque agent fait toute la mission dans son coin.', feedback: 'Ce serait du travail en double.' },
            {
              id: 'c',
              text: 'Des agents spécialisés se passent le relais, sans chef central.',
              correct: true,
              feedback: 'Oui : des handoffs selon la demande.',
            },
            { id: 'd', text: 'Les agents votent à chaque étape.', feedback: 'Il existe des systèmes de vote, mais ce n’est pas le principe de l’essaim.' },
          ],
          explanation: 'Essaim : passages de relais entre spécialistes, avec des règles et des limites.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob traite les 30 articles en 20 minutes au lieu de 3 heures. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Son modèle lit plus vite.', feedback: 'Même modèle, même vitesse de lecture.' },
            {
              id: 'b',
              text: 'Son harnais lance des sous-agents en parallèle, chacun avec son brief.',
              correct: true,
              feedback: 'Exactement : même cerveau, toute une équipe.',
            },
            { id: 'c', text: 'Inès a supprimé la moitié des articles.', feedback: 'Les 30 articles sont toujours là.' },
            { id: 'd', text: 'Il ne lit plus que les titres.', feedback: 'Chaque article est lu… par un sous-agent.' },
          ],
          explanation: 'Agent = modèle + harnais. Ici, le harnais sait lancer d’autres agents.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['orchestrator', 'subagent', 'swarm'],
      message:
        'Ma baie à drones ! Je lance des sous-agents avec un brief précis, chacun dans son propre contexte, et j’assemble leurs résultats. Même cerveau, mais toute une équipe.',
    },
    tutor: {
      suggestions: ['t8-orchestrator', 't8-subagent', 't8-when', 't8-swarm'],
      entries: [
        {
          id: 't8-orchestrator',
          question: 'C’est quoi, un orchestrateur ?',
          keywords: ['orchestrateur', 'chef', 'deleguer', 'decouper', 'assembler', 'redactrice'],
          answer:
            'C’est un agent qui ne fait pas tout lui-même : il découpe la mission, lance des sous-agents avec un brief précis, puis assemble leurs résultats. Comme une rédactrice en chef qui répartit les sujets entre ses journalistes, puis relit et monte le journal.',
        },
        {
          id: 't8-subagent',
          question: 'C’est quoi, un sous-agent ?',
          keywords: ['sous', 'agent', 'subagent', 'contexte', 'propre', 'isole'],
          answer:
            'Un agent lancé par un autre pour une sous-tâche. Il démarre avec son propre contexte, tout neuf : il ne connaît que son brief. Il travaille, puis rend un résultat condensé au format demandé. Avantage : il reste concentré, et l’orchestrateur n’est pas noyé par ses brouillons.',
        },
        {
          id: 't8-brief',
          question: 'Que mettre dans le brief d’un sous-agent ?',
          keywords: ['brief', 'consigne', 'instructions', 'deleguer', 'format', 'perimetre'],
          answer:
            'L’objectif précis, le format attendu du résultat, le périmètre (ce qui est à lui, et ce qui ne l’est pas), les outils et sources autorisés, et quand s’arrêter. Un brief vague donne du travail en double ou à côté. Et pas besoin de tout l’historique : seulement ce qui sert la sous-tâche.',
        },
        {
          id: 't8-when',
          question: 'Quand utiliser plusieurs agents ?',
          keywords: ['quand', 'plusieurs', 'parallele', 'paralleliser', 'utile', 'independant'],
          answer:
            'Pour les tâches larges et indépendantes : beaucoup de documents à lire, d’options à comparer, de sources à fouiller. Pas pour les tâches petites ou très liées (des fichiers qui dépendent les uns des autres), où les agents se marcheraient dessus. Et toujours en tenant compte du coût en tokens.',
        },
        {
          id: 't8-cost',
          question: 'Pourquoi le multi-agents coûte-t-il cher ?',
          keywords: ['cout', 'cher', 'tokens', 'prix', 'consomme', 'facture'],
          answer:
            'Parce que chaque sous-agent a son propre contexte et fait ses propres appels au modèle. Au total, on consomme beaucoup plus de tokens : Anthropic a rapporté en 2025 environ 15 fois plus de tokens qu’une simple conversation pour son système de recherche multi-agents. Ça vaut le coup si le gain de temps ou de qualité est réel.',
        },
        {
          id: 't8-swarm',
          question: 'C’est quoi, un essaim (swarm) ?',
          keywords: ['essaim', 'swarm', 'relais', 'handoff', 'fourmi', 'fourmiliere', 'chef'],
          answer:
            'Une organisation sans chef central : des agents spécialisés se passent le relais selon la demande (handoff), en transmettant le contexte utile. C’est souple, mais plus dur à contrôler : il faut des règles claires de transmission et une limite au nombre de relais, pour éviter que les agents se renvoient la balle.',
        },
      ],
    },
  },
};
