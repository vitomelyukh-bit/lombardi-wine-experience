import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

// Accesso al pannello /admin: una sola password (ADMIN_PASSWORD su Vercel). Chi la scrive giusta
// riceve un cookie firmato, valido 30 giorni, solo per questo pannello. Cambiare la password
// chiude tutte le sessioni aperte, perché la chiave di firma ne deriva.

export const COOKIE = 'lwe_admin';
const MAX_AGE_S = 30 * 24 * 60 * 60;

const password = () => import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? '';
const key = () => createHash('sha256').update(`lombardi-admin:${password()}`).digest();

const sign = (payload: string) => createHmac('sha256', key()).update(payload).digest('base64url');

/** Stesso confronto in tempo costante anche quando le lunghezze differiscono. */
function same(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const isConfigured = () => password().length >= 8;

export function checkPassword(attempt: string): boolean {
  return isConfigured() && same(attempt, password());
}

export function startSession(cookies: AstroCookies) {
  const until = String(Date.now() + MAX_AGE_S * 1000);
  cookies.set(COOKIE, `${until}.${sign(until)}`, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: MAX_AGE_S,
  });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export function isLoggedIn(cookies: AstroCookies): boolean {
  if (!isConfigured()) return false;
  const value = cookies.get(COOKIE)?.value ?? '';
  const [until, mac] = value.split('.');
  if (!until || !mac || !same(mac, sign(until))) return false;
  return Number(until) > Date.now();
}

/** Le richieste che modificano arrivano solo dal pannello stesso. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return origin === null || origin === new URL(request.url).origin;
}
