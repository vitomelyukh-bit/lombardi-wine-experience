import type { APIRoute } from 'astro';

/** robots.txt generato con l'indirizzo assoluto della sitemap. */
export const GET: APIRoute = ({ site }) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    // Il pannello delle news non va nei risultati di ricerca.
    'Disallow: /admin',
    'Disallow: /api/admin',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site)}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
