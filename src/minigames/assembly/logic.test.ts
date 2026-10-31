import { describe, expect, it } from 'vitest';
import { ALL_PIECES, ATTEMPTS, assemblyScore, meetsGoal, missingPieceLog, simulate, type PieceId } from './logic';

const without = (piece: PieceId) => ALL_PIECES.filter((p) => p !== piece);

describe('atelier de montage', () => {
  it('compte 20 essais déterministes', () => {
    expect(ATTEMPTS).toHaveLength(20);
    expect(simulate(ALL_PIECES)).toEqual(simulate([...ALL_PIECES].reverse()));
  });

  it('sans boucle, rien ne marche', () => {
    const run = simulate(ALL_PIECES.filter((p) => p !== 'loop'));
    expect(run.successRate).toBe(0);
    expect(run.failures.map((f) => f.cause)).toEqual(['no-loop']);
  });

  it('la boucle seule ne réussit que les essais sans imprévu, avec des dégâts', () => {
    const run = simulate(['loop']);
    expect(run.successRate).toBeCloseTo(0.15);
    expect(run.incidents).toBeGreaterThan(0);
  });

  it('le harnais complet atteint l’objectif, sans dégât', () => {
    const run = simulate(ALL_PIECES);
    expect(run.successRate).toBeCloseTo(0.95);
    expect(run.incidents).toBe(0);
    expect(run.asks).toBe(3);
    expect(meetsGoal(run)).toBe(true);
  });

  it('chaque pièce compte : en retirer une seule fait manquer l’objectif', () => {
    for (const piece of ALL_PIECES) {
      expect(meetsGoal(simulate(without(piece))), piece).toBe(false);
    }
  });

  it('chaque pièce retirée laisse une trace reconnaissable dans le journal', () => {
    const causes = (piece: PieceId) => simulate(without(piece)).failures.map((f) => f.cause);
    expect(causes('stop')).toContain('runaway');
    expect(causes('compaction')).toContain('overflow');
    expect(causes('permissions')).toContain('danger-contained');
    expect(causes('sandbox')).toContain('side-effect');
    expect(causes('hooks')).toEqual(expect.arrayContaining(['secret', 'lint']));
    expect(causes('verification')).toContain('false-success');
  });

  it('sans permissions ni sandbox, la commande destructrice fait de vrais dégâts', () => {
    const run = simulate(ALL_PIECES.filter((p) => p !== 'permissions' && p !== 'sandbox'));
    expect(run.failures.map((f) => f.cause)).toContain('danger');
    expect(run.incidents).toBeGreaterThanOrEqual(3);
  });

  it('les boucles sans fin font exploser la facture', () => {
    expect(simulate(without('stop')).cost).toBeGreaterThan(simulate(ALL_PIECES).cost + 50);
  });

  it('le score retient le meilleur montage sans dégât', () => {
    expect(assemblyScore([])).toBe(0);
    expect(assemblyScore([simulate(['loop'])])).toBe(0);
    expect(assemblyScore([simulate(['loop']), simulate(ALL_PIECES)])).toBe(1);
    expect(assemblyScore([simulate(without('sandbox'))])).toBe(0);
    expect(assemblyScore([simulate(without('stop'))])).toBe(0);
    expect(assemblyScore([simulate(without('compaction'))])).toBeCloseTo(0.7 / 0.9);
  });

  it('le journal d’une pièce manquante ne la nomme pas', () => {
    for (const piece of without('loop')) {
      const log = missingPieceLog(piece);
      expect(log).toMatch(/^Réussite : \d+ %/);
      expect(log.split('\n').length).toBeGreaterThan(1);
    }
  });
});
