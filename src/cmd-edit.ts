import { loadStore, saveStore } from "./storage";
import { resolveStorePath, loadConfig } from "./config";
import { normalizeTags } from "./tags";
import { formatBookmark } from "./format";
import type { Bookmark } from "./types";

interface EditOptions {
  url?: string;
  title?: string;
  tags?: string;
  storePath?: string;
}

export async function cmdEdit(
  id: string,
  opts: EditOptions
): Promise<string> {
  const config = await loadConfig();
  const storePath = opts.storePath ?? resolveStorePath(config);
  const store = await loadStore(storePath);

  const index = store.bookmarks.findIndex((b: Bookmark) => b.id === id);
  if (index === -1) {
    throw new Error(`Bookmark not found: ${id}`);
  }

  const existing = store.bookmarks[index];
  const updated: Bookmark = {
    ...existing,
    ...(opts.url ? { url: opts.url } : {}),
    ...(opts.title !== undefined ? { title: opts.title } : {}),
    ...(opts.tags !== undefined
      ? { tags: normalizeTags(opts.tags.split(",")) }
      : {}),
    updatedAt: new Date().toISOString(),
  };

  store.bookmarks[index] = updated;
  await saveStore(storePath, store);
  return formatBookmark(updated);
}
