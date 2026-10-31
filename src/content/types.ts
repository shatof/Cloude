/**
 * Types du contenu pédagogique.
 *
 * Chaque niveau suit le même format en 5 phases :
 *   1. problem  — la mascotte échoue à une tâche concrète
 *   2. concept  — le concept qui résout le problème (3 écrans max, une analogie par concept)
 *   3. minigame — un mini-jeu où l'on manipule le concept
 *   4. boss     — un quiz expliqué
 *   5. reward   — pièce de harnais + cartes de glossaire + XP
 *
 * Pour ajouter un niveau : voir docs/AJOUTER-UN-NIVEAU.md.
 */

export const LEVEL_IDS = [
  'l0',
  'l1',
  'l2',
  'l3',
  'l4',
  'l5',
  'l6',
  'l7',
  'l8',
  'l9',
  'l10',
  'l11',
  'l12',
  'final',
] as const;

export type LevelId = (typeof LEVEL_IDS)[number];

export const PHASES = ['problem', 'concept', 'minigame', 'boss', 'reward'] as const;
export type PhaseId = (typeof PHASES)[number];

export const PHASE_LABELS: Record<PhaseId, string> = {
  problem: 'Problème',
  concept: 'Concept',
  minigame: 'Mini-jeu',
  boss: 'Boss',
  reward: 'Récompense',
};

export type ZoneId =
  | 'fondations'
  | 'atelier'
  | 'bibliotheque'
  | 'forge'
  | 'archipel'
  | 'observatoire'
  | 'citadelle'
  | 'sommet';

export type BobMood = 'neutral' | 'happy' | 'sad' | 'confused' | 'thinking' | 'surprised' | 'proud';

/** Texte enrichi minimal : **gras**, *italique*, `code`. Les paragraphes sont séparés par une ligne vide. */
export type RichText = string;

export interface LevelDefinition {
  id: LevelId;
  /** Position sur la carte (0 → 13). */
  order: number;
  /** Étiquette courte affichée sur la carte : « 0 », « 1 »… « F » pour le boss final. */
  badge: string;
  title: string;
  /** Titre très court pour la carte. */
  shortTitle: string;
  /** Résumé du concept en une phrase (affiché même quand le contenu est à venir). */
  concept: string;
  zone: ZoneId;
  harnessPieceId: string;
  /** Absent = niveau « à venir ». */
  content?: LevelContent;
}

export interface LevelContent {
  problem: ProblemScene;
  /** 1 à 3 écrans. */
  concept: ConceptScreen[];
  minigame: MiniGameSpec;
  boss: BossSpec;
  reward: RewardSpec;
  tutor: TutorFaq;
}

export type Speaker = 'user' | 'bob' | 'narrator';

export type ProblemStep =
  | { kind: 'say'; speaker: Speaker; text: string; mood?: BobMood; who?: string }
  | { kind: 'fail'; label: string; detail: string }
  | { kind: 'gap'; text: string };

export interface ProblemScene {
  mission: { title: string; brief: string };
  steps: ProblemStep[];
  /** Bilan affiché quand la scène est terminée. */
  summary: RichText;
  /** Transition vers le concept. */
  question: string;
}

export interface ConceptScreen {
  id: string;
  title: string;
  body: RichText;
  analogy: { title: string; text: RichText };
  takeaway: string;
  /** Clé d'un composant d'illustration (src/levels/illustrations). */
  illustration?: string;
}

export interface MiniGameSpec {
  /** Clé du composant de mini-jeu (src/minigames/registry.tsx). */
  id: string;
  title: string;
  intro: RichText;
  /** XP pour un score parfait. */
  xp: number;
}

export interface QuizChoice {
  id: string;
  text: string;
  correct?: boolean;
  /** Explication de ce choix précis (pourquoi c'est juste ou faux). */
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  /** Ce qu'il faut retenir, affiché après chaque réponse. */
  explanation: string;
}

export interface BossSpec {
  name: string;
  /** Clé du sprite de boss (src/sprites/bosses.ts). */
  sprite: string;
  intro: string;
  victory: string;
  defeat: string;
  /** Part minimale de bonnes réponses pour gagner (0 < ratio ≤ 1). */
  passRatio: number;
  /** XP pour un sans-faute. */
  xp: number;
  questions: QuizQuestion[];
}

export interface RewardSpec {
  /** XP accordée en récupérant la récompense. */
  xp: number;
  cardIds: string[];
  /** Réplique de Bob en recevant sa pièce. */
  message: string;
}

export interface TutorEntry {
  id: string;
  question: string;
  /** Mots-clés (sans accents, en minuscules) utilisés par le tuteur hors-ligne. */
  keywords: string[];
  answer: string;
}

export interface TutorFaq {
  /** Identifiants d'entrées proposées comme questions suggérées. */
  suggestions: string[];
  entries: TutorEntry[];
}

export type CardRarity = 'commune' | 'rare' | 'épique' | 'légendaire';

export interface GlossaryCard {
  id: string;
  term: string;
  levelId: LevelId;
  definition: string;
  /** Analogie SANS le terme lui-même (elle sert aussi de question de révision). */
  analogy: string;
  example: string;
  pitfall: { myth: string; truth: string };
  rarity: CardRarity;
  /** Clé d'icône (src/sprites/icons.ts). */
  icon: string;
}
