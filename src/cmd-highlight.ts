import { loadStore, saveStore } from './storage';
import { findBookmark } from './storage';
import { resolveStorePath } from './config';
import type { Bookmark, BookmarkStore } from './types';

export type HighlightColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'none';

const VALID_COLORS: HighlightColor[] = ['red', 'green', 'blue', 'yellow', 'purple', 'none'];

export function setHighlight(
  store: BookmarkStore,
  urlOrAlias: string,
  color: HighlightColor
): { store: BookmarkStore; bookmark: Bookmark } {
  const bookmark = findBookmark(store, urlOrAlias);
  if (!bookmark) {
    throw new Error(`Bookmark not found: ${urlOrAlias}`);
  }

  if (!VALID_COLORS.includes(color)) {
    throw new Error(`Invalid color: ${color}. Valid colors: ${VALID_COLORS.join(', ')}`);
  }

  const updated: Bookmark = {
    ...bookmark,
    highlight: color === 'none' ? undefined : color,
  };

  const updatedStore: BookmarkStore = {
    ...store,
    bookmarks: store.bookmarks.map((b) =>
      b.url === bookmark.url ? updated : b
    ),
  };

  return { store: updatedStore, bookmark: updated };
}

export function getHighlightedBookmarks(
  store: BookmarkStore,
  color?: HighlightColor
): Bookmark[] {
  return store.bookmarks.filter((b) =>
    color ? b.highlight === color : b.highlight !== undefined
  );
}

export function clearAllHighlights(store: BookmarkStore): BookmarkStore {
  return {
    ...store,
    bookmarks: store.bookmarks.map((b) => {
      const { highlight, ...rest } = b as Bookmark & { highlight?: string };
      return rest as Bookmark;
    }),
  };
}

export async function cmdHighlight(
  urlOrAlias: string,
  color: string,
  opts: { storePath?: string } = {}
): Promise<void> {
  const storePath = opts.storePath ?? resolveStorePath();
  const store = await loadStore(storePath);

  const { store: updated, bookmark } = setHighlight(
    store,
    urlOrAlias,
    color as HighlightColor
  );

  await saveStore(storePath, updated);

  if (color === 'none') {
    console.log(`Highlight removed from: ${bookmark.url}`);
  } else {
    console.log(`Highlighted ${bookmark.url} with color: ${color}`);
  }
}
