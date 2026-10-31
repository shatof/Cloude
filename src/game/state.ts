import { CARDS, LEVELS, getLevel } from '../content/levels';
import { PHASES, type LevelDefinition, type LevelId, type PhaseId } from '../content/types';
import { HARNESS_PIECES } from './harness';
import { applyReviewAnswer } from './review';
import { XP_RULES, awardXp } from './xp';

/* ------------------------------------------------------------------ */
/* Modèle de sauvegarde                                                */
/* ------------------------------------------------------------------ */

export const SAVE_VERSION = 1;

export interface LevelProgress {
  /** Indice (dans PHASES) de la phase la plus avancée débloquée. */
  reached: number;
  /** Nombre d'écrans de concept déjà lus. */
  conceptSeen: number;
  /** Meilleur score au mini-jeu, entre 0 et 1 (-1 : jamais joué). */
  minigameBest: number;
  /** Meilleur taux de bonnes réponses lors d'une victoire contre le boss (-1 : jamais battu). */
  bossBest: number;
  bossAttempts: number;
  rewardClaimed: boolean;
}

export interface ReviewState {
  /** Numéro de la session de révision en cours (commence à 0). */
  session: number;
  /** Boîte de Leitner (1 à 5) de chaque flashcard déjà vue. */
  boxes: Record<string, number>;
  /** Flashcards ayant atteint la boîte 5. */
  mastered: string[];
}

export type TextSpeed = 'instant' | 'fast' | 'normal';

export interface Settings {
  textSpeed: TextSpeed;
  readableFont: boolean;
  textScale: number;
  crt: boolean;
  reduceMotion: boolean;
  sound: boolean;
  /** Débloque tous les niveaux jouables (pratique pour tester ou réviser). */
  unlockAll: boolean;
}

export interface SaveData {
  version: number;
  xpLedger: Record<string, number>;
  levels: Partial<Record<LevelId, LevelProgress>>;
  cards: string[];
  pieces: string[];
  review: ReviewState;
  settings: Settings;
  flags: { introSeen: boolean };
}

export const DEFAULT_SETTINGS: Settings = {
  textSpeed: 'fast',
  readableFont: false,
  textScale: 1,
  crt: false,
  reduceMotion: false,
  sound: false,
  unlockAll: false,
};

export function emptyLevelProgress(): LevelProgress {
  return { reached: 0, conceptSeen: 0, minigameBest: -1, bossBest: -1, bossAttempts: 0, rewardClaimed: false };
}

