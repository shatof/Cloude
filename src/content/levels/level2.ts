import type { GlossaryCard, LevelDefinition } from '../types';

export const level2Cards: GlossaryCard[] = [
  {
    id: 'tool-call',
    term: 'Appel d’outil',
    levelId: 'l2',
    definition:
      'Demande d’action structurée produite par le modèle : le nom d’un outil déclaré et ses paramètres (souvent en JSON). Le harnais la valide, l’exécute et renvoie le résultat.',
    analogy:
      'Un bon de commande rempli au guichet : on choisit le service voulu, on remplit les cases, et c’est l’employé qui s’en occupe.',
    example: '`creer_evenement({"date": "2027-01-12", "titre": "Partiel de réseaux"})` → « Événement créé ».',
    pitfall: {
      myth: 'Le modèle exécute lui-même l’outil.',
      truth: 'Il écrit seulement la demande ; c’est le harnais qui exécute, et qui peut refuser.',
    },
    rarity: 'rare',
    icon: 'tool-call',
  },
  {
    id: 'tool-schema',
    term: 'Schéma d’outil',
    levelId: 'l2',
    definition:
      'Description formelle des paramètres d’un outil (types, champs obligatoires, formats, valeurs permises), souvent en JSON Schema. Elle guide le modèle et permet au harnais de valider les appels.',
    analogy:
      'Les cases d’un formulaire administratif : date en JJ/MM/AAAA, une seule case à cocher parmi trois, champs marqués d’une étoile obligatoires.',
    example: '`date` : texte au format AAAA-MM-JJ, obligatoire ; `heure` : HH:MM, facultative.',
    pitfall: {
      myth: 'Une bonne description en français suffit, pas besoin de schéma.',
      truth: 'La description aide à choisir, le schéma contraint le format : il faut les deux, plus une validation par le harnais.',
    },
    rarity: 'commune',
    icon: 'tool-schema',
  },
  {
    id: 'tool-result',
    term: 'Résultat d’outil',
    levelId: 'l2',
    definition:
      'Ce que l’outil renvoie après exécution (données, confirmation ou erreur), que le harnais ajoute au contexte du modèle pour la suite.',
    analogy: 'Le ticket de caisse rendu après un paiement : il prouve ce qui s’est passé et permet de vérifier.',
    example: '`{"ok": false, "erreur": "date : format AAAA-MM-JJ attendu"}` : Bob corrige son appel et réessaie.',
    pitfall: {
      myth: 'Une erreur d’outil doit être cachée au modèle.',
      truth: 'Une erreur claire, renvoyée au modèle, lui permet de corriger son appel au tour suivant.',
    },
    rarity: 'commune',
    icon: 'tool-result',
  },
];

