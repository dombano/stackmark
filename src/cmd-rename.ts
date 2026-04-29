import { Store, Bookmark } from './types';
import { findBookmark } from './storage';

export function renameBookmark(
  store: Store,
  idOrAlias: string,
  newTitle: string
): { updated: Bookmark; previous: string } {
  const bookmark = findBookmark(store, idOrAlias);
  if (!bookmark) {
    throw new Error(`Bookmark not found: ${idOrAlias}`);
  }
  const previous = bookmark.title;
  bookmark.title = newTitle.trim();
  bookmark.updatedAt = new Date().toISOString();
  return { updated: bookmark, previous };
}

export function formatRenameResult(
  previous: string,
  updated: Bookmark
): string {
  return `Renamed: "${previous}" → "${updated.title}"`;
}

export function cmdRename(
  store: Store,
  idOrAlias: string,
  newTitle: string,
  opts: { quiet?: boolean } = {}
): string {
  if (!newTitle || newTitle.trim().length === 0) {
    throw new Error('New title must not be empty.');
  }
  const { updated, previous } = renameBookmark(store, idOrAlias, newTitle);
  if (opts.quiet) return updated.title;
  return formatRenameResult(previous, updated);
}
