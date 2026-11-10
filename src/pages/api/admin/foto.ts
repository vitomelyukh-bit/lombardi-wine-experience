import type { APIRoute } from 'astro';
import { isLoggedIn } from '../../../lib/admin/auth';
import { IMAGES_DIR, rawFile } from '../../../lib/admin/github';

export const prerender = false;

/** Anteprima della foto di una news, letta dal repository. Solo dentro la cartella delle foto. */
export const GET: APIRoute = async ({ url, cookies }) => {
  if (!isLoggedIn(cookies)) return new Response('Non autorizzato', { status: 401 });
  const path = url.searchParams.get('path') ?? '';
  if (!path.startsWith(`${IMAGES_DIR}/`) || path.includes('..') || !/\.(jpe?g|png|webp)$/i.test(path)) {
    return new Response('Non trovato', { status: 404 });
  }
  try {
    return new Response(await rawFile(path), {
      headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=300' },
    });
  } catch {
    return new Response('Non trovato', { status: 404 });
  }
};
