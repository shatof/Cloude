import { describe, expect, it } from 'vitest';
import { CARDS, LEVELS, getLevel } from '../content/levels';
import type { LevelId } from '../content/types';
import { createRng, seededShuffle } from './random';
import {
  applyReviewAnswer,
  buildQuickQuiz,
  buildSession,
  generateFlashcards,
  isDue,
} from './review';
import {
  canAccessPhase,
  createInitialSave,
  currentLevel,
  gameReducer,
  levelStatus,
  resumePhase,
  type GameAction,
  type SaveData,
} from './state';
import { CORRUPT_BACKUP_KEY, SAVE_KEY, exportSave, loadSave, parseImport, persistSave, sanitizeSave } from './storage';
import { RANKS, awardXp, rankFor, totalXp } from './xp';

function run(save: SaveData, actions: GameAction[]): SaveData {
  return actions.reduce(gameReducer, save);
}

/** Joue un niveau jouable de bout en bout avec les scores donnés. */
function completeLevel(save: SaveData, levelId: LevelId, minigame = 1, boss = 1): SaveData {
  const level = getLevel(levelId);
  if (!level?.content) throw new Error(`niveau ${levelId} non jouable`);
  const total = level.content.concept.length;
  const actions: GameAction[] = [{ type: 'problem/done', levelId }];
  for (let i = 0; i < total; i += 1) actions.push({ type: 'concept/seen', levelId, index: i, total });
  actions.push({ type: 'minigame/done', levelId, score: minigame, xpMax: level.content.minigame.xp });
  actions.push({ type: 'boss/done', levelId, ratio: boss, won: true, xpMax: level.content.boss.xp });
  actions.push({ type: 'reward/claim', levelId });
  return run(save, actions);
}

