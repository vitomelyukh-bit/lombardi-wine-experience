// Lettura e scrittura delle news nel repository GitHub del sito, con un token che resta sul server
// (GITHUB_TOKEN su Vercel: token «fine-grained» con Contents in lettura e scrittura su questo solo
// repository). Ogni salvataggio è un commit su main: Vercel lo vede e ripubblica il sito.

const env = (name: string) => import.meta.env[name] ?? process.env[name];

const REPO = () => env('GITHUB_REPO') ?? 'vitomelyukh-bit/lombardi-wine-experience';
const BRANCH = () => env('GITHUB_BRANCH') ?? 'main';
export const NEWS_DIR = 'src/content/news';
export const IMAGES_DIR = 'src/assets/images/news';

export const hasToken = () => Boolean(env('GITHUB_TOKEN'));

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  // GITHUB_API serve solo alle prove in locale, contro un finto GitHub.
  const api = env('GITHUB_API') ?? 'https://api.github.com';
  const res = await fetch(`${api}/repos/${REPO()}${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${env('GITHUB_TOKEN')}`,
      'x-github-api-version': '2022-11-28',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
    },
  });
  if (!res.ok) {
    // Il messaggio di GitHub non contiene il token.
    throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

/** I file .md delle news, così come sono ora su main (anche quelli non ancora pubblicati). */
export async function listNewsFiles(): Promise<{ name: string; text: string }[]> {
  const items = await gh<{ name: string; type: string; path: string }[]>(
    `/contents/${NEWS_DIR}?ref=${BRANCH()}`,
  );
  const md = items.filter((i) => i.type === 'file' && i.name.endsWith('.md'));
  return Promise.all(
    md.map(async (i) => {
      const f = await gh<{ content: string }>(`/contents/${i.path}?ref=${BRANCH()}`);
      return { name: i.name, text: Buffer.from(f.content, 'base64').toString('utf8') };
    }),
  );
}

export type Change =
  | { path: string; text: string }
  | { path: string; bytes: Uint8Array }
  | { path: string; delete: true };

/** Un solo commit con tutte le modifiche (testo, foto, cancellazioni). */
export async function commit(message: string, changes: Change[]): Promise<void> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${BRANCH()}`);
  const parent = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
  const tree = await Promise.all(
    changes.map(async (c) => {
      if ('delete' in c) return { path: c.path, mode: '100644', type: 'blob', sha: null };
      const blob = await gh<{ sha: string }>('/git/blobs', {
        method: 'POST',
        body: JSON.stringify(
          'text' in c
            ? { content: c.text, encoding: 'utf-8' }
            : { content: Buffer.from(c.bytes).toString('base64'), encoding: 'base64' },
        ),
      });
      return { path: c.path, mode: '100644', type: 'blob', sha: blob.sha };
    }),
  );
  const newTree = await gh<{ sha: string }>('/git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const created = await gh<{ sha: string }>('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  });
  await gh(`/git/refs/heads/${BRANCH()}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: created.sha }),
  });
}

/** I byte di un file del repository (per l'anteprima della foto nel pannello). */
export async function rawFile(path: string): Promise<Uint8Array> {
  const api = env('GITHUB_API') ?? 'https://api.github.com';
  const res = await fetch(`${api}/repos/${REPO()}/contents/${path}?ref=${BRANCH()}`, {
    headers: {
      accept: 'application/vnd.github.raw',
      authorization: `Bearer ${env('GITHUB_TOKEN')}`,
      'x-github-api-version': '2022-11-28',
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

/** I file della cartella foto di una news, per cancellarli insieme alla news. */
export async function imageFiles(slug: string): Promise<string[]> {
  try {
    const items = await gh<{ path: string; type: string }[]>(
      `/contents/${IMAGES_DIR}/${slug}?ref=${BRANCH()}`,
    );
    return items.filter((i) => i.type === 'file').map((i) => i.path);
  } catch {
    return [];
  }
}
