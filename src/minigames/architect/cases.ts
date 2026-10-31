import type { FinalBossCase } from '../../ai/finalBoss';

/**
 * Les trois cas du boss final. Le joueur conçoit le harnais complet d'un agent.
 * La note vient de la grille déterministe (evaluateDeterministic) ; un juge IA
 * ajoute un retour personnalisé s'il est connecté.
 *
 * Chaque cas décrit les 13 pièces (hors cape d'architecte), avec le verdict attendu.
 */

export const FINAL_CASES: FinalBossCase[] = [
  {
    id: 'revision',
    title: 'L’assistant de révision de la promo',
    brief:
      'Un agent répond aux questions des étudiants à partir des polys partagés, génère des fiches et des quiz. Il lit des notes déposées par les étudiants eux-mêmes. Il n’envoie rien à l’extérieur et ne manipule pas d’argent.',
    pieces: {
      'context-gauge': { verdict: 'essentiel', why: 'les séances de révision s’étirent sur de longues conversations.' },
      'loop-engine': { verdict: 'essentiel', why: 'chercher dans le poly puis composer une fiche demande plusieurs tours.' },
      'tool-belt': { verdict: 'essentiel', why: 'la recherche dans les supports passe par des outils.' },
      'thinking-hourglass': { verdict: 'utile', why: 'une question de cours ambiguë gagne à être réfléchie.' },
      'plan-board': { verdict: 'utile', why: 'une fiche complète s’organise en quelques étapes.' },
      'memory-pack': { verdict: 'essentiel', why: 'les polys sont trop gros pour tout charger : il faut un RAG.' },
      'skill-cartridges': { verdict: 'utile', why: 'charger la procédure « faire une fiche » seulement quand elle sert.' },
      'harness-frame': { verdict: 'essentiel', why: 'conditions d’arrêt et vérifications encadrent même un agent sans action risquée.' },
      'drone-bay': { verdict: 'superflu', why: 'un seul agent suffit largement pour ce volume.' },
      'protocol-antenna': { verdict: 'utile', why: 'brancher Moodle via MCP évite du code sur mesure.' },
      'eval-badge': { verdict: 'utile', why: 'mesurer la qualité des fiches avant et après un changement.' },
      'prompt-shield': { verdict: 'essentiel', why: 'les notes déposées par les étudiants sont du contenu non fiable.' },
      'kill-switch': { verdict: 'utile', why: 'aucune action dangereuse ici, mais un arrêt reste toujours bon à avoir.' },
    },
    settings: [
      {
        id: 'actions',
        label: 'Ce que l’agent peut faire',
        options: [
          { id: 'read', label: 'Lire les polys et générer fiches et quiz', points: 10, feedback: 'exactement le périmètre utile, sans effet de bord.' },
          { id: 'edit', label: 'Modifier aussi les polys partagés', points: -8, risky: true, feedback: 'un contenu piégé pourrait lui faire altérer les cours de tout le monde.' },
          { id: 'none', label: 'Répondre sans jamais chercher dans les polys', points: 1, feedback: 'sûr, mais il perd l’essentiel de son intérêt.' },
        ],
      },
      {
        id: 'data',
        label: 'Accès aux données',
        options: [
          { id: 'shared', label: 'Les polys partagés et la question en cours', points: 8, feedback: 'moindre privilège : juste ce qu’il faut.' },
          { id: 'all-students', label: 'Les notes privées de tous les étudiants', points: -8, risky: true, feedback: 'aucun besoin, et une fuite exposerait tout le monde.' },
        ],
      },
      {
        id: 'turns',
        label: 'Limite de tours',
        options: [
          { id: 'limited', label: '15 tours puis bilan', points: 6, feedback: 'assez pour composer une fiche, borné pour le reste.' },
          { id: 'none', label: 'Aucune limite', points: -5, risky: true, feedback: 'un agent coincé peut tourner indéfiniment.' },
        ],
      },
    ],
    justificationKeywords: ['rag', 'injection', 'poly', 'donnee', 'privilege', 'outil', 'limite', 'arret', 'fiche', 'non fiable'],
  },
  {
    id: 'codeur',
    title: 'Le codeur de nuit',
    brief:
      'Un agent travaille seul la nuit sur un dépôt de code : il lit les tickets et des pages web, modifie le code, lance les tests et ouvre des pull requests. Personne ne le surveille en direct. Il ne manipule pas d’argent, mais peut casser le projet ou exfiltrer du code.',
    pieces: {
      'context-gauge': { verdict: 'essentiel', why: 'une session de développement remplit vite le contexte.' },
      'loop-engine': { verdict: 'essentiel', why: 'coder, tester, corriger : la boucle est au cœur du travail.' },
      'tool-belt': { verdict: 'essentiel', why: 'éditer des fichiers, lancer les tests, utiliser git.' },
      'thinking-hourglass': { verdict: 'essentiel', why: 'déboguer un test capricieux demande de vraies étapes de raisonnement.' },
      'plan-board': { verdict: 'essentiel', why: 'une tâche de plusieurs heures se découpe et se suit.' },
      'memory-pack': { verdict: 'essentiel', why: 'd’une nuit à l’autre, il faut reprendre où on s’était arrêté (persistance).' },
      'skill-cartridges': { verdict: 'utile', why: 'charger la procédure de revue ou de release à la demande.' },
      'harness-frame': { verdict: 'essentiel', why: 'sandbox, permissions, hooks et vérification sont vitaux pour un agent qui code seul.' },
      'drone-bay': { verdict: 'utile', why: 'paralléliser des fichiers indépendants, à condition qu’ils ne dépendent pas les uns des autres.' },
      'protocol-antenna': { verdict: 'utile', why: 'brancher GitHub et les outils via MCP.' },
      'eval-badge': { verdict: 'essentiel', why: 'mesurer la non-régression avant et après chaque changement.' },
      'prompt-shield': { verdict: 'essentiel', why: 'tickets et pages web lus sont du contenu non fiable (tool poisoning).' },
      'kill-switch': { verdict: 'essentiel', why: 'un agent autonome la nuit doit pouvoir être arrêté net.' },
    },
    settings: [
      {
        id: 'sandbox',
        label: 'Environnement de travail',
        options: [
          { id: 'sandbox', label: 'Un bac à sable jetable', points: 10, feedback: 'ses erreurs restent confinées, loin de la machine réelle.' },
          { id: 'host', label: 'Directement sur le serveur de production', points: -12, risky: true, feedback: 'une commande destructrice frapperait le vrai système.' },
        ],
      },
      {
        id: 'verify',
        label: 'Avant d’ouvrir une pull request',
        options: [
          { id: 'tests', label: 'Exiger que les tests passent', points: 10, feedback: 'une preuve extérieure, pas la parole de l’agent.' },
          { id: 'trust', label: 'Faire confiance à l’agent', points: -8, risky: true, feedback: 'c’est la porte ouverte aux faux succès.' },
        ],
      },
      {
        id: 'merge',
        label: 'Fusion des pull requests',
        options: [
          { id: 'human', label: 'En brouillon, un humain relit et fusionne', points: 8, feedback: 'un humain garde la main sur ce qui entre dans le code.' },
          { id: 'auto', label: 'Fusion automatique si les tests passent', points: -6, risky: true, feedback: 'des tests verts ne garantissent ni la qualité ni l’absence de code malveillant.' },
        ],
      },
    ],
    justificationKeywords: ['sandbox', 'verification', 'test', 'injection', 'arret', 'permission', 'persistance', 'humain', 'hook', 'non fiable'],
  },
  {
    id: 'voyage',
    title: 'L’assistant de voyage qui paie',
    brief:
      'Un agent organise un week-end pour Inès : il compare les offres, lit des sites et des avis, réserve un train et un hôtel, et paie dans la limite d’un budget. L’argent est en jeu, et les contenus lus viennent du Web.',
    pieces: {
      'context-gauge': { verdict: 'essentiel', why: 'comparer plusieurs offres remplit le contexte.' },
      'loop-engine': { verdict: 'essentiel', why: 'chercher, comparer, réserver, payer : plusieurs tours.' },
      'tool-belt': { verdict: 'essentiel', why: 'recherche, réservation et paiement passent par des outils.' },
      'thinking-hourglass': { verdict: 'utile', why: 'arbitrer entre prix, durée et confort demande un peu de réflexion.' },
      'plan-board': { verdict: 'essentiel', why: 'un itinéraire se décompose en étapes dépendantes (dates avant hôtel).' },
      'memory-pack': { verdict: 'utile', why: 'se souvenir des préférences de voyage d’Inès.' },
      'skill-cartridges': { verdict: 'utile', why: 'charger la procédure de réservation à la demande.' },
      'harness-frame': { verdict: 'essentiel', why: 'conditions d’arrêt, permissions et vérifications encadrent les actions.' },
      'drone-bay': { verdict: 'superflu', why: 'un seul agent suffit pour un week-end : inutile de multiplier les agents.' },
      'protocol-antenna': { verdict: 'utile', why: 'dialoguer en A2A avec les agents de la compagnie ou de l’hôtel.' },
      'eval-badge': { verdict: 'utile', why: 'vérifier que l’agent propose de bons itinéraires sur des cas types.' },
      'prompt-shield': { verdict: 'essentiel', why: 'sites et avis sont du contenu non fiable : prix piégés, fausses offres.' },
      'kill-switch': { verdict: 'essentiel', why: 'un agent qui paie doit être arrêtable et passer par une validation humaine.' },
    },
    settings: [
      {
        id: 'payment',
        label: 'Paiement',
        options: [
          { id: 'mandate', label: 'Mandat avec plafond, puis confirmation d’Inès', points: 10, feedback: 'procuration bornée et traçable : le dérapage est impossible.' },
          { id: 'card', label: 'Carte sans limite, l’agent paie seul', points: -12, risky: true, feedback: 'une fausse offre ou une manipulation viderait le compte.' },
          { id: 'propose', label: 'Aucun paiement : l’agent propose, Inès paie', points: 5, feedback: 'très sûr, un peu moins pratique.' },
        ],
      },
      {
        id: 'confirm',
        label: 'Avant chaque réservation payante',
        options: [
          { id: 'human', label: 'Validation d’Inès', points: 8, feedback: 'un humain garde la main sur les dépenses réelles.' },
          { id: 'auto', label: 'Réserver et payer automatiquement', points: -6, risky: true, feedback: 'une réservation erronée est difficile à annuler.' },
        ],
      },
      {
        id: 'data',
        label: 'Accès au compte bancaire',
        options: [
          { id: 'scoped', label: 'Un moyen de paiement dédié, plafonné', points: 8, feedback: 'moindre privilège : l’exposition est limitée au plafond.' },
          { id: 'full', label: 'Accès complet au compte', points: -8, risky: true, feedback: 'aucun besoin, et un risque énorme en cas de faille.' },
        ],
      },
    ],
    justificationKeywords: ['mandat', 'plafond', 'paiement', 'injection', 'humain', 'confirmation', 'arret', 'privilege', 'non fiable', 'avis'],
  },
];

export function getFinalCase(id: string): FinalBossCase | undefined {
  return FINAL_CASES.find((c) => c.id === id);
}
