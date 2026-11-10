import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * News ed eventi: un file Markdown per ogni news in src/content/news/.
 * Il nome del file diventa l'indirizzo della pagina (es. vendemmia-2027.md → /news/vendemmia-2027/).
 * Si scrivono dal pannello /admin (src/lib/admin/) o a mano.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Data di pubblicazione della news. */
      date: z.coerce.date(),
      /** Data dell'evento, se la news annuncia un appuntamento. Il pannello scrive null se vuota. */
      eventDate: z.preprocess((v) => (v === null || v === '' ? undefined : v), z.coerce.date().optional()),
      /** Una o due frasi mostrate nell'elenco. */
      summary: z.string(),
      cover: z.preprocess((v) => (v === null || v === '' ? undefined : v), image().optional()),
      coverAlt: z.preprocess((v) => (v === null || v === '' ? undefined : v), z.string().optional()),
      /** Le bozze non vengono pubblicate. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { news };
