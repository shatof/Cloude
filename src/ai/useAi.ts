import { useEffect, useState } from 'react';
import { isAiConfigured, loadAiConfig, subscribeAiConfig, type AIConfig } from './config';

export function useAiConfig(): AIConfig {
  const [config, setConfig] = useState<AIConfig>(() => loadAiConfig());
  useEffect(() => subscribeAiConfig(setConfig), []);
  return config;
}

export function useAiStatus(): { connected: boolean; description: string; config: AIConfig } {
  const config = useAiConfig();
  const connected = isAiConfigured(config);
  return {
    connected,
    config,
    description: connected
      ? `Modèle connecté : ${config.modelLabel || config.model}`
      : 'Aucun modèle connecté : le tuteur, l’évaluation finale et le labo d’injection utilisent des réponses prédéfinies.',
  };
}
