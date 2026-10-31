import { describe, expect, it } from 'vitest';
import { HARNESS_PIECES, getPiece } from '../game/harness';
import { CARDS, LEVELS, getCard } from './levels';
import { GLOBAL_TUTOR_ENTRIES } from './tutorGlobal';
import { LEVEL_IDS, type LevelDefinition } from './types';

/**
 * Garde-fous du format pédagogique. Ces tests échouent si un niveau ajouté
 * ne respecte pas le format commun (pratique quand on ajoute les niveaux un par un).
 */

const playable = LEVELS.filter((l): l is LevelDefinition & { content: NonNullable<LevelDefinition['content']> } =>
  Boolean(l.content),
);

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

describe('Registre des niveaux', () => {
  it('contient les niveaux 0 à 12 puis le boss final, dans l’ordre', () => {
    expect(LEVELS.map((l) => l.id)).toEqual([...LEVEL_IDS]);
    LEVELS.forEach((l, i) => expect(l.order).toBe(i));
  });

  it('affiche un titre et un concept pour chaque niveau, même à venir', () => {
    for (const l of LEVELS) {
      expect(l.title.length).toBeGreaterThan(3);
      expect(l.shortTitle.length).toBeLessThanOrEqual(14);
      expect(l.concept.length).toBeGreaterThan(10);
    }
  });

  it('associe une pièce de harnais distincte à chaque niveau', () => {
    const ids = LEVELS.map((l) => l.harnessPieceId);
    expect(new Set(ids).size).toBe(LEVELS.length);
    for (const l of LEVELS) expect(getPiece(l.harnessPieceId)?.levelId).toBe(l.id);
    expect(HARNESS_PIECES).toHaveLength(LEVELS.length);
  });

  it('les niveaux 0 et 1 sont entièrement remplis', () => {
    expect(playable.map((l) => l.id)).toEqual(expect.arrayContaining(['l0', 'l1']));
  });
});

describe.each(playable.map((l) => [l.id, l] as const))('Format du niveau %s', (_id, level) => {
  const { content } = level;

  it('le problème montre au moins un échec de Bob', () => {
    expect(content.problem.steps.some((s) => s.kind === 'fail')).toBe(true);
    expect(content.problem.steps.length).toBeLessThanOrEqual(12);
  });

  it('le concept tient en 3 écrans courts, chacun avec une analogie', () => {
    expect(content.concept.length).toBeGreaterThanOrEqual(1);
    expect(content.concept.length).toBeLessThanOrEqual(3);
    for (const screen of content.concept) {
      expect(wordCount(screen.body)).toBeLessThanOrEqual(110);
      expect(screen.analogy.text.length).toBeGreaterThan(20);
      expect(wordCount(screen.analogy.text)).toBeLessThanOrEqual(60);
      expect(screen.takeaway.length).toBeGreaterThan(10);
    }
  });

  it('le boss pose plusieurs questions avec une seule bonne réponse et une explication par choix', () => {
    const { boss } = content;
    expect(boss.questions.length).toBeGreaterThanOrEqual(5);
    expect(boss.passRatio).toBeGreaterThan(0);
    expect(boss.passRatio).toBeLessThanOrEqual(1);
    for (const q of boss.questions) {
      expect(q.choices.filter((c) => c.correct)).toHaveLength(1);
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
      for (const c of q.choices) expect(c.feedback.length).toBeGreaterThan(5);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
    // La bonne réponse ne doit pas toujours être au même endroit.
    const positions = new Set(boss.questions.map((q) => q.choices.findIndex((c) => c.correct)));
    expect(positions.size).toBeGreaterThan(1);
  });

  it('la récompense référence des cartes existantes de ce niveau', () => {
    expect(content.reward.cardIds.length).toBeGreaterThanOrEqual(1);
    for (const id of content.reward.cardIds) expect(getCard(id)?.levelId).toBe(level.id);
  });

  it('le tuteur hors-ligne a des réponses et des suggestions valides', () => {
    const ids = content.tutor.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of content.tutor.suggestions) expect(ids).toContain(s);
    for (const e of content.tutor.entries) {
      expect(e.keywords.length).toBeGreaterThan(0);
      for (const k of e.keywords) expect(k).toBe(k.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());
    }
  });
});

describe('Cartes de glossaire', () => {
  it('ont des identifiants uniques et sont toutes distribuées par un niveau', () => {
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(CARDS.length);
    const distributed = new Set(playable.flatMap((l) => l.content.reward.cardIds));
    for (const c of CARDS) expect(distributed.has(c.id)).toBe(true);
  });

  it('ne nomment pas le terme dans leur analogie (elle sert de question)', () => {
    for (const c of CARDS) expect(c.analogy.toLowerCase()).not.toContain(c.term.toLowerCase());
  });
});

describe('Tuteur global', () => {
  it('a des identifiants distincts de ceux des niveaux', () => {
    const levelIds = playable.flatMap((l) => l.content.tutor.entries.map((e) => e.id));
    for (const e of GLOBAL_TUTOR_ENTRIES) expect(levelIds).not.toContain(e.id);
  });
});
