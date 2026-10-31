import { describe, expect, it } from 'vitest';
import { bestBudgetSelection, budgetScore, jaccard, pairwiseOrderScore, ratio } from './scoring';

describe('Scores des manches configurables', () => {
  it('ratio borné', () => {
    expect(ratio(3, 4)).toBe(0.75);
    expect(ratio(0, 0)).toBe(1);
  });

  it('Jaccard', () => {
    expect(jaccard(['a', 'b'], ['a', 'b'])).toBe(1);
    expect(jaccard(['a'], ['a', 'b'])).toBe(0.5);
    expect(jaccard(['c'], ['a'])).toBe(0);
    expect(jaccard([], [])).toBe(1);
  });

  it('ordre : proportion de paires bien rangées', () => {
    expect(pairwiseOrderScore(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(1);
    expect(pairwiseOrderScore(['c', 'b', 'a'], ['a', 'b', 'c'])).toBe(0);
    expect(pairwiseOrderScore(['b', 'a', 'c'], ['a', 'b', 'c'])).toBeCloseTo(2 / 3);
  });

  it('budget : meilleure sélection et score', () => {
    const items = [
      { id: 'a', cost: 5, value: 10 },
      { id: 'b', cost: 4, value: 7 },
      { id: 'c', cost: 3, value: 6 },
    ];
    expect(bestBudgetSelection(items, 7)).toEqual({ value: 13, ids: ['b', 'c'] });
    expect(budgetScore(items, 7, ['b', 'c'])).toBe(1);
    expect(budgetScore(items, 7, ['a'])).toBeCloseTo(10 / 13);
    expect(budgetScore(items, 7, ['a', 'b'])).toBe(0);
  });
});
