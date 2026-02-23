import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: './src/main.jsx',
      name: 'auth',
      formats: ['es'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
