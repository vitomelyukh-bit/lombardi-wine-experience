// Una news del pannello ↔ il suo file Markdown in src/content/news/. Le stringhe si scrivono tra
// virgolette JSON (YAML le legge uguali), così apostrofi, due punti e accenti non rompono niente.
// La lettura capisce anche i file scritti a mano (valori senza virgolette, righe di commento).

export interface NewsForm {
  slug: string;
  title: string;
  summary: string;
  date: string; // aaaa-mm-gg
  eventDate: string; // aaaa-mm-gg o ''
  coverAlt: string;
  /** Percorso relativo della foto dentro il file, '' se non c'è. */
  cover: string;
  draft: boolean;
  body: string;
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** «Serata di vendemmia 2027!» → «serata-di-vendemmia-2027». */
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'news';
}

export function toMarkdown(n: NewsForm): string {
  const lines = ['---', `title: ${JSON.stringify(n.title)}`, `date: ${n.date}`];
  if (n.eventDate) lines.push(`eventDate: ${n.eventDate}`);
  lines.push(`summary: ${JSON.stringify(n.summary)}`);
  if (n.cover) {
    lines.push(`cover: ${JSON.stringify(n.cover)}`);
    if (n.coverAlt) lines.push(`coverAlt: ${JSON.stringify(n.coverAlt)}`);
  }
  if (n.draft) lines.push('draft: true');
  lines.push('---', '', n.body.trim(), '');
  return lines.join('\n');
}

function unquote(v: string): string {
  const t = v.trim();
  if (t.startsWith('"')) {
    try {
      return JSON.parse(t);
    } catch {
      return t.slice(1, -1);
    }
  }
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1).replace(/''/g, "'");
  return t;
}

export function fromMarkdown(slug: string, text: string): NewsForm {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  const front = m?.[1] ?? '';
  const data: Record<string, string> = {};
  for (const line of front.split(/\r?\n/)) {
    if (/^\s*#/.test(line)) continue;
    const kv = /^([A-Za-z]+):\s*(.*)$/.exec(line);
    if (kv) data[kv[1]!] = unquote(kv[2]!);
  }
  const day = (v?: string) => (v && DAY.test(v.slice(0, 10)) ? v.slice(0, 10) : '');
  return {
    slug,
    title: data.title ?? '',
    summary: data.summary ?? '',
    date: day(data.date),
    eventDate: day(data.eventDate),
    cover: data.cover ?? '',
    coverAlt: data.coverAlt ?? '',
    draft: data.draft === 'true',
    body: (m?.[2] ?? text).trim(),
  };
}

/** I campi obbligatori; null se va bene, altrimenti cosa manca. */
export function problem(n: NewsForm): string | null {
  if (!n.title.trim()) return 'Manca il titolo.';
  if (!n.summary.trim()) return 'Manca la breve descrizione.';
  if (n.summary.length > 280) return 'La breve descrizione è troppo lunga (al massimo 280 caratteri).';
  if (!DAY.test(n.date)) return 'Manca la data di pubblicazione.';
  if (n.eventDate && !DAY.test(n.eventDate)) return 'La data dell’evento non è valida.';
  if (n.cover && !n.coverAlt.trim()) return 'Scrivi cosa si vede nella foto.';
  return null;
}
