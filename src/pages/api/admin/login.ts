import type { APIRoute } from 'astro';
import { checkPassword, sameOrigin, startSession } from '../../../lib/admin/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return new Response('Richiesta non valida', { status: 403 });
  const form = await request.formData();
  if (checkPassword(String(form.get('password') ?? ''))) {
    startSession(cookies);
    return redirect('/admin', 303);
  }
  // Una password sbagliata costa un attimo: tentativi a raffica diventano lenti.
  await new Promise((r) => setTimeout(r, 900));
  return redirect('/admin?errore=password', 303);
};
