/**
 * Système d'XP et de rangs.
 *
 * L'XP est stockée dans un « registre » : une entrée par source (ex. « l0:boss »).
 * Rejouer une phase ne rapporte que l'amélioration par rapport au meilleur score,
 * donc l'XP totale reste bornée et reproductible.
 */

export const XP_RULES = {
  /** Avoir regardé Bob échouer. */
  problem: 10,
  /** Chaque écran de concept lu pour la première fois. */
  conceptScreen: 10,
  /** Chaque flashcard maîtrisée (boîte 5 du mode révision). */
  masteredFlashcard: 5,
} as const;

export interface Rank {
  min: number;
  title: string;
}

/** Titres épicènes, du plus modeste au plus prestigieux. */
export const RANKS: Rank[] = [
  { min: 0, title: 'Novice' },
  { min: 150, title: 'Stagiaire du prompt' },
  { min: 400, title: 'Mécano de harnais' },
  { min: 800, title: 'Pilote d’agent' },
  { min: 1300, title: 'Architecte junior' },
  { min: 1900, title: 'Stratège multi-agents' },
  { min: 2600, title: 'Sentinelle des harnais' },
  { min: 3300, title: 'Légende agentique' },
];

export interface RankInfo {
  index: number;
  title: string;
  min: number;
  next: Rank | null;
  /** Avancement vers le rang suivant, entre 0 et 1 (1 au rang maximal). */
  progress: number;
}

export function totalXp(ledger: Record<string, number>): number {
  let sum = 0;
  for (const value of Object.values(ledger)) {
    if (Number.isFinite(value) && value > 0) sum += value;
  }
  return Math.round(sum);
}

export function rankFor(xp: number): RankInfo {
  let index = 0;
  for (let i = 0; i < RANKS.length; i += 1) {
    if (xp >= (RANKS[i] as Rank).min) index = i;
  }
  const current = RANKS[index] as Rank;
  const next = RANKS[index + 1] ?? null;
  const progress = next ? Math.min(1, Math.max(0, (xp - current.min) / (next.min - current.min))) : 1;
  return { index, title: current.title, min: current.min, next, progress };
}

/**
 * Inscrit une source d'XP dans le registre en ne gardant que le meilleur montant.
 * Renvoie le nouveau registre et l'XP réellement gagnée.
 */
export function awardXp(
  ledger: Record<string, number>,
  key: string,
  amount: number,
): { ledger: Record<string, number>; gained: number } {
  const safe = Math.max(0, Math.round(amount));
  const previous = ledger[key] ?? 0;
  if (safe <= previous) return { ledger, gained: 0 };
  return { ledger: { ...ledger, [key]: safe }, gained: safe - previous };
}
