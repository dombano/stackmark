import { loadStore, saveStore } from './storage';
import { addBookmark } from './storage';
import { normalizeTags } from './tags';
import { formatBookmark } from './format';

export interface AddOptions {
  tags?: string[];
  description?: string;
}

export async function cmdAdd(
  url: string,
  title: string,
  options: AddOptions = {}
): Promise<string> {
  if (!url || !url.startsWith('http')) {
    throw new Error(`Invalid URL: "${url}". Must start with http or https.`);
  }
  if (!title || title.trim().length === 0) {
    throw new Error('Title must not be empty.');
  }

  const store = await loadStore();
  const tags = normalizeTags(options.tags ?? []);

  const bookmark = addBookmark(store, {
    url: url.trim(),
    title: title.trim(),
    tags,
    description: options.description?.trim() ?? '',
  });

  await saveStore(store);
  return `Added: ${formatBookmark(bookmark)}`;
}
