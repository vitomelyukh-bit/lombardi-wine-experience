// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// Indirizzo pubblico del sito: da qui vengono costruiti canonical, Open Graph e sitemap.
// Il dominio è www.masserialombardi.it (l'indirizzo senza www rimanda qui).
// Si può cambiare senza toccare il codice con la variabile d'ambiente SITE_URL.
const site = process.env.SITE_URL ?? 'https://www.masserialombardi.it';

export default defineConfig({
  site,
  // Le pagine restano statiche; solo il pannello /keystatic gira su Vercel come funzione.
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore',
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
});
