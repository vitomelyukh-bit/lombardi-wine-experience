// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Indirizzo pubblico del sito: da qui vengono costruiti canonical, Open Graph e sitemap.
// Il dominio è www.masserialombardi.it (l'indirizzo senza www rimanda qui).
// Si può cambiare senza toccare il codice con la variabile d'ambiente SITE_URL.
const site = process.env.SITE_URL ?? 'https://www.masserialombardi.it';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
