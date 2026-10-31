/**
 * Atelier de montage (niveau 7) : même modèle, même tâche, harnais différent.
 *
 * Simulation entièrement déterministe : 20 essais écrits à la main, chacun avec ses
 * « événements » (l'agent tourne en rond, le contexte déborde, une commande dangereuse…).
 * Chaque pièce du harnais neutralise un type d'événement. Sans elle, l'essai échoue.
 */

export type PieceId = 'loop' | 'stop' | 'compaction' | 'permissions' | 'sandbox' | 'hooks' | 'verification';

export interface AssemblyPiece {
  id: PieceId;
  label: string;
  desc: string;
}

export const ASSEMBLY_PIECES: AssemblyPiece[] = [
  { id: 'loop', label: 'Boucle', desc: 'Enchaîne penser, agir, observer, tour après tour.' },
  { id: 'stop', label: 'Arrêt', desc: 'Réponse finale, nombre de tours et budget maximum, détection des boucles.' },
  { id: 'compaction', label: 'Compaction', desc: 'Résume l’historique quand le contexte approche de la limite.' },
  { id: 'permissions', label: 'Permissions', desc: 'Chaque action est autorisée, soumise à confirmation ou interdite.' },
  { id: 'sandbox', label: 'Sandbox', desc: 'Un environnement isolé : les erreurs y restent confinées.' },
  { id: 'hooks', label: 'Hooks', desc: 'Formateur après chaque modification, recherche de secrets avant chaque commit.' },
  { id: 'verification', label: 'Vérification', desc: 'Lance les tests avant d’accepter « c’est corrigé ».' },
];

export const ALL_PIECES: PieceId[] = ASSEMBLY_PIECES.map((p) => p.id);

type EventFlag = 'stuck' | 'long' | 'danger' | 'side' | 'lint' | 'secret' | 'lazy' | 'hard';

export interface Attempt {
  id: number;
  turns: number;
  flags: EventFlag[];
}

/** Les 20 essais de la mission « corriger moyenne() dans le projet de Karim ». */
export const ATTEMPTS: Attempt[] = (
  [
    [18, ''],
    [42, 'long lazy'],
    [25, 'stuck'],
    [31, 'danger'],
    [12, 'lint'],
    [55, 'long side'],
    [22, 'lazy'],
    [38, 'stuck secret'],
    [16, ''],
    [47, 'long danger'],
    [27, 'lazy lint'],
    [20, 'side'],
    [33, 'stuck lazy'],
    [61, 'long'],
    [24, 'secret'],
    [29, 'danger lazy'],
    [19, 'lint'],
    [44, 'long stuck'],
    [35, 'lazy hard'],
    [14, ''],
  ] as [number, string][]
).map(([turns, flags], i) => ({ id: i + 1, turns, flags: flags.split(' ').filter(Boolean) as EventFlag[] }));

export type Cause =
  | 'no-loop'
  | 'runaway'
  | 'danger'
  | 'danger-contained'
  | 'overflow'
  | 'side-effect'
  | 'secret'
  | 'lint'
  | 'false-success'
  | 'hard';

export interface CauseInfo {
  label: string;
  /** Ce qui se passe, vu dans le journal. */
  log: string;
  /** Dégât réel (hors de la mission) ? */
  incident: boolean;
}

export const CAUSES: Record<Cause, CauseInfo> = {
  'no-loop': {
    label: 'Un seul pas',
    log: 'Bob propose un correctif en un seul message, sans pouvoir lancer de commande ni lire le résultat.',
    incident: false,
  },
  runaway: {
    label: 'Boucle sans fin',
    log: 'La même commande `pytest` est relancée plus de 300 fois. Facture : 24 € pour rien.',
    incident: true,
  },
  danger: {
    label: 'Commande destructrice',
    log: '`rm -rf ~/projets` exécuté directement sur l’ordinateur de Karim.',
    incident: true,
  },
  'danger-contained': {
    label: 'Dégâts confinés',
    log: '`rm -rf` exécuté… dans le bac à sable : la copie de travail est perdue, l’ordinateur de Karim est intact.',
    incident: false,
  },
  overflow: {
    label: 'Contexte plein',
    log: 'Le contexte déborde : Bob ne se souvient plus du bug à corriger et modifie un autre fichier.',
    incident: false,
  },
  'side-effect': {
    label: 'Effet de bord',
    log: 'Un script d’installation, autorisé car anodin, modifie des fichiers hors du projet.',
    incident: true,
  },
  secret: {
    label: 'Secret publié',
    log: 'Une clé d’API du fichier `.env` part dans un commit, sur le dépôt public.',
    incident: true,
  },
  lint: {
    label: 'CI rouge',
    log: 'Le correctif est juste, mais la CI le refuse : code mal formaté.',
    incident: false,
  },
  'false-success': {
    label: 'Faux succès',
    log: '« C’est corrigé ! », annonce Bob. Les tests n’ont pas été lancés : 3 échouent.',
    incident: false,
  },
  hard: {
    label: 'Bug coriace',
    log: 'Bob s’arrête et explique honnêtement ce qu’il a essayé : le bug vient d’une bibliothèque externe.',
    incident: false,
  },
};

