import { getCollection } from 'astro:content';

/** News pubblicate, dalla più recente. */
export const getPublishedNews = async () =>
  (await getCollection('news', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
