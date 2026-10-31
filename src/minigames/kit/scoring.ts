/**
 * Calculs de score des manches configurables (purs et testés).
 * Tous les scores sont compris entre 0 et 1.
 */

/** Proportion de bonnes réponses. */
export function ratio(good: number, total: number): number {
  return total > 0 ? Math.min(1, Math.max(0, good / total)) : 1;
}

/** Indice de Jaccard entre la sélection et la bonne réponse (1 si les deux sont vides). */
export function jaccard(selected: readonly string[], expected: readonly string[]): number {
  const a = new Set(selected);
  const b = new Set(expected);
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / union.size;
}

/**
 * Ordre : proportion de paires d'éléments rangées dans le bon ordre relatif.
 * 1 = ordre parfait, 0 = ordre inversé. Plus juste qu'un « tout ou rien ».
 */
export function pairwiseOrderScore(proposed: readonly string[], expected: readonly string[]): number {
  const position = new Map(proposed.map((id, i) => [id, i]));
  let good = 0;
  let total = 0;
  for (let i = 0; i < expected.length; i += 1) {
    for (let j = i + 1; j < expected.length; j += 1) {
      total += 1;
      const pi = position.get(expected[i] as string);
      const pj = position.get(expected[j] as string);
      if (pi !== undefined && pj !== undefined && pi < pj) good += 1;
    }
  }
  return total > 0 ? good / total : 1;
}

export interface BudgetItem {
  id: string;
  cost: number;
  value: number;
}

/** Meilleure valeur atteignable sans dépasser le budget (recherche exhaustive, n ≤ 16). */
export function bestBudgetSelection(items: readonly BudgetItem[], budget: number): { value: number; ids: string[] } {
  const n = Math.min(items.length, 16);
  let best = { value: 0, ids: [] as string[] };
  for (let mask = 0; mask < 1 << n; mask += 1) {
    let cost = 0;
    let value = 0;
    const ids: string[] = [];
    for (let i = 0; i < n; i += 1) {
      if (mask & (1 << i)) {
        const item = items[i] as BudgetItem;
        cost += item.cost;
        value += item.value;
        ids.push(item.id);
      }
    }
    if (cost <= budget && value > best.value) best = { value, ids };
  }
  return best;
}

/** Score d'une sélection sous budget : sa valeur rapportée à la meilleure possible (0 si hors budget). */
export function budgetScore(items: readonly BudgetItem[], budget: number, selected: readonly string[]): number {
  const chosen = items.filter((i) => selected.includes(i.id));
  const cost = chosen.reduce((s, i) => s + i.cost, 0);
  if (cost > budget) return 0;
  const value = chosen.reduce((s, i) => s + i.value, 0);
  const best = bestBudgetSelection(items, budget).value;
  return best > 0 ? Math.max(0, value / best) : 1;
}