export interface AttemptResult {
  id: number;
  ok: boolean;
  cause?: Cause;
  /** Confirmations demandées à Karim. */
  asks: number;
  cost: number;
}

const COST_PER_TURN = 0.03;
const RUNAWAY_COST = 24;

/** Joue un essai avec un harnais donné (premier échec rencontré, dans l'ordre chronologique). */
export function runAttempt(attempt: Attempt, pieces: ReadonlySet<PieceId>): AttemptResult {
  const has = (p: PieceId) => pieces.has(p);
  const flag = (f: EventFlag) => attempt.flags.includes(f);
  const cost = Math.round(attempt.turns * COST_PER_TURN * 100) / 100;
  let asks = 0;
  const fail = (cause: Cause, extra = 0): AttemptResult => ({ id: attempt.id, ok: false, cause, asks, cost: cost + extra });

  if (!has('loop')) return { id: attempt.id, ok: false, cause: 'no-loop', asks: 0, cost: COST_PER_TURN };
  if (flag('stuck') && !has('stop')) return fail('runaway', RUNAWAY_COST);
  if (flag('danger')) {
    if (has('permissions')) asks += 1;
    else if (has('sandbox')) return fail('danger-contained');
    else return fail('danger');
  }
  if (flag('long') && !has('compaction')) return fail('overflow');
  if (flag('side') && !has('sandbox')) return fail('side-effect');
  if (flag('secret') && !has('hooks')) return fail('secret');
  if (flag('lint') && !has('hooks')) return fail('lint');
  if (flag('lazy') && !has('verification')) return fail('false-success');
  if (flag('hard')) return fail('hard');
  return { id: attempt.id, ok: true, asks, cost };
}

export interface RunSummary {
  pieces: PieceId[];
  results: AttemptResult[];
  successRate: number;
  incidents: number;
  asks: number;
  cost: number;
  /** Échecs regroupés par cause, dans l'ordre d'apparition. */
  failures: { cause: Cause; attempts: number[] }[];
}

export function simulate(pieces: Iterable<PieceId>): RunSummary {
  const set = new Set(pieces);
  const results = ATTEMPTS.map((a) => runAttempt(a, set));
  const failures: { cause: Cause; attempts: number[] }[] = [];
  for (const r of results) {
    if (r.ok || !r.cause) continue;
    const group = failures.find((f) => f.cause === r.cause);
    if (group) group.attempts.push(r.id);
    else failures.push({ cause: r.cause, attempts: [r.id] });
  }
  return {
    pieces: ALL_PIECES.filter((p) => set.has(p)),
    results,
    successRate: results.filter((r) => r.ok).length / results.length,
    incidents: results.filter((r) => r.cause && CAUSES[r.cause].incident).length,
    asks: results.reduce((s, r) => s + r.asks, 0),
    cost: Math.round(results.reduce((s, r) => s + r.cost, 0) * 100) / 100,
    failures,
  };
}

/** Objectif de la manche : au moins 90 % de réussite, sans aucun dégât réel. */
export const GOAL_RATE = 0.9;

export function meetsGoal(run: RunSummary): boolean {
  return run.successRate >= GOAL_RATE && run.incidents === 0;
}

/** Score de la manche : meilleur taux de réussite obtenu sans dégât, rapporté à l'objectif. */
export function assemblyScore(runs: readonly RunSummary[]): number {
  const clean = runs.filter((r) => r.incidents === 0).map((r) => r.successRate);
  const best = clean.length ? Math.max(...clean) : 0;
  return Math.min(1, best / GOAL_RATE);
}

/** Journal d'un harnais auquel il manque une pièce (pour la manche « la pièce manquante »). */
export function missingPieceLog(missing: PieceId): string {
  const run = simulate(ALL_PIECES.filter((p) => p !== missing));
  const lines = run.failures
    .filter((f) => f.cause !== 'hard')
    .map((f) => `${f.attempts.length > 1 ? 'Essais' : 'Essai'} ${f.attempts.join(', ')} : ${CAUSES[f.cause].log.replace(/`/g, '')}`);
  return [`Réussite : ${Math.round(run.successRate * 100)} %, dégâts : ${run.incidents}`, ...lines].join('\n');
}
