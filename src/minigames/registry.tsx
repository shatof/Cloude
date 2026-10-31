import type { ComponentType } from 'react';
import { LoopRunner } from './loopRunner/LoopRunner';
import type { MiniGameProps } from './shared';
import { TokenWorkshop } from './tokenWorkshop/TokenWorkshop';
import './minigames.css';

/**
 * Registre des mini-jeux. La clé est référencée par `minigame.id` dans le contenu d'un niveau.
 * Un mini-jeu reçoit `onFinish(score)` avec un score entre 0 et 1.
 */
export const MINIGAMES: Record<string, ComponentType<MiniGameProps>> = {
  'token-workshop': TokenWorkshop,
  'loop-runner': LoopRunner,
};
