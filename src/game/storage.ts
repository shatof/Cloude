import { CARDS, LEVELS } from '../content/levels';
import { LEVEL_IDS, PHASES, type LevelId } from '../content/types';
import { HARNESS_PIECES } from './harness';
import { MAX_BOX } from './review';
import {
  DEFAULT_SETTINGS,
  SAVE_VERSION,
  createInitialSave,
  emptyLevelProgress,
  type LevelProgress,
  type SaveData,
  type Settings,
  type TextSpeed,
} from './state';

/**
 * Sauvegarde dans le navigateur (localStorage).
 *
 * La clé API de la couche IA n'est JAMAIS stockée ici : elle vit dans un
 * emplacement séparé (voir src/ai/config.ts) et n'apparaît donc pas dans les exports.
 */

export const SAVE_KEY = 'gitgudai.save';
export const CORRUPT_BACKUP_KEY = 'gitgudai.save.corrompue';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function defaultStorage(): StorageLike | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function num(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, n));
}

function int(value: unknown, fallback: number, min: number, max: number): number {
  return Math.round(num(value, fallback, min, max));
}

const KNOWN_CARDS = new Set(CARDS.map((c) => c.id));
const KNOWN_PIECES = new Set(HARNESS_PIECES.map((p) => p.id));
const KNOWN_LEVELS = new Set<string>(LEVEL_IDS);
const TEXT_SPEEDS: TextSpeed[] = ['instant', 'fast', 'normal'];

function sanitizeLevel(raw: unknown, levelId: LevelId): LevelProgress {
  const base = emptyLevelProgress();
  if (!isRecord(raw)) return base;
  const level = LEVELS.find((l) => l.id === levelId);
  const conceptTotal = level?.content?.concept.length ?? 0;
  return {
    reached: int(raw.reached, 0, 0, PHASES.length - 1),
    conceptSeen: int(raw.conceptSeen, 0, 0, conceptTotal),
    minigameBest: num(raw.minigameBest, -1, -1, 1),
    bossBest: num(raw.bossBest, -1, -1, 1),
    bossAttempts: int(raw.bossAttempts, 0, 0, 1_000_000),
    rewardClaimed: raw.rewardClaimed === true,
  };
}

function sanitizeSettings(raw: unknown): Settings {
  if (!isRecord(raw)) return { ...DEFAULT_SETTINGS };
  return {
    textSpeed: TEXT_SPEEDS.includes(raw.textSpeed as TextSpeed) ? (raw.textSpeed as TextSpeed) : DEFAULT_SETTINGS.textSpeed,
    readableFont: raw.readableFont === true,
    textScale: num(raw.textScale, 1, 1, 1.3),
    crt: raw.crt === true,
    reduceMotion: raw.reduceMotion === true,
    sound: raw.sound === true,
    unlockAll: raw.unlockAll === true,
  };
}

function uniqueKnown(raw: unknown, known: Set<string>): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) if (typeof v === 'string' && known.has(v) && !out.includes(v)) out.push(v);
  return out;
}

/** Migrations successives des anciennes versions de sauvegarde (aucune pour l'instant). */
function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const version = typeof raw.version === 'number' ? raw.version : 0;
  if (version > SAVE_VERSION) {
    throw new Error('Cette sauvegarde vient d’une version plus récente de GitGudAI.');
  }
  // v0 → v1 : rien à transformer ; les champs manquants prennent leur valeur par défaut.
  return { ...raw, version: SAVE_VERSION };
}

/** Transforme n'importe quelle donnée en sauvegarde valide (champs inconnus ignorés). */
export function sanitizeSave(input: unknown): SaveData {
  if (!isRecord(input)) throw new Error('Format de sauvegarde invalide.');
  const raw = migrate(input);
  const save = createInitialSave(sanitizeSettings(raw.settings));

  if (isRecord(raw.xpLedger)) {
    for (const [key, value] of Object.entries(raw.xpLedger)) {
      if (typeof value === 'number' && Number.isFinite(value) && value > 0 && key.length < 120) {
        save.xpLedger[key] = Math.round(Math.min(value, 10_000));
      }
    }
  }

  if (isRecord(raw.levels)) {
    for (const [id, value] of Object.entries(raw.levels)) {
      if (KNOWN_LEVELS.has(id)) save.levels[id as LevelId] = sanitizeLevel(value, id as LevelId);
    }
  }

  save.cards = uniqueKnown(raw.cards, KNOWN_CARDS);
  save.pieces = uniqueKnown(raw.pieces, KNOWN_PIECES);

  if (isRecord(raw.review)) {
    const boxes: Record<string, number> = {};
    if (isRecord(raw.review.boxes)) {
      for (const [id, box] of Object.entries(raw.review.boxes)) {
        if (KNOWN_CARDS.has(id.split('#')[0] ?? '')) boxes[id] = int(box, 1, 1, MAX_BOX);
      }
    }
    const mastered = Array.isArray(raw.review.mastered)
      ? raw.review.mastered.filter((id): id is string => typeof id === 'string' && boxes[id] === MAX_BOX)
      : [];
    save.review = {
      session: int(raw.review.session, 0, 0, 1_000_000),
      boxes,
      mastered: [...new Set(mastered)],
    };
  }

  save.flags = { introSeen: isRecord(raw.flags) && raw.flags.introSeen === true };
  return save;
}

export interface LoadResult {
  save: SaveData;
  /** Message à afficher si la sauvegarde a dû être réparée ou réinitialisée. */
  notice?: string;
}

export function loadSave(storage: StorageLike | null = defaultStorage()): LoadResult {
  if (!storage) return { save: createInitialSave(), notice: 'Stockage indisponible : la progression ne sera pas sauvegardée.' };
  let text: string | null = null;
  try {
    text = storage.getItem(SAVE_KEY);
  } catch {
    return { save: createInitialSave(), notice: 'Stockage indisponible : la progression ne sera pas sauvegardée.' };
  }
  if (!text) return { save: createInitialSave() };
  try {
    return { save: sanitizeSave(JSON.parse(text)) };
  } catch {
    try {
      storage.setItem(CORRUPT_BACKUP_KEY, text);
    } catch {
      /* rien à faire */
    }
    return {
      save: createInitialSave(),
      notice: 'La sauvegarde était illisible : une copie a été mise de côté et une nouvelle partie commence.',
    };
  }
}

export function persistSave(save: SaveData, storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}

export function exportSave(save: SaveData, now: Date = new Date()): string {
  return JSON.stringify({ app: 'GitGudAI', exportedAt: now.toISOString(), ...save }, null, 2);
}

/** Lit un fichier exporté. Lève une erreur lisible si le contenu n'est pas une sauvegarde. */
export function parseImport(text: string): SaveData {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Ce fichier n’est pas du JSON valide.');
  }
  if (!isRecord(data) || (data.app !== undefined && data.app !== 'GitGudAI')) {
    throw new Error('Ce fichier ne ressemble pas à une sauvegarde GitGudAI.');
  }
  if (!('xpLedger' in data) && !('levels' in data)) {
    throw new Error('Ce fichier ne ressemble pas à une sauvegarde GitGudAI.');
  }
  return sanitizeSave(data);
}
