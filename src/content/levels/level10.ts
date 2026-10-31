import type { GlossaryCard, LevelDefinition } from '../types';

export const level10Cards: GlossaryCard[] = [
  {
    id: 'long-horizon',
    term: 'Long horizon',
    levelId: 'l10',
    definition:
      'Se dit d’une tâche qui demande des heures de travail et de nombreuses étapes, au-delà d’une seule session ou d’une seule fenêtre de contexte. Elle exige de la persistance : notes de progression, points de sauvegarde, reprise propre.',
    analogy: 'L’expédition qui progresse de camp en camp, en notant à chaque étape l’itinéraire parcouru et le matériel restant.',
    example: 'Coder une appli en plusieurs sessions : chacune lit `progression.md`, lance les tests, ajoute une fonctionnalité, puis committe.',
    pitfall: {
      myth: 'Une fenêtre de contexte plus grande suffit pour les longues tâches.',
      truth: 'Même immense, elle finit par déborder ou se dégrader : il faut écrire l’état du travail hors du contexte.',
    },
    rarity: 'rare',
    icon: 'long-horizon',
  },
  {
    id: 'benchmark',
    term: 'Benchmark',
    levelId: 'l10',
    definition:
      'Série de tâches standardisées, avec une vérification automatique de la réussite, pour comparer des modèles ou des agents. Exemples : SWE-bench Verified, Terminal-Bench, OSWorld.',
    analogy: 'L’examen national : le même sujet pour tout le monde, corrigé avec le même barème.',
    example: 'SWE-bench Verified : 500 vrais bugs de projets Python ; l’agent réussit si les tests du projet passent après sa correction.',
    pitfall: {
      myth: 'Un bon score à un benchmark garantit un bon agent pour mon usage.',
      truth: 'Il mesure une compétence précise, parfois faussée par la contamination : il faut aussi tester sur ses propres tâches.',
    },
    rarity: 'commune',
    icon: 'benchmark',
  },
  {
    id: 'eval-harness',
    term: 'Eval harness',
    levelId: 'l10',
    definition:
      'Infrastructure qui fait passer un agent au banc d’essai : elle lance de nombreuses tâches dans des environnements propres, plusieurs fois chacune, note chaque essai avec des correcteurs et calcule les résultats (réussite, fiabilité, coût).',
    analogy: 'Le banc d’essai qui fait tourner un moteur pendant des heures, en conditions contrôlées, et mesure tout.',
    example: '200 tâches, 4 essais chacune, corrigées par des tests : version A 71 %, version B 83 %, pour un coût 10 % plus élevé.',
    pitfall: {
      myth: 'Essayer l’agent soi-même sur deux exemples, c’est l’évaluer.',
      truth: 'Deux exemples ne prouvent rien : il faut beaucoup de tâches, plusieurs essais et des critères fixés à l’avance.',
    },
    rarity: 'épique',
    icon: 'eval-harness',
  },
  {
    id: 'llm-judge',
    term: 'LLM-as-judge',
    levelId: 'l10',
    definition:
      'Utiliser un modèle comme correcteur : il note une réponse selon une grille, quand aucun test automatique ne suffit (qualité d’un résumé, ton d’une réponse, respect d’une consigne).',
    analogy: 'Le correcteur armé d’un barème détaillé, dont on vérifie les notes de temps en temps en les comparant à celles d’un collègue.',
    example: '« Note de 1 à 5 : exactitude, sources citées, clarté. » Les verdicts sont d’abord comparés à 100 notes humaines.',
    pitfall: {
      myth: 'Un modèle juge est objectif.',
      truth: 'Il a des biais (réponses longues, première position, son propre style) : on le calibre et on mélange l’ordre.',
    },
    rarity: 'rare',
    icon: 'llm-judge',
  },
];

