import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * News ed eventi: un file Markdown per ogni news in src/content/news/.
 * Il nome del file diventa l'indirizzo della pagina (es. vendemmia-2027.md → /news/vendemmia-2027/).
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Data di pubblicazione della news. */
      date: z.coerce.date(),
      /** Data dell'evento, se la news annuncia un appuntamento. */
      eventDate: z.coerce.date().optional(),
      /** Una o due frasi mostrate nell'elenco. */
      summary: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Le bozze non vengono pubblicate. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { news };
