import type { ChoiceQuestion, MiniGameConfig } from '../kit/types';

/** Options « Étape 1 », « Étape 2 »… dans l'ordre, avec une explication pour chacune. */
function steps(correct: number, feedbacks: string[]): ChoiceQuestion['options'] {
  return feedbacks.map((feedback, i) => ({
    id: `s${i + 1}`,
    text: `Étape ${i + 1}`,
    correct: i + 1 === correct,
    feedback,
  }));
}

export const scratchpadConfig: MiniGameConfig = {
  title: 'Le carnet de brouillon',
  rounds: [
    {
      kind: 'order',
      title: 'La trace ReAct',
      instructions:
        'Inès demande : « La BU est-elle ouverte samedi, et le livre *Réseaux* y est-il disponible ? » Clique les étapes de Bob **dans l’ordre** : pensée, action, observation… jusqu’à la réponse.',
      items: [
        { id: 'p1', text: 'Pensée : « Il me faut d’abord les horaires de la BU samedi. »' },
        { id: 'a1', text: 'Action : `horaires_bu(jour="samedi")`' },
        { id: 'o1', text: 'Observation : « Ouverte de 10 h à 18 h. »' },
        { id: 'p2', text: 'Pensée : « Reste à savoir si le livre est en rayon. »' },
        { id: 'a2', text: 'Action : `chercher_livre(titre="Réseaux")`' },
        { id: 'o2', text: 'Observation : « 1 exemplaire disponible, cote 004.6 TAN. »' },
        { id: 'r', text: 'Réponse : « Oui, de 10 h à 18 h, et le livre est en rayon (cote 004.6 TAN). »' },
      ],
      explanation:
        'Chaque action est **précédée d’une pensée** qui dit pourquoi on la fait, et **suivie d’une observation** qui nourrit la pensée suivante. La réponse arrive quand plus rien ne manque.',
    },
    {
      kind: 'choice',
      title: 'L’étape fautive',
      instructions:
        'Un brouillon écrit a un gros avantage : on peut le **relire**. Pour chaque raisonnement ou trace, trouve la première étape fausse.',
      questions: [
        {
          id: 'f-gomme',
          context: 'Un stylo et une gomme coûtent 2,20 € en tout. Le stylo coûte 2 € de plus que la gomme. Prix de la gomme ?',
          code: `1. Soit g le prix de la gomme.
2. Le stylo coûte g + 2.
3. g + (g + 2) = 2,20, donc 2g = 0,20.
4. Donc g = 0,20 €.`,
          prompt: 'Quelle étape est fausse ?',
          ordered: true,
          options: steps(4, [
            'Poser une inconnue est un très bon début.',
            'C’est exactement l’énoncé : 2 € de plus que la gomme.',
            'Le calcul est juste : 2,20 - 2 = 0,20.',
            'Si 2g = 0,20, alors g = 0,10 € : Bob a oublié de diviser par 2.',
          ]),
          explanation: 'Avec les étapes sous les yeux, l’erreur se repère et se corrige : la gomme coûte 0,10 €.',
        },
        {
          id: 'f-tp',
          context: 'Le TP commence à 13 h 45 et dure 2 h 30. À quelle heure finit-il ?',
          code: `1. 13 h 45 + 2 h = 15 h 45.
2. 15 h 45 + 30 min = 16 h 25.
3. Le TP finit à 16 h 25.`,
          prompt: 'Quelle étape est fausse ?',
          ordered: true,
          options: steps(2, [
            'Ajouter d’abord les heures entières : c’est juste.',
            '45 + 30 = 75 minutes, soit 1 h 15 : on arrive à 16 h 15, pas 16 h 25.',
            'Cette conclusion découle de l’étape 2 : c’est l’étape 2 qu’il faut corriger.',
          ]),
          explanation: 'Une erreur au milieu se propage jusqu’à la fin : on cherche la première étape fausse.',
        },
        {
          id: 'f-salle',
          context: 'Inès : « Réserve la C204 jeudi à 14 h si elle est libre. »',
          code: `1. Pensée : « Je dois vérifier si la C204 est libre. »
2. Action : reserver_salle(salle="C204", jour="jeudi")
3. Observation : « Réservation créée. »
4. Pensée : « C’est fait. »`,
          prompt: 'Quelle étape est fausse ?',
          ordered: true,
          options: steps(2, [
            'La pensée est bonne : il faut vérifier la disponibilité.',
            'L’action ne suit pas la pensée : il fallait consulter le planning avant de réserver.',
            'L’observation rapporte fidèlement ce qui s’est passé.',
            'C’est une conséquence de l’erreur précédente, pas sa cause.',
          ]),
          explanation: 'Dans ReAct, l’action doit découler de la pensée : ici, Bob a sauté la vérification.',
        },
        {
          id: 'f-erreur',
          context: 'Même demande, autre trace :',
          code: `1. Action : consulter_planning(jour="jeudi", heure="14:00")
2. Observation : « Erreur : C204 déjà réservée. »
3. Pensée : « Parfait, la C204 est à nous. »
4. Réponse : « C204 réservée ! »`,
          prompt: 'Quelle étape est fausse ?',
          ordered: true,
          options: steps(3, [
            'Consulter le planning d’abord : c’est le bon réflexe.',
            'L’observation est ce que renvoie l’outil : elle n’est pas fausse.',
            'La pensée ignore l’observation : la salle est déjà prise !',
            'La réponse est fausse, mais à cause de l’étape 3.',
          ]),
          explanation: 'Une pensée doit tenir compte de la dernière observation : c’est tout l’intérêt de la boucle.',
        },
        {
          id: 'f-badge',
          code: `1. Tous les étudiants de L3 ont un badge.
2. Karim a un badge.
3. Donc Karim est en L3.`,
          prompt: 'Quelle étape est fausse ?',
          ordered: true,
          options: steps(3, [
            'C’est une donnée de départ : on l’accepte telle quelle.',
            'C’est aussi une donnée de départ.',
            'Le raisonnement ne tient pas : les L1 et les M2 peuvent aussi avoir un badge.',
          ]),
          explanation: 'Des prémisses vraies ne suffisent pas : chaque passage d’une étape à l’autre doit être valide.',
        },
      ],
    },
    {
      kind: 'sort',
      title: 'Dose l’effort',
      instructions:
        'Le harnais règle l’**effort de réflexion** de Bob avant chaque tâche. Pour chacune, choisis : réponse rapide, ou réflexion longue ?',
      bins: [
        { id: 'low', label: 'Effort faible' },
        { id: 'high', label: 'Effort élevé' },
      ],
      items: [
        { id: 'e-bonjour', text: 'Traduire « bonjour » en espagnol.', bin: 'low', why: 'Réponse immédiate : réfléchir plus ne la rendrait pas meilleure.' },
        { id: 'e-flaky', text: 'Trouver pourquoi un test échoue une fois sur dix.', bin: 'high', why: 'Il faut formuler des hypothèses et les éliminer une à une.' },
        { id: 'e-spam', text: 'Dire si un mail est une pub ou non.', bin: 'low', why: 'Une classification simple : effort minimal.' },
        { id: 'e-edt', text: 'Construire un emploi du temps qui respecte 12 contraintes.', bin: 'high', why: 'Beaucoup de contraintes à combiner : la réflexion paie.' },
        { id: 'e-demain', text: 'Dire quel jour on sera demain si on est lundi.', bin: 'low', why: 'Trivial : une longue réflexion ne ferait que coûter.' },
        { id: 'e-preuve', text: 'Démontrer qu’un algorithme termine toujours.', bin: 'high', why: 'Une preuve demande des étapes rigoureuses.' },
        { id: 'e-poli', text: 'Reformuler une phrase de façon plus polie.', bin: 'low', why: 'Tâche de style courte : pas besoin de longues étapes.' },
        { id: 'e-sql', text: 'Accélérer une requête SQL lente qui joint 5 tables.', bin: 'high', why: 'Il faut analyser le plan d’exécution et comparer des options.' },
      ],
    },
  ],
};