export const level10: LevelDefinition = {
  id: 'l10',
  order: 10,
  badge: '10',
  title: 'Long horizon et évaluation',
  shortTitle: 'Évaluer',
  concept:
    'Agents qui travaillent des heures, persistance, benchmarks, LLM-as-judge ; agent harness contre eval harness.',
  zone: 'observatoire',
  harnessPieceId: 'eval-badge',
  content: {
    problem: {
      mission: {
        title: 'La longue mission',
        brief: 'Bob est désormais capable de grandes choses. Inès lui confie un vrai projet, de plusieurs heures, et veut savoir s’il progresse vraiment.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Bob, code l’appli de révision de la promo : comptes, quiz, statistiques. Prends le temps qu’il faut.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Bob travaille deux heures d’affilée. Puis la session se termine.' },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Bonjour ! Où en est le projet ? Qu’est-ce qui marche déjà ?' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Rien n’était noté : ni l’avancement, ni ce qui reste, ni ce qui est testé. La nouvelle session repart à l’aveugle.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Inès hésite entre deux versions du harnais. Elle essaie chacune sur une seule tâche.' },
        { kind: 'say', speaker: 'user', who: 'Inès', text: 'La version B a réussi, pas la A : B est meilleure !' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Un seul essai ne prouve rien : un agent réussit parfois par chance. Sur 200 essais, c’est la version A la plus fiable.',
        },
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Pour noter des résumés, Inès demande à un modèle de servir de juge. Il donne toujours la meilleure note au plus long.',
        },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Un juge non calibré a ses biais : la mesure ment, et on améliore… la longueur des résumés.',
        },
      ],
      summary:
        'Bob peut travailler des heures : son harnais doit **tenir la distance** (notes de progression, points de sauvegarde, reprise propre). Et pour savoir s’il progresse vraiment, il faut un **banc d’essai** : beaucoup de tâches, plusieurs essais, des correcteurs fiables.',
      question: 'Comment faire tenir un agent sur la durée, et mesurer ce qu’il vaut ?',
    },
    concept: [
      {
        id: 'long',
        title: 'Tenir la distance',
        body:
          'La durée des tâches que les agents mènent à bien augmente vite : selon une étude de METR publiée en 2025, elle double environ tous les 7 mois depuis 2019. Une mission de plusieurs heures dépasse une seule session et une seule fenêtre de contexte.\n\nLe harnais organise donc la **persistance** : notes de progression, liste de ce qui reste, commits git comme points de sauvegarde, tests qui disent ce qui marche. Une nouvelle session relit tout ça et reprend là où la précédente s’était arrêtée.',
        analogy: {
          title: 'L’expédition en montagne',
          text: 'Une ascension de plusieurs jours se fait de camp en camp. À chaque camp, on note l’itinéraire parcouru, le matériel restant, la météo. Si une nouvelle cordée prend le relais, elle repart du dernier camp, pas de la vallée.',
        },
        takeaway: 'Sur une longue mission, le harnais écrit l’état du travail pour qu’une nouvelle session reprenne sans repartir de zéro.',
        illustration: 'l10-checkpoints',
      },
      {
        id: 'benchmarks',
        title: 'Les benchmarks, des examens pour agents',
        body:
          'Pour comparer des agents, on utilise des **benchmarks** : des séries de tâches avec une vérification automatique. **SWE-bench Verified** : corriger de vrais bugs de projets open source. **Terminal-Bench** : accomplir des tâches dans un terminal. **OSWorld** : utiliser un ordinateur comme un humain. **tau-bench** : servir des clients en respectant des règles.\n\nLimites : les questions peuvent fuiter dans les données d’entraînement (**contamination**), le benchmark peut saturer, ou ne pas ressembler à ton cas. D’où l’intérêt de construire ses propres évaluations.',
        analogy: {
          title: 'L’examen et le contrôle continu',
          text: 'Une seule note d’examen ne dit pas tout : l’élève a pu tomber sur le sujet qu’il avait révisé, ou voir les questions à l’avance. Des exercices variés, toute l’année, donnent une image bien plus fidèle.',
        },
        takeaway: 'Un benchmark mesure une compétence précise sur des tâches vérifiables. Il ne remplace pas tes propres tests.',
        illustration: 'l10-benchmarks',
      },
      {
        id: 'eval',
        title: 'Le banc d’essai : l’eval harness',
        body:
          'L’**agent harness** fait travailler l’agent. L’**eval harness** le fait passer au banc d’essai : il lance des dizaines de tâches dans des environnements propres, plusieurs fois chacune, puis note les résultats avec des **correcteurs** : tests automatiques, vérification de l’état final, ou modèle juge (**LLM-as-judge**) qui suit une grille.\n\nUn juge a des biais (réponses longues, première position) : on le calibre sur des notes humaines. Et on mesure la **fiabilité** : réussir 4 essais sur 4 vaut mieux qu’une réussite chanceuse.',
        analogy: {
          title: 'Le moteur et le banc d’essai',
          text: 'Le moteur fait avancer la voiture. Le banc d’essai le fait tourner des heures en conditions contrôlées et mesure tout : puissance, consommation, pannes. On ne confond pas les deux, et on a besoin des deux.',
        },
        takeaway: 'Agent harness pour travailler, eval harness pour mesurer : beaucoup de tâches, plusieurs essais, des correcteurs fiables.',
        illustration: 'l10-eval',
      },
    ],
    minigame: {
      id: 'test-bench',
      title: 'Le banc d’essai',
      intro:
        'Trois manches : **reprendre** une longue mission dans le bon ordre, **interpréter** des résultats d’évaluation sans se faire piéger, puis distinguer **agent harness et eval harness**.',
      xp: 60,
    },
    boss: {
      name: 'Le Goodhart',
      sprite: 'goodhart',
      intro: 'Mon score est parfait : 100 % ! Que je ne sache rien faire en dehors du test, quelle importance ?',
      victory: 'Quand une mesure devient un objectif, elle cesse d’être une bonne mesure… Je l’avais oublié.',
      defeat: '100 % ! Toujours 100 % ! Ne regarde surtout pas ailleurs !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-persist',
          prompt: 'Une mission de 10 heures dépasse une session. Que doit faire le harnais ?',
          choices: [
            { id: 'a', text: 'Tout recommencer à chaque session.', feedback: 'On perdrait tout le travail accompli.' },
            {
              id: 'b',
              text: 'Écrire l’état du travail (notes, liste, commits) pour qu’une nouvelle session reprenne.',
              correct: true,
              feedback: 'Exact : la persistance vit hors du contexte.',
            },
            { id: 'c', text: 'Demander au modèle de tout retenir.', feedback: 'Il ne garde rien d’une session à l’autre.' },
            { id: 'd', text: 'Interdire les missions de plus d’une heure.', feedback: 'Ce serait renoncer aux longues tâches au lieu de les organiser.' },
          ],
          explanation: 'Notes de progression, liste des tâches, commits et tests : de camp en camp.',
        },
        {
          id: 'q-metr',
          prompt: 'Selon l’étude de METR (2025), comment évolue la durée des tâches que les agents savent mener à bien ?',
          choices: [
            { id: 'a', text: 'Elle stagne depuis 2019.', feedback: 'Au contraire, elle augmente vite.' },
            { id: 'b', text: 'Elle diminue à mesure que les tâches se compliquent.', feedback: 'Non : la tendance mesurée est à la hausse.' },
            {
              id: 'c',
              text: 'Elle double environ tous les 7 mois.',
              correct: true,
              feedback: 'Oui : une croissance exponentielle depuis 2019, selon cette étude.',
            },
            { id: 'd', text: 'Elle double chaque semaine.', feedback: 'Beaucoup trop rapide.' },
          ],
          explanation: 'Plus les tâches s’allongent, plus la persistance et l’évaluation deviennent cruciales.',
        },
        {
          id: 'q-swe',
          prompt: 'Qu’est-ce que SWE-bench Verified ?',
          choices: [
            {
              id: 'a',
              text: 'Un benchmark de vrais bugs de projets open source, vérifiés par les tests des projets.',
              correct: true,
              feedback: 'Exact : l’agent réussit si les tests passent après sa correction.',
            },
            { id: 'b', text: 'Un concours de vitesse de frappe.', feedback: 'Rien à voir.' },
            { id: 'c', text: 'Un label officiel de qualité des agents.', feedback: 'C’est un test parmi d’autres, pas un label.' },
            { id: 'd', text: 'Un benchmark de traduction.', feedback: 'Il porte sur la correction de code.' },
          ],
          explanation: 'Un benchmark = des tâches standardisées et une vérification automatique.',
        },
        {
          id: 'q-contamination',
          prompt: 'Qu’est-ce que la contamination d’un benchmark ?',
          choices: [
            { id: 'a', text: 'Un virus dans les fichiers du benchmark.', feedback: 'Il ne s’agit pas de sécurité informatique.' },
            { id: 'b', text: 'Une erreur dans le barème.', feedback: 'C’est un autre problème.' },
            { id: 'c', text: 'Un benchmark trop difficile.', feedback: 'La difficulté n’est pas en cause.' },
            {
              id: 'd',
              text: 'Ses questions se retrouvent dans les données d’entraînement : le score est gonflé.',
              correct: true,
              feedback: 'Oui : le modèle a « vu le sujet » avant l’examen.',
            },
          ],
          explanation: 'Un score sur un benchmark contaminé surestime la vraie compétence.',
        },
        {
          id: 'q-harnesses',
          prompt: 'Quelle différence entre agent harness et eval harness ?',
          choices: [
            { id: 'a', text: 'Aucune, ce sont deux noms pour la même chose.', feedback: 'Ils ont des rôles bien distincts.' },
            {
              id: 'b',
              text: 'L’un fait travailler l’agent ; l’autre le fait passer au banc d’essai et mesure ses résultats.',
              correct: true,
              feedback: 'Exact : le moteur et le banc d’essai.',
            },
            { id: 'c', text: 'L’eval harness remplace l’agent harness en production.', feedback: 'En production, c’est l’agent harness qui tourne.' },
            { id: 'd', text: 'L’agent harness note les réponses de l’eval harness.', feedback: 'C’est l’inverse.' },
          ],
          explanation: 'On a besoin des deux : l’un pour agir, l’autre pour savoir si ça marche.',
        },
        {
          id: 'q-judge',
          prompt: 'Quel est le risque d’un LLM-as-judge non calibré ?',
          choices: [
            { id: 'a', text: 'Il coûte toujours plus cher que des humains.', feedback: 'Souvent, il coûte moins cher : ce n’est pas le problème.' },
            { id: 'b', text: 'Il refuse de noter.', feedback: 'Il note, mais pas forcément bien.' },
            {
              id: 'c',
              text: 'Des biais (longueur, position, style) qui faussent les notes.',
              correct: true,
              feedback: 'Oui : d’où la calibration sur des notes humaines et l’ordre mélangé.',
            },
            { id: 'd', text: 'Il modifie les réponses qu’il note.', feedback: 'Il les lit, il ne les modifie pas.' },
          ],
          explanation: 'Un juge se vérifie lui aussi : grille claire, ordre mélangé, comparaison avec des humains.',
        },
        {
          id: 'q-trials',
          prompt: 'Pourquoi lancer plusieurs essais par tâche ?',
          choices: [
            {
              id: 'a',
              text: 'Parce qu’un agent n’est pas déterministe : on mesure sa fiabilité, pas un coup de chance.',
              correct: true,
              feedback: 'Exact : 4 réussites sur 4 ne veulent pas dire la même chose qu’une sur quatre.',
            },
            { id: 'b', text: 'Pour garder seulement le meilleur essai et afficher un beau score.', feedback: 'C’est exactement le travers du Goodhart.' },
            { id: 'c', text: 'Pour fatiguer l’agent.', feedback: 'Un agent ne se fatigue pas.' },
            { id: 'd', text: 'Pour consommer le budget.', feedback: 'Ce n’est jamais un objectif.' },
          ],
          explanation: 'Plusieurs essais par tâche : on voit la fiabilité, pas seulement la réussite possible.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob tient des missions de 10 heures et prouve ses progrès chiffres à l’appui. Qu’est-ce qui a changé ?',
          choices: [
            { id: 'a', text: 'Son modèle a été réentraîné pour durer plus longtemps.', feedback: 'Toujours le même modèle.' },
            { id: 'b', text: 'Il note lui-même ses résultats, sans vérification.', feedback: 'S’auto-évaluer sans contrôle, c’est la porte ouverte au Goodhart.' },
            { id: 'c', text: 'Inès a raccourci les missions.', feedback: 'Elles durent toujours des heures.' },
            {
              id: 'd',
              text: 'Son harnais organise la persistance, et un banc d’essai mesure ses résultats.',
              correct: true,
              feedback: 'Exactement : même cerveau, harnais endurant et mesuré.',
            },
          ],
          explanation: 'Tenir la distance et mesurer honnêtement : deux affaires de harnais.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['long-horizon', 'benchmark', 'eval-harness', 'llm-judge'],
      message:
        'Mon badge d’évaluation ! Je tiens la distance de camp en camp, et mes progrès se mesurent sur un vrai banc d’essai. Même cerveau, mais je sais ce que je vaux.',
    },
    tutor: {
      suggestions: ['t10-persist', 't10-benchmark', 't10-eval', 't10-judge'],
      entries: [
        {
          id: 't10-persist',
          question: 'Comment un agent tient-il une mission de plusieurs heures ?',
          keywords: ['longue', 'long', 'heures', 'session', 'persistance', 'reprendre', 'reprise', 'horizon'],
          answer:
            'Grâce à la persistance organisée par le harnais : des notes de progression (ce qui est fait, ce qui reste, les bugs connus), une liste des fonctionnalités, des commits git comme points de sauvegarde et des tests qui disent ce qui marche. Chaque nouvelle session relit ces traces, vérifie que tout fonctionne encore, puis reprend où la précédente s’était arrêtée.',
        },
        {
          id: 't10-metr',
          question: 'Les agents tiennent-ils des tâches de plus en plus longues ?',
          keywords: ['metr', 'duree', 'double', 'mois', 'tendance', 'evolution', 'progres'],
          answer:
            'Oui. Une étude de METR publiée en 2025 mesure la durée des tâches (en temps de travail humain) que les agents réussissent : elle double environ tous les 7 mois depuis 2019, et certaines mesures récentes suggèrent même une accélération. D’où l’importance croissante de la persistance… et de l’évaluation.',
        },
        {
          id: 't10-benchmark',
          question: 'C’est quoi, un benchmark ?',
          keywords: ['benchmark', 'benchmarks', 'swe', 'bench', 'osworld', 'terminal', 'examen', 'score'],
          answer:
            'Une série de tâches standardisées avec une vérification automatique, pour comparer des agents. SWE-bench Verified (corriger de vrais bugs open source), Terminal-Bench (tâches en terminal), OSWorld (utiliser un ordinateur), tau-bench (service client avec des règles)… Limites : contamination, saturation, et écart avec ton propre usage.',
        },
        {
          id: 't10-contamination',
          question: 'C’est quoi, la contamination ?',
          keywords: ['contamination', 'fuite', 'entrainement', 'gonfle', 'triche', 'vu'],
          answer:
            'C’est quand les questions d’un benchmark (ou leurs réponses) se retrouvent dans les données d’entraînement du modèle. Il a alors « vu le sujet » avant l’examen, et son score surestime sa vraie compétence. On s’en protège avec des tâches récentes, privées ou renouvelées, et en testant sur ses propres cas.',
        },
        {
          id: 't10-eval',
          question: 'Agent harness ou eval harness ?',
          keywords: ['eval', 'evaluation', 'harness', 'banc', 'essai', 'mesurer', 'difference'],
          answer:
            'L’agent harness fait travailler l’agent : boucle, outils, contexte, permissions. L’eval harness le fait passer au banc d’essai : il lance de nombreuses tâches dans des environnements propres, plusieurs fois chacune, note chaque essai avec des correcteurs (tests, état final, juge) et calcule réussite, fiabilité et coût. Le moteur, et le banc d’essai.',
        },
        {
          id: 't10-judge',
          question: 'C’est quoi, LLM-as-judge ?',
          keywords: ['judge', 'juge', 'llm', 'noter', 'note', 'correcteur', 'grille', 'biais'],
          answer:
            'C’est utiliser un modèle comme correcteur, avec une grille, quand aucun test automatique ne suffit (qualité d’un résumé, ton d’une réponse). Pratique, mais biaisé : il préfère souvent les réponses longues, celle présentée en premier, ou son propre style. On le calibre sur des notes humaines, on mélange l’ordre, et on garde une grille précise.',
        },
      ],
    },
  },
};
