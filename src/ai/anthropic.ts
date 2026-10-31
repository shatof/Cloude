/**
 * Fournisseur Anthropic (SDK officiel), chargé à la demande.
 *
 * Ce module n'est importé que dynamiquement (voir client.ts) : sans modèle connecté,
 * le SDK n'est même pas téléchargé par le navigateur.
 *
 * La clé API est celle de l'utilisateur, saisie dans les Réglages : l'appel part
 * directement du navigateur vers l'API (option `dangerouslyAllowBrowser`).
 * Aucun identifiant de modèle n'est codé en dur : la liste vient de l'API Models.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { AIConfig } from './config';
import {
  AIError,
  extractJson,
  type AIProvider,
  type CompletionRequest,
  type JsonCompletionRequest,
  type ModelOption,
} from './types';

function client(apiKey: string): Anthropic {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1, timeout: 90_000 });
}

function toAiError(error: unknown): AIError {
  if (error instanceof AIError) return error;
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return new AIError('auth', error.message);
  }
  if (error instanceof Anthropic.RateLimitError) return new AIError('rate', error.message);
  if (error instanceof Anthropic.NotFoundError) return new AIError('bad-request', 'modèle introuvable pour cette clé.');
  if (error instanceof Anthropic.BadRequestError) return new AIError('bad-request', error.message);
  if (error instanceof Anthropic.APIConnectionError) return new AIError('network', error.message);
  if (error instanceof Anthropic.APIError) return new AIError('unknown', error.message);
  return new AIError('unknown', error instanceof Error ? error.message : String(error));
}

function textOf(message: Anthropic.Message): string {
  if (message.stop_reason === 'refusal') throw new AIError('refusal', 'refus du modèle');
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();
}

export function createAnthropicProvider(config: AIConfig): AIProvider {
  const api = client(config.apiKey);

  const baseParams = (request: CompletionRequest) => ({
    model: config.model,
    max_tokens: request.maxTokens ?? 8000,
    system: request.system,
    messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return {
    name: 'Anthropic',
    modelLabel: config.modelLabel || config.model,

    async complete(request) {
      try {
        const message = await api.messages.create({
          ...baseParams(request),
          ...(config.effort && request.effort ? { output_config: { effort: request.effort } } : {}),
        });
        return textOf(message);
      } catch (error) {
        throw toAiError(error);
      }
    },

    async completeJson(request: JsonCompletionRequest) {
      try {
        if (config.structured) {
          const message = await api.messages.create({
            ...baseParams(request),
            output_config: {
              format: { type: 'json_schema', schema: request.schema },
              ...(config.effort && request.effort ? { effort: request.effort } : {}),
            },
          });
          return extractJson(textOf(message));
        }
        // Modèle sans sortie structurée : on demande le JSON par consigne, puis on l'extrait.
        const message = await api.messages.create({
          ...baseParams(request),
          system: `${request.system}\n\nRéponds UNIQUEMENT avec un objet JSON valide qui respecte ce schéma :\n${JSON.stringify(request.schema)}`,
          ...(config.effort && request.effort ? { output_config: { effort: request.effort } } : {}),
        });
        return extractJson(textOf(message));
      } catch (error) {
        throw toAiError(error);
      }
    },
  };
}

/** Liste les modèles accessibles avec cette clé (les plus récents d'abord). */
export async function listAnthropicModels(apiKey: string): Promise<ModelOption[]> {
  try {
    const out: ModelOption[] = [];
    for await (const model of client(apiKey).models.list()) {
      out.push({
        id: model.id,
        label: model.display_name || model.id,
        structured: model.capabilities?.structured_outputs?.supported ?? false,
        effort: model.capabilities?.effort?.supported ?? false,
      });
    }
    return out;
  } catch (error) {
    throw toAiError(error);
  }
}
