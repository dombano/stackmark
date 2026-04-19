import { loadStore, saveStore, removeBookmark, findBookmark } from './storage';

export async function cmdRemove(id: string): Promise<string> {
  if (!id || id.trim().length === 0) {
    throw new Error('Bookmark ID must not be empty.');
  }

  const store = await loadStore();
  const bookmark = findBookmark(store, id.trim());

  if (!bookmark) {
    throw new Error(`Bookmark not found: "${id}"`);
  }

  removeBookmark(store, id.trim());
  await saveStore(store);
  return `Removed: [${bookmark.id}] ${bookmark.title} <${bookmark.url}>`;
}

export async function cmdRemoveMany(ids: string[]): Promise<string[]> {
  const results: string[] = [];
  for (const id of ids) {
    try {
      const msg = await cmdRemove(id);
      results.push(msg);
    } catch (err: any) {
      results.push(`Error: ${err.message}`);
    }
  }
  return results;
}
