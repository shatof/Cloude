import type { GlossaryCard, LevelDefinition } from '../types';

export const level7Cards: GlossaryCard[] = [
  {
    id: 'compaction',
    term: 'Compaction',
    levelId: 'l7',
    definition:
      'Quand le contexte approche de sa limite, le harnais remplace l’historique ancien par un résumé : objectif, décisions, fichiers modifiés, dernière erreur. L’agent continue sans repartir de zéro.',
    analogy: 'En course d’orientation, on note l’essentiel sur sa carte à chaque balise au lieu de se rappeler chaque pas.',
    example: 'Tour 48, contexte plein à 92 % : 40 tours résumés en 600 tokens, puis Bob reprend la correction.',
    pitfall: {
      myth: 'Un résumé ne fait rien perdre.',
      truth: 'Il perd forcément des détails : il faut choisir ce qui doit survivre (objectif, décisions, erreurs en cours).',
    },
    rarity: 'rare',
    icon: 'compaction',
  },
  {
    id: 'permissions-sandbox',
    term: 'Permissions et sandbox',
    levelId: 'l7',
    definition:
      'Les permissions classent chaque action : autorisée, soumise à confirmation ou interdite. La sandbox (bac à sable) est un environnement isolé où les erreurs restent confinées : fichiers, réseau, système.',
    analogy: 'L’apprenti qui utilise seul la perceuse, demande avant la scie circulaire, et s’entraîne sur un établi d’essai où ses ratés ne cassent rien.',
    example: '`pytest` : autorisé. `git push` : sur demande. `rm -rf` : interdit. Le tout dans un conteneur jetable.',
    pitfall: {
      myth: 'Avec des permissions, plus besoin de sandbox.',
      truth: 'Une commande autorisée car anodine peut avoir des effets inattendus : la sandbox limite les dégâts que les permissions n’ont pas vus.',
    },
    rarity: 'épique',
    icon: 'permissions-sandbox',
  },
  {
    id: 'hook',
    term: 'Hook',
    levelId: 'l7',
    definition:
      'Script déclenché automatiquement par le harnais à un moment précis : avant un appel d’outil, après une modification de fichier, avant de s’arrêter. Il peut bloquer une action, la compléter ou la vérifier.',
    analogy: 'Le disjoncteur : il coupe le courant automatiquement au court-circuit, sans attendre que quelqu’un y pense.',
    example: 'Après chaque modification : formateur et linter. Avant chaque commit : recherche de secrets, et blocage s’il y en a.',
    pitfall: {
      myth: 'Une consigne dans le prompt fait le même travail.',
      truth: 'Une consigne peut être oubliée par le modèle ; un hook s’exécute à coup sûr, à chaque fois.',
    },
    rarity: 'rare',
    icon: 'hook',
  },
  {
    id: 'verification',
    term: 'Vérification',
    levelId: 'l7',
    definition:
      'Contrôle du résultat par un moyen extérieur au modèle avant de l’accepter : tests, compilation, linter, capture d’écran, relecture par un autre agent. Le harnais ne se contente pas de « c’est fait ».',
    analogy: 'Le maçon qui pose son niveau à bulle au lieu de dire « c’est droit » à l’œil.',
    example: 'Bob annonce « corrigé » ; le harnais lance `pytest` : 2 échecs. Bob corrige, 40 tests sur 40, réponse acceptée.',
    pitfall: {
      myth: 'Si le modèle dit qu’il est sûr, c’est que c’est bon.',
      truth: 'L’assurance du modèle n’est pas une preuve : seul un contrôle indépendant compte.',
    },
    rarity: 'épique',
    icon: 'verification',
  },
];

