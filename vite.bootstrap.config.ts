import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { siteBase } from './scripts/site-base.mjs';

export default defineConfig({
  base: siteBase(),
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/page-bootstrap.ts'),
      formats: ['iife'],
      name: 'PortfolioBootstrap',
      fileName: () => 'page-bootstrap.js',
    },
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
