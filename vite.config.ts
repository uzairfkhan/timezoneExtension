import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, rmSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    preact(),
    {
      name: 'copy-manifest-and-icons',
      closeBundle() {
        // Copy manifest.json to dist
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );
        // Copy icons
        const iconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }
        const iconSizes = ['16', '48', '128'];
        iconSizes.forEach((size) => {
          const src = resolve(__dirname, `public/icons/icon${size}.png`);
          if (existsSync(src)) {
            copyFileSync(src, resolve(iconsDir, `icon${size}.png`));
          }
        });
        // Move HTML from src/popup to popup and fix paths
        const srcHtml = resolve(__dirname, 'dist/src/popup/index.html');
        const destHtml = resolve(__dirname, 'dist/popup/index.html');
        if (existsSync(srcHtml)) {
          let html = readFileSync(srcHtml, 'utf-8');
          // Fix relative paths - the source was in src/popup, now in popup
          html = html.replace(/\.\.\/\.\.\/popup\//g, './');
          writeFileSync(destHtml, html);
          rmSync(resolve(__dirname, 'dist/src'), { recursive: true, force: true });
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep service-worker at root level
          if (chunkInfo.name === 'service-worker') {
            return '[name].js';
          }
          return 'popup/[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'popup/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: false, // We handle public files manually
});
