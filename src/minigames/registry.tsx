import type { ComponentType } from 'react';
import { contextSuitcaseConfig } from './contextSuitcase/config';
import { configuredMiniGame } from './kit/rounds';
import { librarianConfig } from './librarian/config';
import { LoopRunner } from './loopRunner/LoopRunner';
import { projectLeadConfig } from './projectLead/config';
import { scratchpadConfig } from './scratchpad/config';
import type { MiniGameProps } from './shared';
import { TokenWorkshop } from './tokenWorkshop/TokenWorkshop';
import { toolWorkshopConfig } from './toolWorkshop/config';
import './minigames.css';

/**
 * Registre des mini-jeux. La clé est référencée par `minigame.id` dans le contenu d'un niveau.
 * Un mini-jeu reçoit `onFinish(score)` avec un score entre 0 et 1.
 */
export const MINIGAMES: Record<string, ComponentType<MiniGameProps>> = {
  'token-workshop': TokenWorkshop,
  'loop-runner': LoopRunner,
  'tool-workshop': configuredMiniGame(toolWorkshopConfig),
  scratchpad: configuredMiniGame(scratchpadConfig),
  'project-lead': configuredMiniGame(projectLeadConfig),
  librarian: configuredMiniGame(librarianConfig),
  'context-suitcase': configuredMiniGame(contextSuitcaseConfig),
};
