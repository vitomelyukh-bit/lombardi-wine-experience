// @ts-check
import { defineConfig } from 'astro/config';

// URL pubblico del sito, usato per canonical e Open Graph.
// Su Vercel viene letto in automatico dal dominio di produzione del progetto;
// quando ci sarà il dominio definitivo impostare SITE_URL (es. https://www.dominio.it).
// TODO: da confermare con il cliente (dominio definitivo)
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
});
