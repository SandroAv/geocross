// vite.config.js
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    fs: {
      allow: [
        // ① your project root (= everything under /src)
        root,
        // ② the flag-icons SVG folder (dev-time only)
        resolve(root, 'node_modules/flag-icons'),
      ],
    },
  },
});
