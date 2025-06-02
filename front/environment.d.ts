declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
