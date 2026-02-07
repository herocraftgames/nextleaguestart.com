// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://nextleaguestart.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), sitemap()],
});