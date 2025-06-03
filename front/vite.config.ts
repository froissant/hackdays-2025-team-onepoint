import path from "path";
import react from '@vitejs/plugin-react'
import { type AliasOptions, defineConfig } from 'vite'

const root = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // Default behavior is usually fine.
      // Example: To customize generated class names
      // generateScopedName: '[name]__[local]___[hash:base64:5]',
      // localsConvention: 'camelCaseOnly', // or 'camelCase', 'dashes', 'dashesOnly'
    }
  },
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
})
