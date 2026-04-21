import { BookmarkStore, Bookmark } from './types';

export function setFavorite(store: BookmarkStore, id: string): Bookmark | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  (bm as any).favorite = true;
  return bm;
}

export function unsetFavorite(store: BookmarkStore, id: string): Bookmark | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  (bm as any).favorite = false;
  return bm;
}

export function isFavorite(bm: Bookmark): boolean {
  return (bm as any).favorite === true;
}

export function listFavorites(store: BookmarkStore): Bookmark[] {
  return store.bookmarks.filter(isFavorite);
}

export function toggleFavorite(store: BookmarkStore, id: string): boolean | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  const next = !isFavorite(bm);
  (bm as any).favorite = next;
  return next;
}

export function formatFavoriteList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No favorites saved.';
  return bookmarks
    .map((b) => `★ [${b.id}] ${b.url}${b.title ? ' — ' + b.title : ''}`)
    .join('\n');
}
