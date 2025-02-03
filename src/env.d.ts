/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_META_API_TOKEN: string
  readonly VITE_GOOGLE_AI_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 