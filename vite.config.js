import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/index.js',
        background: 'src/background.js',
        settings: 'src/settings/settings.js',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        manualChunks: undefined
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
