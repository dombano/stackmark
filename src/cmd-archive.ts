import { BookmarkStore, Bookmark } from './types';

export function archiveBookmark(store: BookmarkStore, id: string): Bookmark | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  (bm as any).archived = true;
  (bm as any).archivedAt = new Date().toISOString();
  return bm;
}

export function unarchiveBookmark(store: BookmarkStore, id: string): Bookmark | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  delete (bm as any).archived;
  delete (bm as any).archivedAt;
  return bm;
}

export function listArchived(store: BookmarkStore): Bookmark[] {
  return store.bookmarks.filter((b) => (b as any).archived === true);
}

export function purgeArchived(store: BookmarkStore): number {
  const before = store.bookmarks.length;
  store.bookmarks = store.bookmarks.filter((b) => !(b as any).archived);
  return before - store.bookmarks.length;
}

export function formatArchivedList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No archived bookmarks.';
  return bookmarks
    .map((b) => {
      const date = (b as any).archivedAt
        ? ` (archived: ${(b as any).archivedAt.slice(0, 10)})`
        : '';
      const tags = b.tags.length ? `  [${b.tags.join(', ')}]` : '';
      return `  ${b.id}  ${b.url}${tags}${date}`;
    })
    .join('\n');
}
