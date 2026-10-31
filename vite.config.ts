import type { ProxyOptions } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Relais local vers l'API Mistral : le navigateur appelle `/mistral-api/…` sur le même
 * serveur que le jeu, et Vite transmet la requête côté serveur à api.mistral.ai.
 * On retire les en-têtes d'origine pour que la requête ressemble à un appel serveur.
 * La clé API reste celle saisie par l'utilisateur ; rien n'est stocké ici.
 */
const mistralRelay: Record<string, ProxyOptions> = {
  '/mistral-api': {
    target: 'https://api.mistral.ai',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/mistral-api/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('origin');
        proxyReq.removeHeader('referer');
      });
    },
  },
};

// `base: './'` : le build fonctionne depuis n'importe quel sous-dossier
// (GitHub Pages, serveur statique, aperçu local).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { proxy: mistralRelay },
  preview: { proxy: mistralRelay },
  build: {
    target: 'es2022',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