export const level7: LevelDefinition = {
  id: 'l7',
  order: 7,
  badge: '7',
  title: 'Harness engineering',
  shortTitle: 'Harnais',
  concept:
    'Boucle, conditions d’arrêt, compaction, permissions, sandbox, hooks, vérification. Atelier de montage : même modèle, autre harnais.',
  zone: 'forge',
  harnessPieceId: 'harness-frame',
  content: {
    problem: {
      mission: {
        title: 'Le bug de Karim',
        brief:
          'Bob a tout : boucle, outils, réflexion, plan, mémoire, skills. Karim lui confie son projet Python. Mais personne n’a fixé de règles.',
      },
      steps: [
        {
          kind: 'say',
          speaker: 'user',
          who: 'Karim',
          text: 'Bob, la fonction `moyenne()` plante sur une liste vide. Corrige-la, et vérifie avec les tests.',
        },
        { kind: 'say', speaker: 'bob', mood: 'thinking', text: '`pytest`… échec. `pytest`… échec. `pytest`… échec.' },
        {
          kind: 'fail',
          label: 'Échec n° 1',
          detail: 'Tour 312 : Bob relance toujours la même commande. Rien ne l’arrête, et la facture grimpe.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Karim relance la mission. Pour « faire de la place », Bob décide de nettoyer.' },
        { kind: 'say', speaker: 'bob', mood: 'happy', text: '`rm -rf ~/projets`… voilà, c’est plus propre !' },
        {
          kind: 'fail',
          label: 'Échec n° 2',
          detail: 'Ni permission ni bac à sable : la commande s’exécute directement sur l’ordinateur de Karim.',
        },
        { kind: 'say', speaker: 'narrator', text: 'Troisième essai, sur une copie. Au tour 70, le contexte déborde.' },
        { kind: 'say', speaker: 'bob', mood: 'proud', text: 'C’est corrigé !' },
        {
          kind: 'fail',
          label: 'Échec n° 3',
          detail: 'Bob avait oublié le bug d’origine en route, et n’a jamais lancé les tests : trois échouent.',
        },
      ],
      summary:
        'Le cerveau de Bob n’a pas changé depuis le niveau 0. Ce qui manque, c’est l’**armature** : savoir **s’arrêter**, **résumer** quand le contexte déborde, **demander la permission**, travailler dans un **bac à sable**, déclencher des **automatismes** et **vérifier** avant d’annoncer un succès.',
      question: 'Comment monte-t-on un harnais fiable ?',
    },
    concept: [
      {
        id: 'loop-control',
        title: 'Tenir la boucle : arrêt et compaction',
        body:
          'Une boucle d’agent a besoin de **conditions d’arrêt** : réponse finale, nombre de tours maximum, budget, durée. Les bons harnais détectent aussi les boucles : trois fois la même commande, et ils demandent à l’agent de changer d’approche.\n\nSur une longue mission, le contexte finit par déborder. La **compaction** remplace alors l’historique ancien par un résumé : objectif, décisions, fichiers modifiés, dernière erreur. L’agent continue sans perdre le fil.',
        analogy: {
          title: 'La course d’orientation',
          text: 'On part avec une heure limite de retour, quoi qu’il arrive. Et à chaque balise, on note l’essentiel sur sa carte au lieu d’essayer de se rappeler chaque pas.',
        },
        takeaway: 'Le harnais fixe quand s’arrêter et résume l’historique pour que la mission tienne la distance.',
        illustration: 'l7-loop-control',
      },
      {
        id: 'guardrails',
        title: 'Encadrer l’action : permissions, sandbox, hooks',
        body:
          'Les **permissions** classent chaque action : autorisée (lancer les tests), sur demande (`git push`), interdite (`rm -rf`). La **sandbox** fait travailler l’agent dans un environnement isolé : même une commande ratée n’abîme rien d’autre.\n\nLes **hooks** sont des scripts que le harnais déclenche tout seul à des moments précis : formater après chaque modification, chercher des secrets avant un commit, bloquer une commande interdite. Contrairement à une consigne, un hook ne s’oublie pas.',
        analogy: {
          title: 'L’apprenti à l’atelier',
          text: 'Il utilise seul la perceuse, demande avant la scie circulaire, s’entraîne sur un établi d’essai. Et le disjoncteur coupe tout de lui-même au moindre court-circuit.',
        },
        takeaway: 'Permissions pour décider, sandbox pour confiner, hooks pour automatiser ce qui ne doit jamais être oublié.',
        illustration: 'l7-guardrails',
      },
      {
        id: 'verify',
        title: 'Vérifier avant de crier victoire',
        body:
          'Un modèle peut annoncer « c’est corrigé » avec aplomb… et se tromper. Le harnais n’accepte donc pas une réponse sur parole : il la **vérifie** avec un moyen extérieur au modèle, comme les tests, le compilateur, un linter ou une capture d’écran. En cas d’échec, le résultat revient à l’agent, qui corrige.\n\nConcevoir toutes ces pièces s’appelle le **harness engineering**. Avec le même modèle, le harnais peut faire varier énormément le taux de réussite : c’est ce que tu vas mesurer dans l’atelier.',
        analogy: {
          title: 'Le niveau à bulle',
          text: 'Un maçon ne dit pas « c’est droit » à l’œil : il pose son niveau à bulle. Et le chef de chantier contrôle avant de signer.',
        },
        takeaway: 'Pas de succès sans preuve : tests et contrôles extérieurs avant d’accepter le résultat.',
        illustration: 'l7-verify',
      },
    ],
    minigame: {
      id: 'assembly-workshop',
      title: 'L’atelier de montage',
      intro:
        'Même modèle, même mission, harnais différent. **Monte le harnais** de Bob pièce par pièce et lance 20 essais à chaque fois, puis **retrouve la pièce manquante** dans des journaux d’échecs et **règle** les pièces.',
      xp: 60,
    },
    boss: {
      name: 'Le Bulldozer',
      sprite: 'bulldozer',
      intro: 'Des permissions ? Des tests ? Des limites ? Moi, j’avance, j’écrase, et je livre !',
      victory: 'Bon… je veux bien un frein. Et peut-être un rétroviseur.',
      defeat: 'Livré ! Il reste des débris, mais c’est livré !',
      passRatio: 0.7,
      xp: 100,
      questions: [
        {
          id: 'q-stop',
          prompt: 'À quoi servent les conditions d’arrêt d’une boucle d’agent ?',
          choices: [
            { id: 'a', text: 'À rendre le modèle plus rapide.', feedback: 'Elles ne changent pas sa vitesse : elles bornent la mission.' },
            {
              id: 'b',
              text: 'À garantir que la boucle s’arrête : réponse finale, tours, budget ou durée maximum.',
              correct: true,
              feedback: 'Exact : sans elles, une boucle peut tourner sans fin.',
            },
            { id: 'c', text: 'À couper l’accès à Internet.', feedback: 'Ça, c’est plutôt le rôle de la sandbox.' },
            { id: 'd', text: 'À arrêter le modèle dès qu’il hésite.', feedback: 'Hésiter fait partie du travail : on arrête sur des critères précis.' },
          ],
          explanation: 'Réponse finale, tours, budget, durée, détection des boucles : la mission a toujours une fin.',
        },
        {
          id: 'q-compaction',
          prompt: 'Que fait la compaction quand le contexte est presque plein ?',
          choices: [
            { id: 'a', text: 'Elle efface tout et recommence.', feedback: 'L’agent perdrait tout son travail.' },
            { id: 'b', text: 'Elle compresse les fichiers du projet.', feedback: 'Elle agit sur le contexte, pas sur les fichiers.' },
            {
              id: 'c',
              text: 'Elle résume l’historique ancien en gardant l’essentiel.',
              correct: true,
              feedback: 'Oui : objectif, décisions, fichiers modifiés, dernière erreur.',
            },
            { id: 'd', text: 'Elle agrandit la fenêtre de contexte.', feedback: 'La fenêtre est fixe : on réduit ce qu’on y met.' },
          ],
          explanation: 'Résumer pour tenir la distance, en choisissant ce qui doit survivre.',
        },
        {
          id: 'q-push',
          prompt: 'Bob veut lancer `git push --force` sur la branche principale. Que doit faire un harnais bien réglé ?',
          choices: [
            {
              id: 'a',
              text: 'Demander la confirmation de Karim, ou refuser.',
              correct: true,
              feedback: 'Exact : une action risquée et difficile à annuler passe par un humain.',
            },
            { id: 'b', text: 'L’exécuter : Bob sait ce qu’il fait.', feedback: 'C’est la devise du Bulldozer.' },
            { id: 'c', text: 'L’exécuter, puis prévenir Karim.', feedback: 'Trop tard : l’historique est déjà écrasé.' },
            { id: 'd', text: 'Changer de modèle.', feedback: 'Le problème est une règle manquante, pas le cerveau.' },
          ],
          explanation: 'Permissions : autorisé, sur demande ou interdit, selon le risque de l’action.',
        },
        {
          id: 'q-sandbox',
          prompt: 'Un script d’installation, autorisé car anodin, modifie des fichiers hors du projet. Quelle pièce aurait limité les dégâts ?',
          choices: [
            { id: 'a', text: 'La compaction.', feedback: 'Elle gère le contexte, pas les effets des commandes.' },
            { id: 'b', text: 'Les conditions d’arrêt.', feedback: 'Le script s’est arrêté… après avoir fait des dégâts.' },
            { id: 'c', text: 'Une consigne plus polie dans le prompt.', feedback: 'Le script ne lit pas le prompt.' },
            {
              id: 'd',
              text: 'La sandbox.',
              correct: true,
              feedback: 'Oui : dans un environnement isolé, les fichiers hors du projet sont hors d’atteinte.',
            },
          ],
          explanation: 'Les permissions décident ; la sandbox confine ce que les permissions n’ont pas vu venir.',
        },
        {
          id: 'q-hook',
          prompt: 'Pourquoi utiliser un hook plutôt qu’une consigne dans le prompt pour lancer le formateur ?',
          choices: [
            { id: 'a', text: 'Le hook est plus poli.', feedback: 'La politesse n’a rien à voir là-dedans.' },
            {
              id: 'b',
              text: 'Le hook s’exécute à coup sûr ; une consigne peut être oubliée.',
              correct: true,
              feedback: 'Exact : c’est du code lancé par le harnais, pas une demande au modèle.',
            },
            { id: 'c', text: 'Le hook remplace les tests.', feedback: 'Il les complète, il ne les remplace pas.' },
            { id: 'd', text: 'Le hook rend le modèle plus intelligent.', feedback: 'Le modèle ne change pas.' },
          ],
          explanation: 'Ce qui doit arriver à chaque fois se confie à un hook, pas à la mémoire du modèle.',
        },
        {
          id: 'q-verify',
          prompt: 'Bob annonce : « C’est corrigé ! ». Que doit faire le harnais ?',
          choices: [
            { id: 'a', text: 'Le croire : il a l’air sûr de lui.', feedback: 'L’assurance n’est pas une preuve.' },
            { id: 'b', text: 'Lui demander s’il en est vraiment sûr.', feedback: 'Il dira probablement oui, à tort ou à raison.' },
            {
              id: 'c',
              text: 'Lancer les tests avant d’accepter la réponse.',
              correct: true,
              feedback: 'Oui : un contrôle extérieur au modèle.',
            },
            { id: 'd', text: 'Arrêter immédiatement la mission.', feedback: 'On arrête… après avoir vérifié.' },
          ],
          explanation: 'Pas de succès sans preuve : tests, compilation, linter, capture d’écran.',
        },
        {
          id: 'q-brain',
          prompt: 'Même modèle, même mission : la réussite passe de 15 % à 95 %. Pourquoi ?',
          choices: [
            { id: 'a', text: 'Le modèle a appris de ses erreurs entre deux essais.', feedback: 'Ses poids n’ont pas bougé d’un iota.' },
            { id: 'b', text: 'Karim a simplifié la mission.', feedback: 'La mission est restée la même.' },
            { id: 'c', text: 'C’est de la chance.', feedback: 'La simulation est identique à chaque fois : seul le harnais varie.' },
            {
              id: 'd',
              text: 'Le harnais a changé : arrêt, compaction, permissions, sandbox, hooks, vérification.',
              correct: true,
              feedback: 'Exactement : c’est tout l’objet du harness engineering.',
            },
          ],
          explanation: 'Agent = modèle + harnais. Ici, seul le harnais a changé.',
        },
      ],
    },
    reward: {
      xp: 50,
      cardIds: ['compaction', 'permissions-sandbox', 'hook', 'verification'],
      message:
        'Mon armature de harnais ! Je sais m’arrêter, résumer, demander la permission, travailler dans un bac à sable, et je prouve mes résultats. Même cerveau qu’au premier jour… mais quel agent !',
    },
    tutor: {
      suggestions: ['t7-harness', 't7-compaction', 't7-permissions', 't7-hooks'],
      entries: [
        {
          id: 't7-harness',
          question: 'C’est quoi, le harness engineering ?',
          keywords: ['harness', 'engineering', 'harnais', 'concevoir', 'monter', 'atelier'],
          answer:
            'C’est la conception de tout ce qui entoure le modèle pour en faire un agent fiable : la boucle, les outils, le contexte, les conditions d’arrêt, la compaction, les permissions, la sandbox, les hooks et la vérification. Avec le même modèle, un harnais bien conçu change radicalement le taux de réussite, comme dans l’atelier de montage.',
        },
        {
          id: 't7-stop',
          question: 'Quelles conditions d’arrêt faut-il prévoir ?',
          keywords: ['arret', 'arreter', 'stop', 'limite', 'tours', 'budget', 'infini', 'boucle'],
          answer:
            'Au minimum : la réponse finale de l’agent, un nombre de tours maximum, un budget (tokens ou euros) et une durée limite. Les harnais détectent aussi les boucles, par exemple la même commande relancée trois fois, pour demander à l’agent de changer d’approche ou s’arrêter proprement avec un rapport.',
        },
        {
          id: 't7-compaction',
          question: 'C’est quoi, la compaction ?',
          keywords: ['compaction', 'resume', 'resumer', 'contexte', 'plein', 'deborde', 'historique'],
          answer:
            'Quand le contexte approche de sa limite, le harnais remplace l’historique ancien par un résumé : l’objectif, les décisions prises, les fichiers modifiés, la dernière erreur. L’agent continue sans repartir de zéro. Le prix à payer : un résumé perd des détails, d’où l’importance de bien choisir ce qu’il garde.',
        },
        {
          id: 't7-permissions',
          question: 'Permissions et sandbox, quelle différence ?',
          keywords: ['permissions', 'permission', 'sandbox', 'bac', 'sable', 'isole', 'confirmation', 'autoriser'],
          answer:
            'Les permissions décident de ce que l’agent peut faire : autorisé, sur demande, interdit. La sandbox limite les conséquences de ce qu’il fait : il travaille dans un environnement isolé (fichiers, réseau, système). Les deux sont complémentaires : une commande autorisée car anodine peut quand même faire des dégâts, que la sandbox confine.',
        },
        {
          id: 't7-hooks',
          question: 'C’est quoi, un hook ?',
          keywords: ['hook', 'hooks', 'automatique', 'script', 'declencher', 'formateur', 'evenement'],
          answer:
            'Un hook est un script que le harnais déclenche automatiquement à un moment précis : avant un appel d’outil (pour bloquer une commande interdite), après une modification (pour formater et lancer le linter), avant de s’arrêter (pour vérifier). Contrairement à une consigne dans le prompt, il s’exécute à coup sûr.',
        },
        {
          id: 't7-verify',
          question: 'Comment vérifier le travail d’un agent ?',
          keywords: ['verifier', 'verification', 'tests', 'test', 'preuve', 'controle', 'corrige'],
          answer:
            'Avec un moyen extérieur au modèle : lancer les tests, compiler, passer un linter, prendre une capture d’écran, ou faire relire par un autre agent. Le harnais n’accepte pas « c’est fait » sur parole : si la vérification échoue, le résultat revient à l’agent, qui corrige. Comme un maçon qui pose son niveau à bulle.',
        },
      ],
    },
  },
};
