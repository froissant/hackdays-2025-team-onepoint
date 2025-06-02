interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
