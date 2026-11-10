import { collection, config, fields } from '@keystatic/core';

/**
 * Pannello per news ed eventi: /keystatic.
 * In locale (`npm run dev`) salva i file su questo computer. Online usa Keystatic Cloud, se la
 * variabile PUBLIC_KEYSTATIC_PROJECT dice il progetto ("team/progetto" su keystatic.cloud): chi
 * entra con la sua email salva le news nel repository GitHub e Vercel ripubblica il sito.
 */
const project = import.meta.env.PUBLIC_KEYSTATIC_PROJECT as string | undefined;

export default config({
  storage: project ? { kind: 'cloud' } : { kind: 'local' },
  ...(project ? { cloud: { project } } : {}),
  locale: 'it-IT',
  ui: { brand: { name: 'Lombardi Wine Experience' } },
  collections: {
    news: collection({
      label: 'News ed eventi',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { contentField: 'content' },
      columns: ['title', 'date'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Titolo', validation: { isRequired: true } },
          slug: {
            label: 'Indirizzo della pagina',
            description: 'Si crea dal titolo. Non cambiarlo dopo la pubblicazione.',
          },
        }),
        summary: fields.text({
          label: 'Breve descrizione',
          description: 'Una o due frasi: compaiono sotto il titolo, nell’elenco degli eventi.',
          multiline: true,
          validation: { length: { min: 1, max: 280 } },
        }),
        cover: fields.image({
          label: 'Foto',
          description: 'Meglio orizzontale, almeno 1600 pixel di larghezza.',
          directory: 'src/assets/images/news',
          publicPath: '../../assets/images/news/',
        }),
        coverAlt: fields.text({
          label: 'Cosa si vede nella foto',
          description: 'Una frase per chi non vede le immagini, per esempio «Calici sul tavolo del torchio».',
        }),
        date: fields.date({
          label: 'Data di pubblicazione',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        eventDate: fields.date({
          label: 'Data dell’evento',
          description: 'Solo se la news annuncia un appuntamento.',
        }),
        draft: fields.checkbox({
          label: 'Bozza',
          description: 'Spuntata, la news non compare sul sito.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Descrizione completa (facoltativa)',
          description: 'Il testo della pagina dell’evento.',
          extension: 'md',
        }),
      },
    }),
  },
});
