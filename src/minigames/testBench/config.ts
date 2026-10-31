import type { MiniGameConfig } from '../kit/types';

export const testBenchConfig: MiniGameConfig = {
  title: 'Le banc d’essai',
  rounds: [
    {
      kind: 'order',
      title: 'La reprise',
      instructions:
        'Nouvelle session sur l’appli de révision, déjà avancée. Clique les étapes que Bob doit suivre **dans l’ordre**, pour reprendre sans rien casser.',
      items: [
        { id: 'read', text: 'Lire les notes de progression et l’historique des commits.' },
        { id: 'test', text: 'Lancer les tests : ce qui marchait marche-t-il toujours ?' },
        { id: 'pick', text: 'Choisir la prochaine fonctionnalité de la liste.' },
        { id: 'build', text: 'La développer, puis la tester.' },
        { id: 'save', text: 'Committer et mettre à jour les notes de progression.' },
      ],
      explanation:
        'On **relit** avant d’agir, on **vérifie** l’existant avant d’ajouter, et on **laisse des traces** en partant : la prochaine session reprendra du dernier camp.',
    },
    {
      kind: 'choice',
      title: 'Lire les résultats',
      instructions: 'Inès fait évaluer plusieurs versions de Bob. Aide-la à ne pas se faire piéger par les chiffres.',
      questions: [
        {
          id: 'e-sample',
          code: `Version A : 1 tâche réussie sur 1
Version B : 41 tâches réussies sur 50`,
          prompt: 'Quelle version a vraiment fait ses preuves ?',
          options: [
            { id: 'b', text: 'La version B', correct: true, feedback: '82 % sur 50 tâches, c’est une mesure. Une seule tâche, c’est une anecdote.' },
            { id: 'a', text: 'La version A : 100 % !', feedback: '100 % d’une seule tâche ne dit presque rien.' },
            { id: 'same', text: 'Les deux se valent', feedback: 'L’une est mesurée, l’autre non.' },
            { id: 'none', text: 'Aucune : il faut 10 000 tâches', feedback: '50 tâches donnent déjà une bonne indication.' },
          ],
        },
        {
          id: 'e-reliability',
          code: `Tâche « rembourser un client » : 4 essais
essai 1 : échec   essai 2 : réussite
essai 3 : échec   essai 4 : échec`,
          prompt: 'Pour un vrai service client, cet agent est-il prêt ?',
          options: [
            { id: 'no', text: 'Non : il réussit au moins une fois, mais pas à chaque fois', correct: true, feedback: 'Un client tombe sur un essai au hasard : 1 sur 4, c’est 3 clients mécontents sur 4.' },
            { id: 'yes', text: 'Oui : il sait le faire, puisqu’il a réussi une fois', feedback: '« Peut réussir » n’est pas « réussit à chaque fois ».' },
            { id: 'best', text: 'Oui, si on ne garde que son meilleur essai', feedback: 'En production, on ne choisit pas l’essai : le client subit celui qui tombe.' },
            { id: 'more', text: 'On ne peut rien dire sans 1 000 essais', feedback: 'Trois échecs sur quatre suffisent à voir le problème.' },
          ],
          explanation: 'Mesurer la réussite possible ne suffit pas : on mesure aussi la fiabilité, essai après essai.',
        },
        {
          id: 'e-contamination',
          prompt: 'Un modèle obtient un score parfait sur un vieux benchmark public, mais rate des tâches similaires toutes neuves. Hypothèse la plus probable ?',
          options: [
            { id: 'contam', text: 'Contamination : les questions étaient dans ses données d’entraînement', correct: true, feedback: 'Il a « vu le sujet » avant l’examen.' },
            { id: 'luck', text: 'Les nouvelles tâches sont maudites', feedback: 'Ce n’est pas une explication.' },
            { id: 'broken', text: 'Le modèle est cassé', feedback: 'Il fonctionne : c’est le score qui surestimait sa compétence.' },
            { id: 'normal', text: 'C’est normal, les benchmarks sont toujours fiables', feedback: 'Justement, pas quand ils fuitent.' },
          ],
          explanation: 'Contre la contamination : des tâches récentes, privées ou renouvelées, et ses propres tests.',
        },
        {
          id: 'e-position',
          prompt: 'Le juge donne presque toujours la meilleure note à la réponse présentée en premier. Que faire ?',
          options: [
            { id: 'swap', text: 'Présenter les réponses dans les deux ordres et ne garder que les verdicts stables', correct: true, feedback: 'On neutralise le biais de position, puis on calibre le juge sur des notes humaines.' },
            { id: 'first', text: 'Mettre toujours sa réponse préférée en premier', feedback: 'C’est exploiter le biais, pas le corriger.' },
            { id: 'ignore', text: 'Ignorer le problème', feedback: 'Les notes seraient faussées.' },
            { id: 'longer', text: 'Demander des réponses plus longues', feedback: 'Ça ajouterait un autre biais, celui de la longueur.' },
          ],
        },
        {
          id: 'e-grader',
          prompt: 'Pour vérifier qu’un bug est bien corrigé, quel correcteur choisir ?',
          options: [
            { id: 'tests', text: 'Des tests automatiques qui reproduisent le bug', correct: true, feedback: 'Objectif, reproductible, et peu coûteux.' },
            { id: 'judge', text: 'Un modèle juge qui lit le code', feedback: 'Utile en complément, mais un test est plus fiable ici.' },
            { id: 'self', text: 'Demander à l’agent s’il a réussi', feedback: 'Il dira oui… même quand c’est faux.' },
            { id: 'lines', text: 'Compter les lignes modifiées', feedback: 'Plus de lignes ne veut pas dire mieux corrigé.' },
          ],
          explanation: 'Quand un test automatique est possible, on le préfère à un juge.',
        },
      ],
    },
    {
      kind: 'sort',
      title: 'Moteur ou banc ?',
      instructions: 'Range chaque élément : fait-il partie de l’**agent harness** (faire travailler Bob) ou de l’**eval harness** (le mesurer) ?',
      bins: [
        { id: 'agent', label: 'Agent harness' },
        { id: 'eval', label: 'Eval harness' },
      ],
      items: [
        { id: 'h-loop', text: 'La boucle penser, agir, observer.', bin: 'agent', why: 'C’est le cœur du travail de l’agent.' },
        { id: 'h-tasks', text: 'Les 200 tâches de test et leurs environnements propres.', bin: 'eval', why: 'Le jeu d’épreuves du banc d’essai.' },
        { id: 'h-perm', text: 'Les permissions et la sandbox dans lesquelles Bob travaille.', bin: 'agent', why: 'Elles encadrent le travail de l’agent.' },
        { id: 'h-graders', text: 'Les correcteurs : tests, vérification de l’état final, juge.', bin: 'eval', why: 'Ils notent chaque essai.' },
        { id: 'h-compact', text: 'La compaction du contexte.', bin: 'agent', why: 'Elle aide l’agent à tenir la distance.' },
        { id: 'h-rate', text: 'Le calcul du taux de réussite sur 4 essais par tâche.', bin: 'eval', why: 'C’est la mesure elle-même.' },
        { id: 'h-tools', text: 'Les outils de Bob : lire, écrire, lancer les tests.', bin: 'agent', why: 'Ses moyens d’action.' },
        { id: 'h-compare', text: 'La comparaison de deux versions de Bob sur les mêmes tâches.', bin: 'eval', why: 'Comparer à conditions égales, c’est le rôle du banc.' },
      ],
    },
  ],
};
