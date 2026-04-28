/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHATBOT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
