// Dopo `astro build` con l'adattatore Vercel: Vercel legge solo .vercel/output/config.json e ignora i
// reindirizzamenti di vercel.json. Questo script rimette in testa alle regole il passaggio
// permanente dall'indirizzo .vercel.app al dominio. Senza .vercel/output (build locale senza
// adattatore) non fa niente.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../.vercel/output/config.json', import.meta.url);
if (!existsSync(file)) process.exit(0);

const FROM = 'lombardi-wine-experience.vercel.app';
const TO = 'https://www.masserialombardi.it';
const config = JSON.parse(readFileSync(file, 'utf8'));
config.routes = config.routes ?? [];
const already = config.routes.some((r) => r.has?.some?.((h) => h.type === 'host' && h.value === FROM));
if (!already) {
  config.routes.unshift({
    src: '^/(.*)$',
    has: [{ type: 'host', value: FROM }],
    headers: { Location: `${TO}/$1` },
    status: 308,
  });
  writeFileSync(file, JSON.stringify(config, null, 2));
}
console.log(`vercel-host-redirect: ${FROM} → ${TO}`);
