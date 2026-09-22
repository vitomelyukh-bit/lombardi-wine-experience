const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatDate = (date: Date) => dateFormatter.format(date);

/** Formato per l'attributo datetime di <time>. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