class MemoryStorage {
  data = new Map<string, string>();
  getItem(k: string) {
    return this.data.has(k) ? (this.data.get(k) as string) : null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
}

describe('XP et rangs', () => {
  it('additionne le registre et ignore les valeurs invalides', () => {
    expect(totalXp({ a: 10, b: 15.4, c: -3, d: Number.NaN })).toBe(25);
  });

  it('ne compte que les améliorations', () => {
    let { ledger, gained } = awardXp({}, 'l0:minigame', 30);
    expect(gained).toBe(30);
    ({ ledger, gained } = awardXp(ledger, 'l0:minigame', 20));
    expect(gained).toBe(0);
    ({ ledger, gained } = awardXp(ledger, 'l0:minigame', 45));
    expect(gained).toBe(15);
    expect(ledger['l0:minigame']).toBe(45);
  });

  it('calcule le rang et la progression vers le suivant', () => {
    expect(rankFor(0).title).toBe(RANKS[0]?.title);
    const r = rankFor(275);
    expect(r.index).toBe(1);
    expect(r.progress).toBeCloseTo((275 - 150) / (400 - 150));
    const top = rankFor(99_999);
    expect(top.next).toBeNull();
    expect(top.progress).toBe(1);
  });
});

describe('Hasard déterministe', () => {
  it('produit la même suite pour la même graine', () => {
    const a = createRng('bob');
    const b = createRng('bob');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(seededShuffle([1, 2, 3, 4, 5], 7)).toEqual(seededShuffle([1, 2, 3, 4, 5], 7));
  });
});

describe('Progression d’un niveau', () => {
  it('débloque les phases dans l’ordre', () => {
    let save = createInitialSave();
    expect(canAccessPhase(save, 'l0', 'problem')).toBe(true);
    expect(canAccessPhase(save, 'l0', 'concept')).toBe(false);
    save = gameReducer(save, { type: 'problem/done', levelId: 'l0' });
    expect(canAccessPhase(save, 'l0', 'concept')).toBe(true);
    save = gameReducer(save, { type: 'concept/seen', levelId: 'l0', index: 0, total: 3 });
    expect(canAccessPhase(save, 'l0', 'minigame')).toBe(false);
    save = run(save, [
      { type: 'concept/seen', levelId: 'l0', index: 1, total: 3 },
      { type: 'concept/seen', levelId: 'l0', index: 2, total: 3 },
    ]);
    expect(canAccessPhase(save, 'l0', 'minigame')).toBe(true);
    expect(resumePhase(save, 'l0')).toBe('minigame');
  });

  it('une défaite contre le boss ne débloque pas la récompense', () => {
    let save = createInitialSave();
    save = run(save, [
      { type: 'problem/done', levelId: 'l0' },
      { type: 'concept/seen', levelId: 'l0', index: 0, total: 1 },
      { type: 'minigame/done', levelId: 'l0', score: 0.5, xpMax: 60 },
      { type: 'boss/done', levelId: 'l0', ratio: 0.4, won: false, xpMax: 100 },
    ]);
    expect(canAccessPhase(save, 'l0', 'reward')).toBe(false);
    expect(save.levels.l0?.bossAttempts).toBe(1);
    expect(save.xpLedger['l0:boss']).toBeUndefined();
    // Réclamer la récompense sans l'avoir débloquée ne fait rien.
    expect(gameReducer(save, { type: 'reward/claim', levelId: 'l0' })).toBe(save);
  });

  it('accorde pièce, cartes et XP une seule fois', () => {
    const save = completeLevel(createInitialSave(), 'l0');
    expect(save.pieces).toEqual(['context-gauge']);
    expect(save.cards).toEqual(['token', 'next-token', 'context-window']);
    const xp = totalXp(save.xpLedger);
    expect(xp).toBe(10 + 30 + 60 + 100 + 50);
    const again = gameReducer(save, { type: 'reward/claim', levelId: 'l0' });
    expect(totalXp(again.xpLedger)).toBe(xp);
    expect(again.pieces).toHaveLength(1);
  });

  it('débloque les niveaux un par un et signale le contenu à venir', () => {
    let save = createInitialSave();
    expect(levelStatus(save, LEVELS[0]!)).toBe('available');
    expect(levelStatus(save, LEVELS[1]!)).toBe('locked');
    const firstSoon = LEVELS.findIndex((l) => !l.content);
    const playableCount = firstSoon === -1 ? LEVELS.length : firstSoon;
    for (let i = 0; i < playableCount; i += 1) {
      const level = LEVELS[i]!;
      expect(levelStatus(save, level)).toBe('available');
      save = completeLevel(save, level.id);
      expect(levelStatus(save, level)).toBe('completed');
    }
    if (firstSoon !== -1) {
      expect(levelStatus(save, LEVELS[firstSoon]!)).toBe('coming-soon');
      expect(currentLevel(save).id).toBe(LEVELS[firstSoon]!.id);
    }
  });

  it('le réglage « tout débloquer » ouvre les niveaux jouables seulement', () => {
    const save = gameReducer(createInitialSave(), { type: 'settings/update', patch: { unlockAll: true } });
    for (const level of LEVELS) {
      expect(levelStatus(save, level)).toBe(level.content ? 'available' : 'coming-soon');
    }
  });

  it('la réinitialisation garde les réglages', () => {
    let save = completeLevel(createInitialSave(), 'l0');
    save = gameReducer(save, { type: 'settings/update', patch: { readableFont: true } });
    save = gameReducer(save, { type: 'save/reset' });
    expect(save.pieces).toEqual([]);
    expect(save.settings.readableFont).toBe(true);
  });
});

describe('Mode révision', () => {
  const flashcards = generateFlashcards(CARDS);

  it('génère 3 flashcards par carte, sans révéler le terme dans l’analogie', () => {
    expect(flashcards).toHaveLength(CARDS.length * 3);
    for (const f of flashcards.filter((x) => x.kind === 'analogy')) {
      const card = CARDS.find((c) => c.id === f.cardId)!;
      const t = card.term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const front = f.front.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      expect(new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(front), card.id).toBe(false);
    }
  });

  it('planifie les boîtes de Leitner par session', () => {
    expect(isDue(1, 3)).toBe(true);
    expect(isDue(2, 3)).toBe(false);
    expect(isDue(2, 4)).toBe(true);
    expect(isDue(3, 4)).toBe(true);
    expect(isDue(4, 4)).toBe(false);
  });

  it('fait monter une carte sue et redescendre une carte ratée', () => {
    let review: { session: number; boxes: Record<string, number>; mastered: string[] } = { session: 0, boxes: {}, mastered: [] };
    for (let i = 0; i < 3; i += 1) review = applyReviewAnswer(review, 'token#definition', true).review;
    expect(review.boxes['token#definition']).toBe(4);
    const r = applyReviewAnswer(review, 'token#definition', true);
    expect(r.masteredNow).toBe(true);
    expect(applyReviewAnswer(r.review, 'token#definition', true).masteredNow).toBe(false);
    expect(applyReviewAnswer(r.review, 'token#definition', false).review.boxes['token#definition']).toBe(1);
  });

  it('accorde l’XP de maîtrise une seule fois', () => {
    let save = createInitialSave();
    for (let i = 0; i < 6; i += 1) save = gameReducer(save, { type: 'review/answer', flashcardId: 'token#myth', known: true });
    expect(save.xpLedger['review:token#myth']).toBe(5);
    expect(save.review.mastered).toEqual(['token#myth']);
  });

  it('construit une session avec les cartes dues, les moins sues d’abord', () => {
    const review = { session: 2, boxes: { 'token#definition': 2, 'token#analogy': 3 }, mastered: [] };
    const session = buildSession(flashcards.slice(0, 3), review);
    expect(session.map((f) => f.id)).toEqual(['token#myth', 'token#definition']);
  });

  it('génère un défi éclair déterministe avec une seule bonne réponse', () => {
    const q1 = buildQuickQuiz(CARDS, 'seed');
    const q2 = buildQuickQuiz(CARDS, 'seed');
    expect(q1).toEqual(q2);
    for (const q of q1) {
      expect(q.options.filter((o) => o.cardId === q.answerId)).toHaveLength(1);
      expect(new Set(q.options.map((o) => o.cardId)).size).toBe(q.options.length);
    }
    expect(buildQuickQuiz(CARDS.slice(0, 2), 'x')).toEqual([]);
  });
});

describe('Sauvegarde', () => {
  it('fait l’aller-retour dans le stockage', () => {
    const storage = new MemoryStorage();
    const save = completeLevel(createInitialSave(), 'l0', 0.5, 0.86);
    expect(persistSave(save, storage)).toBe(true);
    expect(loadSave(storage).save).toEqual(save);
  });

  it('met de côté une sauvegarde corrompue', () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, '{pas du json');
    const { save, notice } = loadSave(storage);
    expect(save).toEqual(createInitialSave());
    expect(notice).toBeTruthy();
    expect(storage.getItem(CORRUPT_BACKUP_KEY)).toBe('{pas du json');
  });