export const level2: LevelDefinition = {
  id: 'l2',
  order: 2,
  badge: '2',
  title: 'Les outils (tool use)',
  shortTitle: 'Outils',
  concept: 'Function calling : choisir le bon outil et remplir correctement ses paramètres.',
  zone: 'atelier',
  harnessPieceId: 'tool-belt',
  content: {
    problem: {
      mission: {
        title: 'Deux petites tâches',
        brief:
          'Bob sait maintenant tourner en boucle et agir… mais son harnais ne lui a encore décrit aucun outil. Inès lui confie deux tâches toutes simples.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Inès',
          text: 'Bob, envoie à Léa le résumé du cours de réseaux, puis ajoute le partiel du 12 janvier à mon agenda.',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'C’est parti : `envoyer_sms(a="Léa", texte="Résumé…")`' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Aucun outil « envoyer_sms » n’existe : Bob a inventé un nom plausible. Personne ne lui a dit quels outils sont disponibles.',
        },
        {
          kind: 'say',
          speaker: 'narrator',
          text: 'Inès colle à la main les noms des outils : `publier_forum`, `envoyer_message`, `creer_evenement`. Sans la moindre explication.',
        },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: 'Compris ! `publier_forum(texte="Résumé du cours pour Léa")`' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Mauvais outil : le résumé part sur le forum de toute la promo au lieu d’aller à Léa.',
        },
        { kind: 'say', speaker: 'bob', mood: 'confused', text: 'Et pour l’agenda : `creer_evenement(date="12/01", titre="partiel")`' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Le système attend une date complète au format AAAA-MM-JJ. « 12/01 », c’est le 12 janvier ou le 1er décembre ? Et quelle année ?',
        },
      ],
      summary:
        'Agir, c’est bien. Encore faut-il savoir **quels outils existent**, **à quoi ils servent** et **comment remplir leurs paramètres**. C’est exactement ce que le harnais doit déclarer au modèle… puis vérifier.',
      question: 'Comment un harnais présente-t-il ses outils à un modèle ?',
    },
    concept: [
      {
        id: 'tool-definition',
        title: 'Un outil : un nom, une description, des paramètres',
        body:
          'Pour chaque outil, le harnais envoie au modèle une **définition** : un nom, une description en langage naturel et un **schéma** des paramètres (le plus souvent en JSON Schema : types, champs obligatoires, valeurs permises).\n\nLe modèle ne voit pas le code de l’outil, seulement cette fiche. C’est d’après la description qu’il choisit : une description vague donne des choix au hasard. Et un outil non déclaré n’existe tout simplement pas pour lui.',
        analogy: {
          title: 'La carte du restaurant',
          text: 'On ne commande que ce qui est sur la carte, et c’est la ligne de description (« poisson du jour, sauce citron ») qui permet de choisir. Une carte qui dirait seulement « plat n° 3 » mènerait à des commandes au hasard.',
        },
        takeaway: 'Le modèle ne connaît que les outils déclarés, et il choisit d’après leur description.',
        illustration: 'l2-tool-card',
      },
      {
        id: 'function-calling',
        title: 'Choisir l’outil et remplir les paramètres',
        body:
          'Quand le modèle veut agir, il ne répond pas en texte libre : il produit un **appel d’outil** structuré, par exemple `creer_evenement` avec `{"date": "2027-01-12", "titre": "Partiel de réseaux"}`.\n\nLe harnais **valide** cet appel contre le schéma (outil connu, types, formats, champs manquants), l’exécute, puis renvoie le **résultat**, ou un message d’erreur clair, dans le contexte. Certaines API garantissent même un JSON conforme au schéma (mode strict).',
        analogy: {
          title: 'Le formulaire au guichet',
          text: 'Au guichet, on ne raconte pas sa vie : on remplit un formulaire aux cases précises. L’employé refuse un formulaire incomplet et dit quoi corriger, puis rend un récépissé.',
        },
        takeaway: 'Appel d’outil = nom + paramètres structurés ; le harnais valide, exécute et renvoie le résultat.',
        illustration: 'l2-call-flow',
      },
      {
        id: 'tool-design',
        title: 'Bien concevoir ses outils',
        body:
          'La qualité des outils compte autant que celle du modèle :\n\n- des **noms et descriptions précis**, qui disent quand utiliser l’outil… et quand ne pas l’utiliser ;\n- **peu d’outils**, bien distincts, plutôt que dix variantes qui se ressemblent ;\n- des **paramètres contraints** (listes de valeurs, formats) ;\n- des **erreurs explicites**, que le modèle peut comprendre et corriger.\n\nChaque définition et chaque résultat occupent aussi de la place dans la fenêtre de contexte.',
        analogy: {
          title: 'La boîte à outils bien rangée',
          text: 'Une boîte aux compartiments étiquetés, avec un seul tournevis de chaque taille, se prend en main en dix secondes. Un tiroir où s’entassent douze outils presque identiques fait perdre du temps, et finit souvent par le mauvais.',
        },
        takeaway: 'Des outils peu nombreux, bien décrits, aux paramètres stricts et aux erreurs claires.',
        illustration: 'l2-tool-design',
      },
    ],
    minigame: {
      id: 'tool-workshop',
      title: 'L’atelier des appels',
      intro:
        'Trois manches : **choisir** le bon outil, **remplir** correctement ses paramètres, puis **jouer le validateur** du harnais face aux appels de Bob.',
      xp: 60,
    },
    boss: {
      name: 'Le Marteau',
      sprite: 'marteau',
      intro: 'Quand on n’a qu’un marteau, tout ressemble à un clou ! Je tape sur tout avec le premier outil venu. Prouve-moi que choisir, ça s’apprend !',
      victory: 'Bon… peut-être que les vis méritaient un tournevis.',
      defeat: 'BANG ! Tout est un clou ! Reviens quand tu sauras choisir tes outils.',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-definition',
          prompt: 'Qu’envoie le harnais au modèle pour lui présenter un outil ?',
          choices: [
            { id: 'a', text: 'Son nom, une description et le schéma de ses paramètres.', correct: true, feedback: 'Oui : c’est tout ce que le modèle voit de l’outil.' },
            { id: 'b', text: 'Le code source complet de l’outil.', feedback: 'Le modèle ne voit pas le code : seulement la fiche de l’outil.' },
            { id: 'c', text: 'Rien : le modèle devine les outils disponibles.', feedback: 'Deviner, c’est ce qui a fait échouer Bob : un outil non déclaré n’existe pas pour lui.' },
            { id: 'd', text: 'Un tutoriel vidéo.', feedback: 'Le modèle reçoit du texte structuré, pas une vidéo.' },
          ],
          explanation: 'Définition d’outil = nom + description + schéma des paramètres. Le modèle choisit d’après la description.',
        },
        {
          id: 'q-unknown',
          prompt: 'Bob appelle `envoyer_sms`, un outil qui n’existe pas. Que doit faire le harnais ?',
          choices: [
            { id: 'a', text: 'Exécuter l’outil dont le nom ressemble le plus.', feedback: 'Deviner à la place du modèle pourrait déclencher une action non voulue.' },
            {
              id: 'b',
              text: 'Refuser l’appel et renvoyer une erreur claire : « outil inconnu, outils disponibles : … ».',
              correct: true,
              feedback: 'Exact : l’erreur devient une observation qui permet à Bob de corriger.',
            },
            { id: 'c', text: 'Arrêter définitivement l’agent.', feedback: 'Trop radical : une erreur explicite suffit souvent à corriger le tir.' },
            { id: 'd', text: 'Ignorer l’appel sans rien dire.', feedback: 'Bob croirait que l’action a eu lieu : c’est pire.' },
          ],
          explanation: 'Le harnais valide chaque appel et renvoie des erreurs compréhensibles : c’est ce qui rend la boucle robuste.',
        },
        {
          id: 'q-description',
          prompt: 'Pourquoi la description d’un outil est-elle si importante ?',
          choices: [
            { id: 'a', text: 'Elle sert uniquement de documentation pour les humains.', feedback: 'Elle sert surtout au modèle, qui ne voit rien d’autre de l’outil.' },
            { id: 'b', text: 'Elle accélère l’exécution de l’outil.', feedback: 'La description n’a aucun effet sur la vitesse d’exécution.' },
            {
              id: 'c',
              text: 'C’est d’après elle que le modèle décide quand et comment utiliser l’outil.',
              correct: true,
              feedback: 'Oui : une description vague donne des choix au hasard.',
            },
            { id: 'd', text: 'Elle est obligatoire légalement.', feedback: 'Ce n’est pas une question de loi, mais d’efficacité.' },
          ],
          explanation: 'Une bonne description dit à quoi sert l’outil, quand l’utiliser… et quand ne pas l’utiliser.',
        },
        {
          id: 'q-format',
          prompt: 'Le système attend une date au format AAAA-MM-JJ. Comment éviter que Bob envoie « 12/01 » ?',
          choices: [
            {
              id: 'a',
              text: 'Préciser le format dans le schéma et la description, puis valider l’appel.',
              correct: true,
              feedback: 'Oui : un paramètre contraint et validé élimine l’ambiguïté.',
            },
            { id: 'b', text: 'Espérer que le modèle devine le bon format.', feedback: 'Espérer n’est pas une stratégie : il faut contraindre et valider.' },
            { id: 'c', text: 'Accepter n’importe quelle date et corriger plus tard.', feedback: 'Une date mal interprétée crée un événement au mauvais jour.' },
            { id: 'd', text: 'Interdire les dates.', feedback: 'L’outil ne servirait plus à rien !' },
          ],
          explanation: 'Contraindre (le schéma) et valider (le harnais) : le duo qui évite les paramètres ambigus.',
        },
        {
          id: 'q-result',
          prompt: 'Que fait le harnais du résultat d’un outil ?',
          choices: [
            { id: 'a', text: 'Il l’affiche à l’utilisateur et s’arrête.', feedback: 'Le modèle en a besoin pour décider de la suite.' },
            { id: 'b', text: 'Il l’ajoute au contexte du modèle, qui s’en sert pour la suite.', correct: true, feedback: 'Exact : c’est l’étape « observer » de la boucle.' },
            { id: 'c', text: 'Il le jette : l’action a déjà eu lieu.', feedback: 'Sans résultat, Bob ignorerait si l’action a réussi.' },
            { id: 'd', text: 'Il réentraîne le modèle avec.', feedback: 'Aucun réentraînement : le résultat entre seulement dans le contexte.' },
          ],
          explanation: 'Résultat d’outil = observation. Attention : il occupe aussi de la place dans la fenêtre de contexte.',
        },
        {
          id: 'q-too-many',
          prompt: 'Ton harnais propose 25 outils, dont 6 variantes de « chercher ». Quel est le risque ?',
          choices: [
            { id: 'a', text: 'Aucun : plus il y a d’outils, mieux c’est.', feedback: 'Trop d’outils proches embrouillent le choix et remplissent le contexte.' },
            { id: 'b', text: 'Le modèle tapera moins vite.', feedback: 'Le problème n’est pas la vitesse, mais le choix et la place prise dans le contexte.' },
            { id: 'c', text: 'Les outils vont se bloquer entre eux.', feedback: 'Ils ne se bloquent pas : c’est le modèle qui s’y perd.' },
            {
              id: 'd',
              text: 'Le modèle hésite entre des outils similaires, et leurs définitions occupent beaucoup de contexte.',
              correct: true,
              feedback: 'Oui : quelques outils bien distincts, c’est plus fiable.',
            },
          ],
          explanation: 'Mieux vaut quelques outils clairs et distincts qu’une collection de variantes.',
        },
        {
          id: 'q-brain',
          prompt: 'Bob a maintenant une ceinture à outils. Qu’est-ce qui a changé dans son cerveau ?',
          choices: [
            { id: 'a', text: 'Il a appris à programmer chaque outil.', feedback: 'Il n’a rien appris : il lit des fiches et écrit des appels.' },
            { id: 'b', text: 'Rien : le harnais lui décrit des outils et exécute ses appels.', correct: true, feedback: 'Exactement : même cerveau, nouvelle pièce de harnais.' },
            { id: 'c', text: 'Il a grossi pour contenir les outils.', feedback: 'Les outils vivent dans le harnais, pas dans les poids du modèle.' },
            { id: 'd', text: 'Il peut désormais exécuter du code tout seul.', feedback: 'Il écrit des demandes ; c’est le harnais qui exécute.' },
          ],
          explanation: 'Les outils sont une pièce du harnais : le modèle, lui, reste le même.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['tool-call', 'tool-schema', 'tool-result'],
      message:
        'Ma ceinture à outils ! Mon harnais me présente enfin de vrais outils, avec leur mode d’emploi, et vérifie mes appels avant de les exécuter. Mon cerveau ? Toujours le même modèle.',
    },
    tutor: {
      suggestions: ['t2-what', 't2-choose', 't2-schema', 't2-error'],
      entries: [
        {
          id: 't2-what',
          question: 'C’est quoi, le function calling ?',
          keywords: ['function', 'calling', 'appel', 'appels', 'tool', 'tools', 'use', 'outil', 'outils'],
          answer:
            'Le function calling (ou tool use), c’est la capacité d’un modèle à demander l’exécution d’un outil de façon structurée : il choisit un outil parmi ceux que le harnais lui a déclarés et remplit ses paramètres, souvent en JSON. Le harnais valide la demande, exécute l’outil et renvoie le résultat. Comme un bon de commande au guichet : le client remplit, l’employé exécute.',
        },
        {
          id: 't2-choose',
          question: 'Comment le modèle choisit-il le bon outil ?',
          keywords: ['choisir', 'choisit', 'choix', 'quel', 'description', 'descriptions'],
          answer:
            'D’après les définitions que le harnais lui envoie : le nom, la description et les paramètres de chaque outil. Il compare la demande à ces fiches. C’est pour ça que les descriptions doivent dire clairement à quoi sert l’outil, et quand ne pas l’utiliser. Avec des fiches vagues ou des outils qui se ressemblent, le choix devient un pari.',
        },
        {
          id: 't2-schema',
          question: 'À quoi sert le schéma JSON ?',
          keywords: ['schema', 'json', 'parametre', 'parametres', 'format', 'type', 'types', 'obligatoire'],
          answer:
            'Le schéma décrit précisément les paramètres attendus : leur type (texte, nombre), les champs obligatoires, les formats (une date en AAAA-MM-JJ) et les valeurs permises. Il guide le modèle quand il remplit l’appel, et il permet au harnais de vérifier l’appel avant de l’exécuter. Certaines API garantissent même une sortie conforme au schéma (mode strict).',
        },
        {
          id: 't2-error',
          question: 'Que se passe-t-il si un appel est faux ?',
          keywords: ['erreur', 'erreurs', 'faux', 'invalide', 'refuse', 'echec', 'corriger'],
          answer:
            'Le harnais refuse l’appel et renvoie au modèle un message d’erreur clair : outil inconnu, paramètre manquant, mauvais format… Ce message devient une observation dans la boucle, et le modèle corrige son appel au tour suivant. Une erreur muette, ou un « Erreur 500 » sans détail, le laisse au contraire tâtonner.',
        },
        {
          id: 't2-many',
          question: 'Peut-on donner beaucoup d’outils à un agent ?',
          keywords: ['beaucoup', 'nombre', 'trop', 'combien', 'plusieurs', 'limite'],
          answer:
            'Techniquement oui, mais chaque définition occupe de la place dans la fenêtre de contexte, et des outils qui se ressemblent embrouillent le choix. Mieux vaut quelques outils bien distincts. Quand il en faut vraiment beaucoup, les harnais récents chargent les définitions à la demande : on le verra avec les skills, au niveau 6.',
        },
        {
          id: 't2-who',
          question: 'Le modèle exécute-t-il lui-même le code des outils ?',
          keywords: ['execute', 'executer', 'execution', 'code', 'seul', 'lui-meme'],
          answer:
            'Non. Le modèle écrit seulement la demande : le nom de l’outil et ses paramètres. C’est le harnais qui exécute le vrai code ou appelle la vraie API, puis renvoie le résultat. Cette séparation est précieuse : le harnais peut valider, limiter ou refuser une action avant qu’elle n’ait lieu.',
        },
      ],
    },
  },
};
