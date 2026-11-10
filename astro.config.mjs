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

// Il pannello /keystatic c'è in locale (`astro dev`) e, online, solo quando Keystatic Cloud è
// collegato (PUBLIC_KEYSTATIC_PROJECT): senza, non saprebbe dove salvare le news.
const keystaticOn = Boolean(process.env.PUBLIC_KEYSTATIC_PROJECT) || process.argv.includes('dev');

export default defineConfig({
  site,
  // Le pagine restano statiche; solo il pannello /keystatic gira su Vercel come funzione.
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'ignore',
  integrations: [
    ...(keystaticOn ? [react(), keystatic()] : []),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
});
