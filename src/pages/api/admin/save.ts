import type { APIRoute } from 'astro';
import { isLoggedIn, sameOrigin } from '../../../lib/admin/auth';
import { type Change, commit, IMAGES_DIR, imageFiles, listNewsFiles, NEWS_DIR } from '../../../lib/admin/github';
import { type NewsForm, problem, slugify, toMarkdown } from '../../../lib/admin/news-file';

export const prerender = false;

/** La foto arriva già ridimensionata dal browser: un JPEG di qualche centinaio di KB. */
const MAX_PHOTO = 4 * 1024 * 1024;

const isJpeg = (b: Uint8Array) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request) || !isLoggedIn(cookies)) {
    return new Response('Non autorizzato', { status: 401 });
  }
  const f = await request.formData();
  const text = (k: string) => String(f.get(k) ?? '').trim();
  const back = (msg: string, slug = '') =>
    redirect(`/admin?${slug ? `modifica=${encodeURIComponent(slug)}&` : ''}errore=${encodeURIComponent(msg)}`, 303);

  try {
    const existing = await listNewsFiles();
    const slugs = new Set(existing.map((e) => e.name.replace(/\.md$/, '')));
    let slug = text('slug');
    const isNew = !slug;
    if (isNew) {
      const base = slugify(text('title'));
      slug = base;
      for (let i = 2; slugs.has(slug); i++) slug = `${base}-${i}`;
    } else if (!slugs.has(slug)) {
      return back('Questa news non esiste più.');
    }

    const news: NewsForm = {
      slug,
      title: text('title'),
      summary: text('summary'),
      date: text('date'),
      eventDate: text('eventDate'),
      coverAlt: text('coverAlt'),
      cover: f.get('removePhoto') ? '' : text('cover'),
      draft: f.get('draft') === 'on',
      body: String(f.get('body') ?? ''),
    };

    const changes: Change[] = [];
    const photo = f.get('photo');
    const replacing = photo instanceof File && photo.size > 0;
    if (replacing || f.get('removePhoto')) {
      for (const path of await imageFiles(slug)) changes.push({ path, delete: true });
    }
    if (replacing) {
      const bytes = new Uint8Array(await photo.arrayBuffer());
      if (bytes.length > MAX_PHOTO || !isJpeg(bytes)) {
        return back('La foto non è valida: riprova con un’altra immagine.', isNew ? '' : slug);
      }
      // Un nome nuovo a ogni foto: nessuna copia vecchia resta in memoria nei browser.
      const name = `foto-${Date.now()}.jpg`;
      changes.push({ path: `${IMAGES_DIR}/${slug}/${name}`, bytes });
      news.cover = `../../assets/images/news/${slug}/${name}`;
    }

    const why = problem(news);
    if (why) return back(why, isNew ? '' : slug);

    changes.push({ path: `${NEWS_DIR}/${slug}.md`, text: toMarkdown(news) });
    await commit(`${isNew ? 'Nuova news' : 'News aggiornata'}: ${news.title}`, changes);
    return redirect(`/admin?modifica=${encodeURIComponent(slug)}&salvato=1`, 303);
  } catch (e) {
    console.error('admin save failed', String(e).slice(0, 300));
    return back('Non sono riuscito a salvare. Riprova tra un minuto.');
  }
};
