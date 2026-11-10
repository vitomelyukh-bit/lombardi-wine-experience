import type { APIRoute } from 'astro';
import { isLoggedIn, sameOrigin } from '../../../lib/admin/auth';
import { commit, imageFiles, listNewsFiles, NEWS_DIR } from '../../../lib/admin/github';
import { fromMarkdown } from '../../../lib/admin/news-file';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request) || !isLoggedIn(cookies)) {
    return new Response('Non autorizzato', { status: 401 });
  }
  const slug = String((await request.formData()).get('slug') ?? '');
  try {
    const file = (await listNewsFiles()).find((e) => e.name === `${slug}.md`);
    if (!file) return redirect('/admin', 303);
    const title = fromMarkdown(slug, file.text).title || slug;
    const images = await imageFiles(slug);
    await commit(`News cancellata: ${title}`, [
      { path: `${NEWS_DIR}/${slug}.md`, delete: true },
      ...images.map((path) => ({ path, delete: true as const })),
    ]);
    return redirect('/admin?cancellato=1', 303);
  } catch (e) {
    console.error('admin delete failed', String(e).slice(0, 300));
    return redirect(`/admin?errore=${encodeURIComponent('Non sono riuscito a cancellare. Riprova tra un minuto.')}`, 303);
  }
};
