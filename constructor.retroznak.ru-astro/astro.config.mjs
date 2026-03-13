import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://baslie.github.io',
  base: '/land.retroznak.ru',
  integrations: [react()],
  output: 'static',
  vite: {
    resolve: {
      alias: { '@': '/src' }
    }
  }
});
