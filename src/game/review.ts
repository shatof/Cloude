import type { GlossaryCard } from '../content/types';
import { seededShuffle } from './random';
import type { ReviewState } from './state';

/**
 * Mode révision : flashcards générées à partir des cartes de glossaire,
 * planifiées avec des boîtes de Leitner (déterministes, comptées en sessions).
 *
 *   boîte 1 : à chaque session
 *   boîte 2 : une session sur 2
 *   boîte 3 : une session sur 4
 *   boîte 4 : une session sur 8
 *   boîte 5 : maîtrisée (une session sur 16)
 */

export type FlashcardKind = 'definition' | 'analogy' | 'myth';

export interface Flashcard {
  id: string;
  cardId: string;
  kind: FlashcardKind;
  front: string;
  back: string;
}

export const MAX_BOX = 5;
export const SESSION_SIZE = 12;

export const KIND_LABELS: Record<FlashcardKind, string> = {
  definition: 'Définition',
  analogy: 'Analogie',
  myth: 'Idée reçue',
};

export function flashcardsForCard(card: GlossaryCard): Flashcard[] {
  return [
    {
      id: `${card.id}#definition`,
      cardId: card.id,
      kind: 'definition',
      front: `Que désigne « ${card.term} » ?`,
      back: card.definition,
    },
    {
      id: `${card.id}#analogy`,
      cardId: card.id,
      kind: 'analogy',
      front: `Quel concept se cache derrière cette analogie ?\n\n« ${card.analogy} »`,
      back: `${card.term}. ${card.definition}`,
    },
    {
      id: `${card.id}#myth`,
      cardId: card.id,
      kind: 'myth',
      front: `Vrai ou faux ?\n\n« ${card.pitfall.myth} »`,
      back: `Faux. ${card.pitfall.truth}`,
    },
  ];
}

export function generateFlashcards(cards: readonly GlossaryCard[]): Flashcard[] {
  return cards.flatMap(flashcardsForCard);
}

export function boxOf(review: ReviewState, flashcardId: string): number {
  const box = review.boxes[flashcardId];
  return box && box >= 1 && box <= MAX_BOX ? box : 1;
}

/** Une flashcard est due si le numéro de session est un multiple de 2^(boîte-1). */
export function isDue(box: number, session: number): boolean {
  const period = 2 ** (Math.min(Math.max(box, 1), MAX_BOX) - 1);
  return session % period === 0;
}

/** Flashcards dues pour la session en cours, des moins sues aux mieux sues. */
export function buildSession(
  flashcards: readonly Flashcard[],
  review: ReviewState,
  limit: number = SESSION_SIZE,
): Flashcard[] {
  return flashcards
    .map((f, order) => ({ f, order, box: boxOf(review, f.id) }))
    .filter(({ box }) => isDue(box, review.session))
    .sort((a, b) => a.box - b.box || a.order - b.order)
    .slice(0, limit)
    .map(({ f }) => f);
}

/** Session libre : tout le paquet, mélangé de façon déterministe. Ne change pas les boîtes. */
export function buildFreeSession(
  flashcards: readonly Flashcard[],
  seed: number | string,
  limit: number = SESSION_SIZE,
): Flashcard[] {
  return seededShuffle(flashcards, seed).slice(0, limit);
}

export function applyReviewAnswer(
  review: ReviewState,
  flashcardId: string,
  known: boolean,
): { review: ReviewState; masteredNow: boolean } {
  const current = boxOf(review, flashcardId);
  const box = known ? Math.min(MAX_BOX, current + 1) : 1;
  const alreadyMastered = review.mastered.includes(flashcardId);
  const masteredNow = box === MAX_BOX && !alreadyMastered;
  return {
    review: {
      ...review,
      boxes: { ...review.boxes, [flashcardId]: box },
      mastered: masteredNow ? [...review.mastered, flashcardId] : review.mastered,
    },
    masteredNow,
  };
}

export function boxDistribution(flashcards: readonly Flashcard[], review: ReviewState): number[] {
  const counts = new Array<number>(MAX_BOX).fill(0);
  for (const f of flashcards) {
    const box = boxOf(review, f.id);
    counts[box - 1] = (counts[box - 1] ?? 0) + 1;
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/* Défi éclair : QCM « définition → terme » généré depuis les cartes   */
/* ------------------------------------------------------------------ */

export interface QuickQuestion {
  cardId: string;
  prompt: string;
  options: { cardId: string; label: string }[];
  answerId: string;
}

export const QUICK_MIN_CARDS = 3;

export function buildQuickQuiz(
  cards: readonly GlossaryCard[],
  seed: number | string,
  count = 6,
): QuickQuestion[] {
  if (cards.length < QUICK_MIN_CARDS) return [];
  const optionCount = Math.min(4, cards.length);
  const picked = seededShuffle(cards, `${seed}:pick`).slice(0, Math.min(count, cards.length));
  return picked.map((card, i) => {
    const distractors = seededShuffle(
      cards.filter((c) => c.id !== card.id),
      `${seed}:d:${i}`,
    ).slice(0, optionCount - 1);
    const options = seededShuffle([card, ...distractors], `${seed}:o:${i}`).map((c) => ({
      cardId: c.id,
      label: c.term,
    }));
    return { cardId: card.id, prompt: card.definition, options, answerId: card.id };
  });
}
