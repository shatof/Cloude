import type { TutorEntry } from '../content/types';

/**
 * Tuteur hors-ligne : retrouve la réponse prédéfinie la plus proche de la question.
 * Entièrement déterministe (aucun hasard, aucun réseau).
 */

const STOPWORDS = new Set(
  (
    'le la les un une des de du d l et ou en a au aux est c ce cet cette ces qui que qu quoi quel quelle quels quelles ' +
    'comment pourquoi quand ou est ca il elle on je j tu t nous vous ils elles me m te se s mon ma mes ton ta tes son sa ses ' +
    'pour par sur dans avec sans pas ne n plus moins tres bien y avoir etre fait faire peut peux veut vraiment donc alors ' +
    'cest si sa leur leurs moi toi lui eux entre comme mais aussi tout tous toute toutes chose truc dire explique expliquer ' +
    'bob stp svp merci bonjour salut hello oui non'
  ).split(/\s+/),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

function keywordScore(keyword: string, tokens: string[], normalizedQuestion: string): number {
  const kw = normalize(keyword);
  if (!kw) return 0;
  if (kw.includes(' ')) return normalizedQuestion.includes(kw) ? 3 : 0;
  if (tokens.includes(kw)) return 3;
  if (kw.length >= 5 && tokens.some((t) => t.length >= 5 && (t.startsWith(kw) || kw.startsWith(t)))) return 2;
  return 0;
}

export function scoreEntry(entry: TutorEntry, question: string): number {
  const tokens = tokenize(question);
  if (tokens.length === 0) return 0;
  const normalizedQuestion = ` ${normalize(question)} `;
  let score = 0;
  for (const kw of entry.keywords) score += keywordScore(kw, tokens, normalizedQuestion);
  const entryTokens = new Set(tokenize(entry.question));
  for (const t of tokens) if (entryTokens.has(t)) score += 1;
  return score;
}

export const MIN_SCORE = 3;

/** Meilleure entrée (la première en cas d'égalité), ou null si rien n'est assez proche. */
export function findBestEntry(question: string, entries: readonly TutorEntry[]): TutorEntry | null {
  let best: TutorEntry | null = null;
  let bestScore = 0;
  for (const entry of entries) {
    const s = scoreEntry(entry, question);
    if (s > bestScore) {
      best = entry;
      bestScore = s;
    }
  }
  return bestScore >= MIN_SCORE ? best : null;
}

export const UNKNOWN_ANSWER =
  'Je n’ai pas de réponse toute prête à cette question : en mode simulé, je ne connais que les questions du cours. Essaie une question suggérée, reformule avec un mot-clé (token, agent, boucle, harnais…), ou connecte un vrai modèle dans les Réglages pour une réponse sur mesure.';
