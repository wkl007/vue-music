import { defineConfig } from 'vite';
import { resolve } from 'path';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  mode: 'production',
  plugins: [commonjs()],
  build: {
    lib: {
      entry: resolve(__dirname, './backend/router.js'),
      name: 'CustomRouter',
      formats: ['cjs'],
      fileName: (format) => {
        const suffix = format === 'cjs' ? 'cjs' : 'js';
        return `custom-router.${suffix}`;
      },
    },
    outDir: './backend/dist',
    copyPublicDir: false,
  },
});
