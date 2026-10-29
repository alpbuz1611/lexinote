import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5252,
    strictPort: true,
    host: '127.0.0.1'
  },
  build: {
    chunkSizeWarningLimit: 7000,
    rollupOptions: {
      output: {
        manualChunks: {
          'freedict-data': ['./src/data/freedict/freedict_eng_tur.json', './src/data/freedict/freedict_tur_eng.json'],
          'enable1-data': ['./src/data/wordlists/enable1Data.js']
        }
      }
    }
  }
});
