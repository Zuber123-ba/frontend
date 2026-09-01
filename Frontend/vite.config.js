import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: "./", // Ensures proper asset loading in Netlify
  build: {
    outDir: "dist", // Ensures build output goes into "dist"
  },
});
