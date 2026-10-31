/**
 * Adresse de l'API Mistral.
 *
 * L'API Mistral peut refuser les appels venant directement d'un navigateur (CORS).
 * En développement (`npm run dev`) et en aperçu (`npm run preview`), Vite fournit donc
 * un relais local, `/mistral-api`, qui transmet la requête côté serveur (voir vite.config.ts).
 * Ailleurs, on vise l'API publique, sauf si une adresse de relais est fournie :
 * dans les Réglages, ou au build via la variable `VITE_MISTRAL_BASE_URL`.
 */

export const MISTRAL_PUBLIC_API = 'https://api.mistral.ai';
export const MISTRAL_DEV_RELAY = '/mistral-api';

export function resolveMistralBaseUrl(configured: string): string {
  const fromEnv = import.meta.env.VITE_MISTRAL_BASE_URL;
  const base = configured.trim() || fromEnv || (import.meta.env.DEV ? MISTRAL_DEV_RELAY : MISTRAL_PUBLIC_API);
  return base.replace(/\/+$/, '');
}
