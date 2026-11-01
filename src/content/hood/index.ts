import type { UnderTheHood } from '../types';
import { HOOD_ARCHIPEL } from './archipel';
import { HOOD_ATELIER } from './atelier';
import { HOOD_BIBLIOTHEQUE } from './bibliotheque';
import { HOOD_CITADELLE } from './citadelle';
import { HOOD_FONDATIONS } from './fondations';
import { HOOD_FORGE } from './forge';
import { HOOD_OBSERVATOIRE } from './observatoire';
import { HOOD_SOMMET } from './sommet';

/**
 * Registre « Sous le capot », par écran de concept.
 * Clé : `${idNiveau}:${idEcran}` (ex. « l2:tool-definition »).
 */
export const HOOD: Record<string, UnderTheHood> = {
  ...HOOD_FONDATIONS,
  ...HOOD_ATELIER,
  ...HOOD_BIBLIOTHEQUE,
  ...HOOD_FORGE,
  ...HOOD_ARCHIPEL,
  ...HOOD_OBSERVATOIRE,
  ...HOOD_CITADELLE,
  ...HOOD_SOMMET,
};

export function getHood(levelId: string, screenId: string): UnderTheHood | undefined {
  return HOOD[`${levelId}:${screenId}`];
}
