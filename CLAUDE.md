# Lombardi Wine Experience – landing page

## Il progetto
Landing page espositiva per "Lombardi Wine Experience", progetto di Masseria Lombardi a Putignano (BA), Puglia. Committente: FLORES SRL.
Masseria Lombardi è un progetto di famiglia che partirà pienamente dal 2027: ospitalità su più livelli (camere, spa, wine experience, eventi). Due filoni futuri: ospitalità e affitto camere, piccoli eventi privati di valore (soprattutto destination wedding).
Oggi è pronta solo la Lombardi Wine Experience: dal restauro di un antico torchio presente in masseria è nato un progetto di eventi e formazione legati al vino. La pagina racconta questo progetto.

## Obiettivo
- Solo consultazione: far conoscere il progetto.
- Niente prenotazioni, modulo, recapiti né social per ora.
- In futuro si aggiungeranno news sugli eventi e le prenotazioni: la struttura deve permetterlo senza rifare il sito.

## Pubblico
Viaggiatori e turisti di fascia medio-alta che cercano natura, tranquillità ed esperienze autentiche. Per gli eventi, destination wedding in Puglia.

## Riferimenti del cliente (livello e tono, non da copiare)
- https://www.amastuola.it/it/wine-experience-puglia/
- https://www.vetrere.com/wine-experience/

## Struttura (una pagina)
1. Hero: "Lombardi Wine Experience", sotto "Masseria Lombardi, Putignano (Puglia)". Grande foto placeholder.
2. Il progetto: il torchio antico restaurato e cosa è nato da lì.
3. L'esperienza: eventi e formazione sul vino. Blocchi placeholder.
4. La Masseria: la visione per il 2027 (ospitalità, spa, vino, eventi), tono "in arrivo".
5. News ed eventi: sezione pronta ma vuota con messaggio "I prossimi appuntamenti saranno pubblicati qui". Ogni news è un file separato (content collection), si aggiungono senza toccare il layout.
6. Footer: nome e luogo, spazio predisposto per ragione sociale/P.IVA ed eventuali loghi del finanziamento pubblico.

## Stile
- Sobrio, premium, naturale. Colori da pietra, calce, ulivo e vino, niente colori accesi.
- Tanto spazio, foto grandi, pochi testi ben scritti.
- Solo font gratuiti con licenza commerciale (Google Fonts o open source). Mai font commerciali.
- Nessun logo per ora: il nome come wordmark tipografico.

## Tecnica
- Astro, sito statico. Mobile first, accessibile, veloce.
- SEO di base: title, description, Open Graph, lang="it".
- Nessun cookie, analytics o tracciamento.
- Immagini placeholder in src/assets/images/ con nomi chiari (hero.jpg, torchio.jpg…).
- Deploy previsto su Vercel da GitHub.

## Testi
- Italiano, tono elegante e caldo, frasi brevi, niente superlativi da brochure.
- Dove mancano info reali scrivi testi sobri e segnali con <!-- TODO: da confermare con il cliente -->.
- Non inventare dati concreti: prezzi, durate, numeri, date, premi, recensioni.

---

# Nota tecnica (aggiornare quando il sito cambia)

## Comandi
- `npm run dev` — server locale (Astro 7 lo avvia in background: `npx astro dev status`, `npx astro dev logs`, `npx astro dev stop`).
- `npm run build` — build statica in `dist/`.
- `npm run preview` — anteprima della build.

## Struttura
- `src/pages/index.astro` — la pagina, composta dai componenti in `src/components/`:
  `Hero`, `Progetto`, `Esperienza`, `Masseria`, `News`.
- `src/pages/news/[id].astro` — pagina di dettaglio di ogni news (generata solo se esistono news pubblicate).
- `src/layouts/BaseLayout.astro` — `<head>`, SEO, Open Graph, dati strutturati, font, header e footer.
- `src/pages/robots.txt.ts` — robots.txt con il link alla sitemap (generata da `@astrojs/sitemap`).
- `src/components/JsonLd.astro` — blocco schema.org; le pagine possono passarne uno proprio con la prop `schema`.
- `src/config/site.ts` — nome, luogo, voci di menu, dati legali, loghi del finanziamento. Da qui si cambiano i testi ricorrenti senza toccare i componenti.
- `src/styles/global.css` — palette (calce, pietra, ulivo, vino), tipografia e classi comuni (`.container`, `.section`, `.eyebrow`, `.lead`, `.photo`).
- `src/assets/images/` — foto placeholder, da sostituire con le foto vere mantenendo gli stessi nomi.
- Ogni componente ha i propri stili in fondo al file (`<style>` con scope automatico di Astro).

## Aggiungere una news o un evento
1. Duplicare `src/content/news/esempio.md` e rinominarlo (il nome del file diventa l'indirizzo: `serata-vendemmia.md` → `/news/serata-vendemmia/`).
2. Compilare `title`, `date`, `summary`, se serve `eventDate`, `cover` e `coverAlt`.
3. Togliere `draft: true` (o metterlo a `false`).
La sezione "News ed eventi" passa da sola dal messaggio di attesa all'elenco delle news. Nessun layout da toccare.

## Crescita prevista
- Prenotazioni: aggiungere una pagina o una sezione e una voce in `site.nav`. Nessun altro cambio strutturale.
- Loghi del finanziamento pubblico: metterli in `src/assets/images/loghi/`, importarli in `site.funding.logos`; il blocco nel footer compare da solo.
- P.IVA e ragione sociale: `site.legal`. In Italia la P.IVA va indicata nella home page del sito di una società.

## Regole da rispettare
- Niente cookie, analytics o tracciamento. I font sono self-hosted (Fontsource, licenza SIL OFL): non usare Google Fonts via CDN, chiamerebbe un server esterno.
- Non inventare dati concreti (prezzi, durate, numeri, date, premi). Dove manca un'informazione, testo sobrio e commento `<!-- TODO: da confermare con il cliente (...) -->`.
- I commenti TODO restano visibili nel sorgente della pagina pubblicata: vanno risolti prima di andare online.
- Immagini sempre tramite `astro:assets` (`<Image>` / `<Picture>`), con `alt` descrittivo.

## Da completare prima della pubblicazione
- Foto vere al posto dei placeholder (stessi nomi file in `src/assets/images/`).
- Testi confermati dal cliente: cercare `TODO: da confermare con il cliente`.
- `site.legal.vatNumber` e ragione sociale completa.
- Verificare il sito in Google Search Console e inviare la sitemap.

## SEO (base tecnica, fatta il 22 settembre 2026)
- Dominio: `https://www.masserialombardi.it` (senza www rimanda al www), impostato in `astro.config.mjs`; si può sovrascrivere con la variabile d'ambiente `SITE_URL`.
- Attivi: canonical, Open Graph e Twitter card, `meta robots` (`index, follow, max-image-preview:large`), sitemap automatica, robots.txt con il link alla sitemap, dati strutturati (Organization, WebSite, TouristAttraction; le news aggiungono Article ed Event).
- Ogni pagina nuova passa da `BaseLayout` e quindi eredita tutto. Le pagine da nascondere ai motori: prop `noindex` (come la 404).
- Non ancora fatto, da valutare con il cliente: ricerca parole chiave, testi orientati alle ricerche reali, scheda Google Business Profile, dati di contatto e orari nei dati strutturati.
