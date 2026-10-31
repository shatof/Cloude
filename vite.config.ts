import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// `base: './'` : le build fonctionne depuis n'importe quel sous-dossier
// (GitHub Pages, serveur statique, aperçu local).
export default defineConfig({
  base: './',
  plugins: [react()],
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
