import path from "path";
import react from '@vitejs/plugin-react'
import { type AliasOptions, defineConfig } from 'vite'

const root = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
})