  it('ignore les identifiants inconnus et borne les valeurs', () => {
    const save = sanitizeSave({
      version: 1,
      cards: ['token', 'carte-inexistante', 'token'],
      pieces: ['context-gauge', 'piece-pirate'],
      levels: { l0: { reached: 99, minigameBest: 7 }, lX: { reached: 2 } },
      xpLedger: { 'l0:boss': 1e9, bad: 'x' },
      settings: { textScale: 5, textSpeed: 'warp' },
    });
    expect(save.cards).toEqual(['token']);
    expect(save.pieces).toEqual(['context-gauge']);
    expect(save.levels.l0?.reached).toBe(4);
    expect(save.levels.l0?.minigameBest).toBe(1);
    expect(Object.keys(save.levels)).toEqual(['l0']);
    expect(save.xpLedger).toEqual({ 'l0:boss': 10_000 });
    expect(save.settings.textScale).toBe(1.3);
    expect(save.settings.textSpeed).toBe('fast');
  });

  it('refuse une sauvegarde venant du futur', () => {
    expect(() => sanitizeSave({ version: 999 })).toThrow();
  });

  it('exporte puis réimporte, et rejette un fichier étranger', () => {
    const save = completeLevel(createInitialSave(), 'l0');
    const text = exportSave(save, new Date('2026-10-31T12:00:00Z'));
    expect(text).not.toMatch(/apiKey|sk-ant/);
    expect(parseImport(text)).toEqual(save);
    expect(() => parseImport('{"bonjour": 1}')).toThrow(/GitGudAI/);
    expect(() => parseImport('pas du json')).toThrow(/JSON/);
  });
});
