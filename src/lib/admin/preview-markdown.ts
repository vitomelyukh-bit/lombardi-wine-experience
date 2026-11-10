// Il testo della descrizione in HTML, solo per l'anteprima del pannello. Copre quello che il
// pannello produce: paragrafi separati da una riga vuota, elenchi con «- », titoletti con «## »,
// **grassetto**, *corsivo* e link. Tutto il testo viene prima reso innocuo (niente HTML).

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s: string) =>
  escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');

export function previewHtml(md: string): string {
  return md
    .replace(/\r\n?/g, '\n')
    .trim()
    .split(/\n\s*\n/)
    .filter((block) => block.trim())
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*[-*] /.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*] /, ''))}</li>`).join('')}</ul>`;
      }
      if (/^##\s+/.test(block)) return `<h2>${inline(block.replace(/^##\s+/, ''))}</h2>`;
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('\n');
}
