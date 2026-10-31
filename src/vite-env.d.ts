/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Adresse de l'API Mistral (ou d'un relais) utilisée par défaut dans le build. */
  readonly VITE_MISTRAL_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
