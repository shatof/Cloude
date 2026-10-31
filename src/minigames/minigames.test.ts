import { describe, expect, it } from 'vitest';
import { LOOP_ORDER, LOOP_TURNS, SORT_ITEMS, orderScore } from './loopRunner/data';
import {
  CUT_WORDS,
  NEXT_TOKEN_ROUNDS,
  WINDOW_MESSAGES,
  applyTemperature,
  cutScore,
  cutsOf,
  pickScore,
  sampleIndex,
  toyTokenize,
  tokenId,
  visibleWindow,
} from './tokenWorkshop/logic';

describe('Tokeniseur jouet', () => {
  it('découpe en prenant toujours le plus long morceau connu', () => {
    expect(toyTokenize('bonjour')).toEqual(['bonjour']);
    expect(toyTokenize('arrière-grand-mère')).toEqual(['arr', 'ière', '-', 'grand', '-', 'mère']);
    expect(toyTokenize('anticonstitutionnellement')).toEqual(['anti', 'constitution', 'nelle', 'ment']);
    expect(toyTokenize('xyz')).toEqual(['x', 'y', 'z']);
  });

  it('les mots du mini-jeu restent cohérents avec le concept (6 tokens pour 18 caractères)', () => {
    expect(CUT_WORDS[1]).toHaveLength(18);
    expect(toyTokenize(CUT_WORDS[1]!)).toHaveLength(6);
  });

  it('calcule les coupures et le score de découpe', () => {
    expect(cutsOf(['arr', 'ière', '-'])).toEqual([3, 7]);
    expect(cutScore([], [])).toBe(1);
    expect(cutScore([3, 7], [3, 7])).toBe(1);
    expect(cutScore([3, 7], [3])).toBeCloseTo(0.5);
    expect(cutScore([], [2])).toBe(0);
  });

  it('donne un numéro stable à chaque token', () => {
    expect(tokenId('-')).toBe(tokenId('-'));
    expect(tokenId('grand')).not.toBe(tokenId('mère'));
  });
});

describe('Prédiction et température', () => {
  it('le meilleur choix vaut 100 %, les autres au prorata', () => {
    const round = NEXT_TOKEN_ROUNDS[1]!;
    expect(pickScore(round, 'Canberra')).toBe(1);
    expect(pickScore(round, 'Sydney')).toBeCloseTo(0.3 / 0.62);
    expect(pickScore(round, 'inconnu')).toBe(0);
  });

  it('chaque phrase propose 4 choix avec un meilleur choix unique', () => {
    for (const round of NEXT_TOKEN_ROUNDS) {
      expect(round.options).toHaveLength(4);
      const best = Math.max(...round.options.map((o) => o.p));
      expect(round.options.filter((o) => o.p === best)).toHaveLength(1);
    }
  });

  it('la température aplatit ou accentue la distribution', () => {
    const p = [0.62, 0.3, 0.06, 0.02];
    const cold = applyTemperature(p, 0);
    expect(cold).toEqual([1, 0, 0, 0]);
    const warm = applyTemperature(p, 1);
    warm.forEach((v, i) => expect(v).toBeCloseTo(p[i]! / p.reduce((a, b) => a + b, 0)));
    const hot = applyTemperature(p, 2);
    expect(hot[0]!).toBeLessThan(warm[0]!);
    expect(hot[3]!).toBeGreaterThan(warm[3]!);
    expect(hot.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });

  it('tire selon la distribution', () => {
    expect(sampleIndex([0.5, 0.5], 0.2)).toBe(0);
    expect(sampleIndex([0.5, 0.5], 0.7)).toBe(1);
    expect(sampleIndex([0.5, 0.5], 0.9999)).toBe(1);
  });
});

describe('Fenêtre de contexte', () => {
  it('coupe le début de la conversation quand elle dépasse la fenêtre', () => {
    const { visible, used } = visibleWindow(WINDOW_MESSAGES, 40);
    expect(visible).toEqual([3, 4, 5, 6]);
    expect(used).toBe(39);
    expect(visible).not.toContain(0);
  });

  it('garde tout quand ça tient', () => {
    expect(visibleWindow(WINDOW_MESSAGES.slice(0, 3), 40).visible).toEqual([0, 1, 2]);
  });
});

describe('Tu es le harnais', () => {
  it('note l’ordre de la boucle', () => {
    expect(orderScore(LOOP_ORDER)).toBe(1);
    expect(orderScore(['agir', 'raisonner', 'percevoir', 'observer'])).toBe(0.5);
  });

  it('chaque tour a exactement une bonne décision, expliquée', () => {
    for (const turn of LOOP_TURNS) {
      expect(turn.options.filter((o) => o.correct)).toHaveLength(1);
      for (const o of turn.options) expect(o.feedback.length).toBeGreaterThan(10);
    }
  });

  it('le tri mélange tâches du modèle et du harnais', () => {
    const owners = new Set(SORT_ITEMS.map((i) => i.owner));
    expect(owners).toEqual(new Set(['modele', 'harnais']));
  });
});
