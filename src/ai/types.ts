/**
 * Couche « IA réelle » : contrat commun.
 *
 * Le reste du jeu ne parle jamais directement à un fournisseur : il appelle les
 * services de src/ai (tuteur, évaluation du boss final, labo d'injection), qui
 * utilisent un modèle s'il est connecté, et sinon des réponses prédéfinies.
 */

export type Effort = 'low' | 'medium' | 'high';

export interface ModelOption {
  id: string;
  label: string;
  /** Le modèle accepte-t-il une sortie JSON contrainte par schéma ? */
  structured: boolean;
  /** Le modèle accepte-t-il le paramètre d'effort ? */
  effort: boolean;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  system: string;
  messages: ChatTurn[];
  maxTokens?: number;
  effort?: Effort;
}

export interface JsonCompletionRequest extends CompletionRequest {
  /** Schéma JSON (sous-ensemble compatible « structured outputs »). */
  schema: Record<string, unknown>;
}

export interface AIProvider {
  readonly name: string;
  readonly modelLabel: string;
  complete(request: CompletionRequest): Promise<string>;
  completeJson(request: JsonCompletionRequest): Promise<unknown>;
}

export type AISource = 'model' | 'fallback';

export interface AIResult<T> {
  source: AISource;
  data: T;
  /** Explication affichée quand on a dû basculer sur les réponses prédéfinies. */
  notice?: string;
}

export type AIErrorKind = 'refusal' | 'auth' | 'network' | 'rate' | 'bad-request' | 'parse' | 'unknown';

export class AIError extends Error {
  readonly kind: AIErrorKind;
  constructor(kind: AIErrorKind, message: string) {
    super(message);
    this.name = 'AIError';
    this.kind = kind;
  }
}

export function describeAiError(error: unknown): string {
  if (error instanceof AIError) {
    switch (error.kind) {
      case 'refusal':
        return 'Le modèle a décliné la demande.';
      case 'auth':
        return 'Clé API refusée : vérifie-la dans les Réglages.';
      case 'network':
        return 'Impossible de joindre le modèle (réseau).';
      case 'rate':
        return 'Trop de requêtes pour le moment.';
      case 'bad-request':
        return `Requête refusée par l’API : ${error.message}`;
      case 'parse':
        return 'Réponse du modèle illisible.';
      default:
        return error.message || 'Erreur inconnue du modèle.';
    }
  }
  return error instanceof Error ? error.message : 'Erreur inconnue du modèle.';
}

/** Extrait le premier objet JSON d'un texte (quand le modèle ajoute du texte autour). */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new AIError('parse', 'Aucun objet JSON dans la réponse.');
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new AIError('parse', 'JSON invalide dans la réponse.');
  }
}
