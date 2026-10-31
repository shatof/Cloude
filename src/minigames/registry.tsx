import type { ComponentType } from 'react';
import { assemblyConfig } from './assembly/config';
import { conductorConfig } from './conductor/config';
import { contextSuitcaseConfig } from './contextSuitcase/config';
import { governanceConfig } from './governance/config';
import { injectionLabConfig } from './injectionLab/config';
import { configuredMiniGame } from './kit/rounds';
import { librarianConfig } from './librarian/config';
import { LoopRunner } from './loopRunner/LoopRunner';
import { projectLeadConfig } from './projectLead/config';
import { scratchpadConfig } from './scratchpad/config';
import type { MiniGameProps } from './shared';
import { switchboardConfig } from './switchboard/config';
import { testBenchConfig } from './testBench/config';
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
  'assembly-workshop': configuredMiniGame(assemblyConfig),
  conductor: configuredMiniGame(conductorConfig),
  switchboard: configuredMiniGame(switchboardConfig),
  'test-bench': configuredMiniGame(testBenchConfig),
  'injection-lab': configuredMiniGame(injectionLabConfig),
  governance: configuredMiniGame(governanceConfig),
};