export function createInitialSave(settings: Settings = DEFAULT_SETTINGS): SaveData {
  return {
    version: SAVE_VERSION,
    xpLedger: {},
    levels: {},
    cards: [],
    pieces: [],
    review: { session: 0, boxes: {}, mastered: [] },
    settings: { ...settings },
    flags: { introSeen: false },
  };
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export type GameAction =
  | { type: 'problem/done'; levelId: LevelId }
  | { type: 'concept/seen'; levelId: LevelId; index: number; total: number }
  | { type: 'minigame/done'; levelId: LevelId; score: number; xpMax: number }
  | { type: 'boss/done'; levelId: LevelId; ratio: number; won: boolean; xpMax: number }
  | { type: 'reward/claim'; levelId: LevelId }
  | { type: 'review/answer'; flashcardId: string; known: boolean }
  | { type: 'review/sessionEnd' }
  | { type: 'settings/update'; patch: Partial<Settings> }
  | { type: 'intro/seen' }
  | { type: 'save/replace'; data: SaveData }
  | { type: 'save/reset' };

const PHASE_INDEX: Record<PhaseId, number> = {
  problem: 0,
  concept: 1,
  minigame: 2,
  boss: 3,
  reward: 4,
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function withLevel(save: SaveData, levelId: LevelId, update: (p: LevelProgress) => LevelProgress): SaveData {
  const current = save.levels[levelId] ?? emptyLevelProgress();
  return { ...save, levels: { ...save.levels, [levelId]: update(current) } };
}

function unlockPhase(p: LevelProgress, phase: PhaseId): LevelProgress {
  const index = PHASE_INDEX[phase];
  return index > p.reached ? { ...p, reached: index } : p;
}

export function gameReducer(save: SaveData, action: GameAction): SaveData {
  switch (action.type) {
    case 'problem/done': {
      const next = withLevel(save, action.levelId, (p) => unlockPhase(p, 'concept'));
      return { ...next, xpLedger: awardXp(next.xpLedger, `${action.levelId}:problem`, XP_RULES.problem).ledger };
    }
    case 'concept/seen': {
      const total = Math.max(1, action.total);
      const index = Math.min(Math.max(0, action.index), total - 1);
      let next = withLevel(save, action.levelId, (p) => {
        const conceptSeen = Math.max(p.conceptSeen, index + 1);
        const updated = { ...p, conceptSeen };
        return conceptSeen >= total ? unlockPhase(updated, 'minigame') : updated;
      });
      next = {
        ...next,
        xpLedger: awardXp(next.xpLedger, `${action.levelId}:concept:${index}`, XP_RULES.conceptScreen).ledger,
      };
      return next;
    }
    case 'minigame/done': {
      const score = clamp01(action.score);
      const next = withLevel(save, action.levelId, (p) =>
        unlockPhase({ ...p, minigameBest: Math.max(p.minigameBest, score) }, 'boss'),
      );
      return {
        ...next,
        xpLedger: awardXp(next.xpLedger, `${action.levelId}:minigame`, action.xpMax * score).ledger,
      };
    }
    case 'boss/done': {
      const ratio = clamp01(action.ratio);
      let next = withLevel(save, action.levelId, (p) => {
        const attempted = { ...p, bossAttempts: p.bossAttempts + 1 };
        if (!action.won) return attempted;
        return unlockPhase({ ...attempted, bossBest: Math.max(p.bossBest, ratio) }, 'reward');
      });
      if (action.won) {
        next = { ...next, xpLedger: awardXp(next.xpLedger, `${action.levelId}:boss`, action.xpMax * ratio).ledger };
      }
      return next;
    }
    case 'reward/claim': {
      const level = getLevel(action.levelId);
      const progress = save.levels[action.levelId];
      if (!level?.content || !progress || progress.reached < PHASE_INDEX.reward || progress.rewardClaimed) {
        return save;
      }
      const { reward } = level.content;
      const cards = [...save.cards];
      for (const id of reward.cardIds) if (!cards.includes(id)) cards.push(id);
      const pieces = save.pieces.includes(level.harnessPieceId) ? save.pieces : [...save.pieces, level.harnessPieceId];
      const next = withLevel({ ...save, cards, pieces }, action.levelId, (p) => ({ ...p, rewardClaimed: true }));
      return { ...next, xpLedger: awardXp(next.xpLedger, `${action.levelId}:reward`, reward.xp).ledger };
    }
    case 'review/answer': {
      const { review, masteredNow } = applyReviewAnswer(save.review, action.flashcardId, action.known);
      const xpLedger = masteredNow
        ? awardXp(save.xpLedger, `review:${action.flashcardId}`, XP_RULES.masteredFlashcard).ledger
        : save.xpLedger;
      return { ...save, review, xpLedger };
    }
    case 'review/sessionEnd':
      return { ...save, review: { ...save.review, session: save.review.session + 1 } };
    case 'settings/update':
      return { ...save, settings: { ...save.settings, ...action.patch } };
    case 'intro/seen':
      return { ...save, flags: { ...save.flags, introSeen: true } };
    case 'save/replace':
      return action.data;
    case 'save/reset':
      return createInitialSave(save.settings);
    default:
      return save;
  }
}

/* ------------------------------------------------------------------ */
/* Sélecteurs                                                          */
/* ------------------------------------------------------------------ */

export type LevelStatus = 'completed' | 'in-progress' | 'available' | 'locked' | 'coming-soon';

export function progressOf(save: SaveData, levelId: LevelId): LevelProgress {
  return save.levels[levelId] ?? emptyLevelProgress();
}

export function isLevelCompleted(save: SaveData, levelId: LevelId): boolean {
  return save.levels[levelId]?.rewardClaimed === true;
}

export function isLevelUnlocked(save: SaveData, level: LevelDefinition): boolean {
  if (!level.content) return false;
  if (save.settings.unlockAll || level.order === 0) return true;
  const previous = LEVELS[level.order - 1];
  return previous ? isLevelCompleted(save, previous.id) : true;
}

export function levelStatus(save: SaveData, level: LevelDefinition): LevelStatus {
  if (isLevelCompleted(save, level.id)) return 'completed';
  if (!level.content) return 'coming-soon';
  if (!isLevelUnlocked(save, level)) return 'locked';
  const p = save.levels[level.id];
  if (p && (p.reached > 0 || p.conceptSeen > 0)) return 'in-progress';
  return 'available';
}

export function canAccessPhase(save: SaveData, levelId: LevelId, phase: PhaseId): boolean {
  return PHASE_INDEX[phase] <= progressOf(save, levelId).reached;
}

/** Phase par laquelle reprendre un niveau. */
export function resumePhase(save: SaveData, levelId: LevelId): PhaseId {
  const p = progressOf(save, levelId);
  if (p.rewardClaimed) return 'reward';
  return PHASES[Math.min(p.reached, PHASES.length - 1)] as PhaseId;
}

/** Le prochain niveau à jouer (ou le dernier débloqué si tout est fini / à venir). */
export function currentLevel(save: SaveData): LevelDefinition {
  for (const level of LEVELS) {
    if (!isLevelCompleted(save, level.id)) return level;
  }
  return LEVELS[LEVELS.length - 1] as LevelDefinition;
}

export function completedCount(save: SaveData): number {
  return LEVELS.filter((l) => isLevelCompleted(save, l.id)).length;
}

export function ownedPieces(save: SaveData) {
  return HARNESS_PIECES.filter((p) => save.pieces.includes(p.id));
}

export function ownedCards(save: SaveData) {
  return CARDS.filter((c) => save.cards.includes(c.id));
}
