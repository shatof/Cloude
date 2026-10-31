import type { ComponentType } from 'react';
import type { RichText } from '../../content/types';

/**
 * Manches configurables : un mini-jeu se décrit par des données (voir MiniGameSequence).
 * Chaque manche renvoie un score entre 0 et 1 ; le mini-jeu fait la moyenne.
 */

interface BaseRound {
  /** Nom court affiché dans l'en-tête des manches. */
  title: string;
  instructions: RichText;
}

export interface ChoiceQuestion {
  id: string;
  /** Mise en situation (texte enrichi). */
  context?: RichText;
  /** Bloc de code ou de données affiché tel quel (schéma, appel d'outil, Agent Card…). */
  code?: string;
  prompt: string;
  options: { id: string; text: string; correct?: boolean; feedback: string }[];
  /** Garde l'ordre des options (ex. « Étape 1 », « Étape 2 »…) au lieu de les mélanger. */
  ordered?: boolean;
  /** À retenir, affiché après la réponse. */
  explanation?: string;
}

export interface ChoiceRoundSpec extends BaseRound {
  kind: 'choice';
  questions: ChoiceQuestion[];
}

export interface SortRoundSpec extends BaseRound {
  kind: 'sort';
  bins: { id: string; label: string }[];
  items: { id: string; text: string; bin: string; why: string }[];
}

export interface OrderRoundSpec extends BaseRound {
  kind: 'order';
  /** Éléments dans le BON ordre (ils sont mélangés à l'affichage). */
  items: { id: string; text: string }[];
  explanation: RichText;
}

export interface PickRoundSpec extends BaseRound {
  kind: 'pick';
  context?: RichText;
  code?: string;
  prompt: string;
  items: { id: string; text: string; correct: boolean; why: string; meta?: string }[];
}

export interface BudgetRoundSpec extends BaseRound {
  kind: 'budget';
  task: RichText;
  budget: number;
  unit: string;
  items: { id: string; text: string; cost: number; value: number; why: string }[];
}

export interface CustomRoundSpec {
  kind: 'custom';
  title: string;
  component: ComponentType<{ onDone: (score: number) => void }>;
}

export type RoundSpec = ChoiceRoundSpec | SortRoundSpec | OrderRoundSpec | PickRoundSpec | BudgetRoundSpec | CustomRoundSpec;

export interface MiniGameConfig {
  title: string;
  rounds: RoundSpec[];
}
