/**
 * Fournisseur Mistral AI, chargé à la demande (import dynamique depuis client.ts).
 *
 * L'API Mistral est une API REST JSON simple : quelques appels `fetch` suffisent,
 * sans SDK ni dépendance. La clé est celle de l'utilisateur, saisie dans les Réglages.
 * Aucun identifiant de modèle n'est codé en dur : la liste vient de GET /v1/models.
 *
 * Attention au CORS : voir mistralUrl.ts (relais local en développement).
 */
import type { AIConfig } from './config';
import { resolveMistralBaseUrl } from './mistralUrl';
import {
  AIError,
  extractJson,
  type AIProvider,
  type CompletionRequest,
  type JsonCompletionRequest,
  type ModelOption,
} from './types';

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const defaultFetch: FetchLike = (input, init) => globalThis.fetch(input, init);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Extrait un message lisible des différents formats d'erreur renvoyés par l'API. */
export function mistralErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === 'string' && body.trim()) return body.trim().slice(0, 300);
  if (!isRecord(body)) return fallback;
  const { message, detail } = body;
  if (typeof message === 'string' && message.trim()) return message.trim();
  if (isRecord(message)) return mistralErrorMessage(message, fallback);
  if (typeof detail === 'string' && detail.trim()) return detail.trim();
  if (Array.isArray(detail)) {
    const parts = detail
      .map((d) => (isRecord(d) && typeof d.msg === 'string' ? d.msg : null))
      .filter((m): m is string => Boolean(m));
    if (parts.length) return parts.join(' ; ');
  }
  return fallback;
}

export function mistralError(status: number, body: unknown): AIError {
  const message = mistralErrorMessage(body, `HTTP ${status}`);
  if (status === 401 || status === 403) return new AIError('auth', message);
  if (status === 429) return new AIError('rate', message);
  if (status === 502 || status === 503 || status === 504) {
    return new AIError('network', `le relais ou l’API Mistral ne répond pas (HTTP ${status}).`);
  }
  if (status === 400 || status === 404 || status === 422) return new AIError('bad-request', message);
  return new AIError('unknown', message);
}

async function callApi(
  fetchImpl: FetchLike,
  baseUrl: string,
  apiKey: string,
  path: string,
  init: { method: 'GET' | 'POST'; body?: unknown },
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetchImpl(`${baseUrl}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new AIError(
      'network',
      'appel impossible : réseau coupé, ou le navigateur a bloqué la requête (CORS). Utilise le relais intégré (npm run dev) ou indique l’adresse d’un relais dans les Réglages.',
    );
  }
  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    /* corps non JSON : on garde le texte brut */
  }
  if (!response.ok) throw mistralError(response.status, body);
  return body;
}

/** Le contenu d'un message est une chaîne, ou une liste de morceaux (« text », « thinking »…). */
export function mistralText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((chunk) => (isRecord(chunk) && chunk.type === 'text' && typeof chunk.text === 'string' ? chunk.text : ''))
    .join('');
}

interface ChatResult {
  text: string;
  finishReason: string;
}

export function createMistralProvider(config: AIConfig, fetchImpl: FetchLike = defaultFetch): AIProvider {
  const baseUrl = resolveMistralBaseUrl(config.baseUrl);

  const chat = async (request: CompletionRequest, responseFormat?: Record<string, unknown>): Promise<ChatResult> => {
    const body = {
      model: config.model,
      messages: [{ role: 'system', content: request.system }, ...request.messages.map((m) => ({ role: m.role, content: m.content }))],
      max_tokens: request.maxTokens ?? 4000,
      ...(responseFormat ? { response_format: responseFormat } : {}),
    };
    const data = await callApi(fetchImpl, baseUrl, config.apiKey, '/v1/chat/completions', { method: 'POST', body });
    const choice = isRecord(data) && Array.isArray(data.choices) ? data.choices[0] : undefined;
    if (!isRecord(choice)) throw new AIError('parse', 'réponse sans contenu');
    const message = isRecord(choice.message) ? choice.message : {};
    const finishReason = typeof choice.finish_reason === 'string' ? choice.finish_reason : '';
    if (finishReason === 'error') throw new AIError('unknown', 'le modèle a signalé une erreur');
    return { text: mistralText(message.content).trim(), finishReason };
  };

  return {
    name: 'Mistral AI',
    modelLabel: config.modelLabel || config.model,

    async complete(request) {
      const { text } = await chat(request);
      if (!text) throw new AIError('parse', 'réponse vide');
      return text;
    },

    async completeJson(request: JsonCompletionRequest) {
      // Le schéma est aussi décrit dans la consigne : la doc Mistral recommande de l'expliquer au modèle.
      const system = `${request.system}\n\nRéponds UNIQUEMENT avec un objet JSON valide qui respecte ce schéma :\n${JSON.stringify(request.schema)}`;
      const format = config.structured
        ? { type: 'json_schema', json_schema: { name: 'reponse', schema: request.schema, strict: true } }
        : { type: 'json_object' };
      const { text } = await chat({ ...request, system }, format);
      return extractJson(text);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Liste des modèles                                                   */
/* ------------------------------------------------------------------ */

interface RawModel {
  id: string;
  name: string;
  aliases: string[];
  chat: boolean;
  deprecated: boolean;
}

function readModel(value: unknown): RawModel | null {
  if (!isRecord(value) || typeof value.id !== 'string') return null;
  const capabilities = isRecord(value.capabilities) ? value.capabilities : {};
  return {
    id: value.id,
    name: typeof value.name === 'string' && value.name.trim() ? value.name.trim() : value.id,
    aliases: Array.isArray(value.aliases) ? value.aliases.filter((a): a is string => typeof a === 'string') : [],
    chat: capabilities.completion_chat === true,
    deprecated: Boolean(value.deprecation),
  };
}

/**
 * Garde les modèles de conversation non dépréciés, et un seul identifiant par modèle
 * (l'API liste souvent la version datée ET son alias « -latest »).
 */
export function selectChatModels(raw: unknown): ModelOption[] {
  const list = isRecord(raw) && Array.isArray(raw.data) ? raw.data : [];
  const models = list.map(readModel).filter((m): m is RawModel => Boolean(m && m.chat && !m.deprecated));
  const groups = new Map<string, RawModel[]>();
  for (const m of models) {
    const key = [m.id, ...m.aliases].sort()[0] as string;
    groups.set(key, [...(groups.get(key) ?? []), m]);
  }
  const chosen = [...groups.values()].map((group) => group.find((m) => m.id.endsWith('-latest')) ?? group[0]!);
  return chosen
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => ({
      id: m.id,
      label: m.name,
      // Sorties JSON structurées : prises en charge par les modèles de conversation actuels.
      structured: true,
      effort: false,
    }));
}

export async function listMistralModels(apiKey: string, baseUrl = '', fetchImpl: FetchLike = defaultFetch): Promise<ModelOption[]> {
  const data = await callApi(fetchImpl, resolveMistralBaseUrl(baseUrl), apiKey, '/v1/models', { method: 'GET' });
  return selectChatModels(data);
}
