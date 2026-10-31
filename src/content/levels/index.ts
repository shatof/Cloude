import type { GlossaryCard, LevelDefinition, LevelId, ZoneId } from '../types';
import { level0, level0Cards } from './level0';
import { level1, level1Cards } from './level1';
import { level2, level2Cards } from './level2';
import { level3, level3Cards } from './level3';
import { level4, level4Cards } from './level4';
import { level5, level5Cards } from './level5';
import { level6, level6Cards } from './level6';
import { level7, level7Cards } from './level7';
import { level8, level8Cards } from './level8';
import { level9, level9Cards } from './level9';
import { level10, level10Cards } from './level10';

/**
 * Registre des niveaux, dans l'ordre du parcours.
 *
 * Un niveau sans `content` s'affiche sur la carte (titre + concept) avec la mention
 * « contenu à venir ». Pour le remplir : créer `levelN.ts` sur le modèle de `level1.ts`,
 * puis remplacer l'entrée correspondante ci-dessous (voir docs/AJOUTER-UN-NIVEAU.md).
 */
function upcoming(
  id: LevelId,
  order: number,
  badge: string,
  title: string,
  shortTitle: string,
  concept: string,
  zone: ZoneId,
  harnessPieceId: string,
): LevelDefinition {
  return { id, order, badge, title, shortTitle, concept, zone, harnessPieceId };
}

export const LEVELS: LevelDefinition[] = [
  level0,
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  upcoming(
    'l11',
    11,
    '11',
    'Sécurité des agents',
    'Sécurité',
    'Prompt injection directe et indirecte, promptware, memory poisoning, identité d’agent, moindre privilège. Un contenu non fiable n’hérite jamais de l’autorité de l’utilisateur.',
    'citadelle',
    'prompt-shield',
  ),
  upcoming(
    'l12',
    12,
    '12',
    'Gouvernance et frontière',
    'Gouvernance',
    'Human-in-the-loop, interruptibilité (kill switch), EU AI Act, commerce agentique.',
    'citadelle',
    'kill-switch',
  ),
  upcoming(
    'final',
    13,
    'F',
    'Boss final : l’architecte',
    'Boss final',
    'Concevoir le harnais complet d’un agent pour un cas réel, puis recevoir un retour détaillé.',
    'sommet',
    'architect-cape',
  ),
];

export const ZONES: Record<ZoneId, { name: string }> = {
  fondations: { name: 'Les Fondations' },
  atelier: { name: 'L’Atelier' },
  bibliotheque: { name: 'La Bibliothèque' },
  forge: { name: 'La Forge' },
  archipel: { name: 'L’Archipel' },
  observatoire: { name: 'L’Observatoire' },
  citadelle: { name: 'La Citadelle' },
  sommet: { name: 'Le Sommet' },
};

/** Toutes les cartes de glossaire, dans l'ordre du parcours. */
export const CARDS: GlossaryCard[] = [...level0Cards, ...level1Cards, ...level2Cards, ...level3Cards, ...level4Cards, ...level5Cards, ...level6Cards, ...level7Cards, ...level8Cards, ...level9Cards, ...level10Cards];

const LEVEL_BY_ID = new Map(LEVELS.map((l) => [l.id, l]));
const CARD_BY_ID = new Map(CARDS.map((c) => [c.id, c]));

export function getLevel(id: string): LevelDefinition | undefined {
  return LEVEL_BY_ID.get(id as LevelId);
}

export function getCard(id: string): GlossaryCard | undefined {
  return CARD_BY_ID.get(id);
}

export function cardsForLevel(levelId: LevelId): GlossaryCard[] {
  return CARDS.filter((c) => c.levelId === levelId);
}

export function isPlayable(level: LevelDefinition): boolean {
  return level.content !== undefined;
}
