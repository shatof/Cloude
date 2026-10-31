import type { MiniGameConfig } from '../kit/types';
import { ArchitectRound } from './ArchitectRound';

/** Le boss final n'a qu'une seule « manche » : l'épreuve d'architecte. */
export const architectConfig: MiniGameConfig = {
  title: 'L’épreuve de l’architecte',
  rounds: [{ kind: 'custom', title: 'Conçois le harnais', component: ArchitectRound }],
};
