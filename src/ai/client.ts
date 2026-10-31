import { isAiConfigured, loadAiConfig, type AIConfig, type ProviderId } from './config';
import { describeAiError, type AIProvider, type ModelOption } from './types';

/**
 * Point d'entrée vers le modèle. Le fournisseur est chargé dynamiquement
 * (le SDK reste hors du paquet principal tant qu'aucun modèle n'est connecté).
 */

let cached: { key: string; provider: AIProvider } | null = null;

function cacheKey(config: AIConfig): string {
  return [config.provider, config.apiKey, config.model, config.structured, config.effort, config.baseUrl].join('|');
}

/** Chaque fournisseur vit dans son propre module, chargé seulement s'il est utilisé. */
async function createProvider(config: AIConfig): Promise<AIProvider> {
  if (config.provider === 'mistral') {
    const { createMistralProvider } = await import('./mistral');
    return createMistralProvider(config);
  }
  const { createAnthropicProvider } = await import('./anthropic');
  return createAnthropicProvider(config);
}

export async function getProvider(config: AIConfig = loadAiConfig()): Promise<AIProvider | null> {
  if (!isAiConfigured(config)) return null;
  const key = cacheKey(config);
  if (cached?.key === key) return cached.provider;
  const provider = await createProvider(config);
  cached = { key, provider };
  return provider;
}

export async function listModels(provider: Exclude<ProviderId, 'none'>, apiKey: string, baseUrl = ''): Promise<ModelOption[]> {
  if (provider === 'mistral') {
    const { listMistralModels } = await import('./mistral');
    return listMistralModels(apiKey, baseUrl);
  }
  const { listAnthropicModels } = await import('./anthropic');
  return listAnthropicModels(apiKey);
}

export async function testConnection(config: AIConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const provider = await getProvider(config);
    if (!provider) return { ok: false, message: 'Configuration incomplète : clé et modèle requis.' };
    const reply = await provider.complete({
      system: 'Tu es un test de connexion. Réponds en un seul mot.',
      messages: [{ role: 'user', content: 'Réponds exactement : OK' }],
      maxTokens: 2000,
      effort: 'low',
    });
    return { ok: true, message: `Connexion réussie (réponse : « ${reply.slice(0, 40)} »).` };
  } catch (error) {
    return { ok: false, message: describeAiError(error) };
  }
}
