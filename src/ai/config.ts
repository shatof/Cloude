/**
 * Configuration de la couche IA.
 *
 * Stockée À PART de la sauvegarde du jeu (jamais exportée avec elle).
 * « Mémoriser » = localStorage ; sinon sessionStorage (oubliée à la fermeture de l'onglet).
 */

export type ProviderId = 'none' | 'anthropic';

export interface AIConfig {
  provider: ProviderId;
  apiKey: string;
  model: string;
  modelLabel: string;
  structured: boolean;
  effort: boolean;
  remember: boolean;
}

export const AI_CONFIG_KEY = 'gitgudai.ia';

export const EMPTY_AI_CONFIG: AIConfig = {
  provider: 'none',
  apiKey: '',
  model: '',
  modelLabel: '',
  structured: false,
  effort: false,
  remember: false,
};

function store(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function parse(text: string | null | undefined): AIConfig | null {
  if (!text) return null;
  try {
    const raw = JSON.parse(text) as Partial<AIConfig>;
    return {
      provider: raw.provider === 'anthropic' ? 'anthropic' : 'none',
      apiKey: typeof raw.apiKey === 'string' ? raw.apiKey.trim() : '',
      model: typeof raw.model === 'string' ? raw.model.trim() : '',
      modelLabel: typeof raw.modelLabel === 'string' ? raw.modelLabel : '',
      structured: raw.structured === true,
      effort: raw.effort === true,
      remember: raw.remember === true,
    };
  } catch {
    return null;
  }
}

type Listener = (config: AIConfig) => void;
const listeners = new Set<Listener>();

export function loadAiConfig(): AIConfig {
  return parse(store('local')?.getItem(AI_CONFIG_KEY)) ?? parse(store('session')?.getItem(AI_CONFIG_KEY)) ?? EMPTY_AI_CONFIG;
}

export function saveAiConfig(config: AIConfig): void {
  const text = JSON.stringify(config);
  const local = store('local');
  const session = store('session');
  try {
    if (config.remember) {
      local?.setItem(AI_CONFIG_KEY, text);
      session?.removeItem(AI_CONFIG_KEY);
    } else {
      session?.setItem(AI_CONFIG_KEY, text);
      local?.removeItem(AI_CONFIG_KEY);
    }
  } catch {
    /* stockage indisponible : la config ne vivra que le temps de la page */
  }
  listeners.forEach((l) => l(config));
}

export function clearAiConfig(): void {
  try {
    store('local')?.removeItem(AI_CONFIG_KEY);
    store('session')?.removeItem(AI_CONFIG_KEY);
  } catch {
    /* rien */
  }
  listeners.forEach((l) => l(EMPTY_AI_CONFIG));
}

export function subscribeAiConfig(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isAiConfigured(config: AIConfig): boolean {
  return config.provider === 'anthropic' && config.apiKey.length > 0 && config.model.length > 0;
}
