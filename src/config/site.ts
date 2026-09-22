import type { ImageMetadata } from 'astro';

/** Logo di un ente finanziatore da mostrare nel footer. */
export interface FundingLogo {
  src: ImageMetadata;
  alt: string;
  href?: string;
}

/** Voce di navigazione: aggiungere qui le future sezioni o pagine (es. prenotazioni). */
export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  name: 'Lombardi Wine Experience',
  house: 'Masseria Lombardi',
  place: 'Putignano (Puglia)',
  placeFull: 'Putignano (BA), Puglia',
  title: 'Lombardi Wine Experience · Masseria Lombardi, Putignano (Puglia)',
  description:
    'Dal restauro di un antico torchio, un progetto di eventi e formazione dedicati al vino a Masseria Lombardi, nella campagna di Putignano, in Puglia.',
  locale: 'it_IT',

  nav: [
    { label: 'Il progetto', href: '/#progetto' },
    { label: 'L’esperienza', href: '/#esperienza' },
    { label: 'La Masseria', href: '/#masseria' },
    { label: 'News', href: '/#news' },
  ] satisfies NavItem[],

  legal: {
    company: 'FLORES SRL',
    // TODO: da confermare con il cliente (P.IVA, sede legale, eventuale REA)
    vatNumber: '',
    address: '',
  },

  funding: {
    // Testo previsto dal bando, se richiesto.
    // TODO: da confermare con il cliente (finanziamento pubblico, testo e loghi obbligatori)
    note: '',
    // Importare i loghi da src/assets/images/loghi/ e aggiungerli qui.
    logos: [] as FundingLogo[],
  },
};
