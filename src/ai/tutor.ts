import { CARDS, LEVELS, getLevel } from '../content/levels';
import { GLOBAL_SUGGESTIONS, GLOBAL_TUTOR_ENTRIES } from '../content/tutorGlobal';
import type { LevelId, TutorEntry } from '../content/types';
import { getProvider } from './client';
import { UNKNOWN_ANSWER, findBestEntry } from './tutorFallback';
import { describeAiError, type AIProvider, type AIResult, type ChatTurn } from './types';

/**
 * Usage n° 1 de la couche IA : Bob tuteur.
 * Avec un modèle : réponse sur mesure, ancrée dans le contenu du niveau.
 * Sans modèle (ou en cas d'erreur) : réponse prédéfinie la plus proche.
 */

export interface TutorContext {
  /** Niveau en cours (les réponses de ce niveau passent en premier). */
  levelId?: LevelId;
  /** Niveaux déjà commencés ou terminés (leurs réponses sont aussi disponibles). */
  knownLevelIds: LevelId[];
  /** Cartes débloquées (pour le contexte du modèle). */
  cardIds: string[];
  history: ChatTurn[];
}

export interface TutorReply {
  text: string;
  matchedId?: string;
}

export interface Suggestion {
  id: string;
  question: string;
}

export function tutorEntries(ctx: Pick<TutorContext, 'levelId' | 'knownLevelIds'>): TutorEntry[] {
  const ordered: LevelId[] = [];
  if (ctx.levelId) ordered.push(ctx.levelId);
  for (const id of ctx.knownLevelIds) if (!ordered.includes(id)) ordered.push(id);
  const entries: TutorEntry[] = [];
  for (const id of ordered) entries.push(...(getLevel(id)?.content?.tutor.entries ?? []));
  return [...entries, ...GLOBAL_TUTOR_ENTRIES];
}

export function tutorSuggestions(ctx: Pick<TutorContext, 'levelId' | 'knownLevelIds'>): Suggestion[] {
  const level = ctx.levelId ? getLevel(ctx.levelId) : undefined;
  const ids = level?.content ? level.content.tutor.suggestions : GLOBAL_SUGGESTIONS;
  const entries = tutorEntries(ctx);
  return ids
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is TutorEntry => Boolean(e))
    .map((e) => ({ id: e.id, question: e.question }));
}

export function answerOffline(question: string, ctx: Pick<TutorContext, 'levelId' | 'knownLevelIds'>): TutorReply {
  const entry = findBestEntry(question, tutorEntries(ctx));
  return entry ? { text: entry.answer, matchedId: entry.id } : { text: UNKNOWN_ANSWER };
}

/** Réponse à une question suggérée : toujours la réponse de référence, sans appel réseau. */
export function answerSuggestion(id: string, ctx: Pick<TutorContext, 'levelId' | 'knownLevelIds'>): TutorReply | null {
  const entry = tutorEntries(ctx).find((e) => e.id === id);
  return entry ? { text: entry.answer, matchedId: entry.id } : null;
}

export function buildTutorSystemPrompt(ctx: TutorContext): string {
  const level = ctx.levelId ? getLevel(ctx.levelId) : undefined;
  const parcours = LEVELS.map((l) => {
    const done = ctx.knownLevelIds.includes(l.id) ? ' (vu)' : '';
    return `- Niveau ${l.badge} : ${l.title}. ${l.concept}${done}`;
  }).join('\n');
  const levelBlock = level?.content
    ? [
        `Niveau en cours : ${level.badge}, « ${level.title} ».`,
        ...level.content.concept.map(
          (s) => `## ${s.title}\n${s.body}\nAnalogie : ${s.analogy.title}. ${s.analogy.text}\nÀ retenir : ${s.takeaway}`,
        ),
      ].join('\n\n')
    : 'L’apprenant est sur l’écran d’accueil (pas de niveau en cours).';
  const cards = CARDS.filter((c) => ctx.cardIds.includes(c.id))
    .map((c) => `- ${c.term} : ${c.definition}`)
    .join('\n');

  return [
    'Tu es Bob Morris, la mascotte de GitGudAI, un jeu pour apprendre l’IA agentique. Tu es un agent : ton modèle (ton « cerveau ») ne change jamais ; ce sont les pièces de ton harnais qui te rendent meilleur.',
    'Ton rôle : tuteur. L’apprenant est un étudiant en informatique qui connaît le RAG et le fonctionnement global des LLM, mais de façon superficielle.',
    'Règles :\n- Réponds en français, en 120 mots maximum, sur un ton ludique mais rigoureux.\n- Aucun jargon sans explication ; propose une analogie concrète quand c’est utile.\n- Appuie-toi d’abord sur le contenu du niveau ci-dessous. Si la question sort du programme, réponds brièvement et indique à quel niveau du parcours le sujet sera traité.\n- Ne prétends jamais que ton cerveau a changé : seuls ton harnais et tes outils évoluent.\n- Si tu n’es pas sûr d’un fait, dis-le plutôt que d’inventer.\n- Texte simple, sans titres ni tableaux. Tu peux utiliser **gras** pour un mot clé.',
    `Parcours du jeu :\n${parcours}`,
    levelBlock,
    cards ? `Cartes de glossaire débloquées :\n${cards}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function askTutor(
  question: string,
  ctx: TutorContext,
  providerOverride?: AIProvider | null,
): Promise<AIResult<TutorReply>> {
  const provider = providerOverride === undefined ? await getProvider() : providerOverride;
  if (!provider) return { source: 'fallback', data: answerOffline(question, ctx) };
  // L'API exige que la conversation commence par un message de l'utilisateur.
  const history = ctx.history.slice(-10);
  while (history[0]?.role === 'assistant') history.shift();
  try {
    const text = await provider.complete({
      system: buildTutorSystemPrompt(ctx),
      messages: [...history, { role: 'user', content: question }],
      maxTokens: 4000,
      effort: 'low',
    });
    if (!text) throw new Error('réponse vide');
    return { source: 'model', data: { text } };
  } catch (error) {
    return {
      source: 'fallback',
      data: answerOffline(question, ctx),
      notice: `${describeAiError(error)} Réponse prédéfinie à la place.`,
    };
  }
}
