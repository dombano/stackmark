import { Store, Bookmark } from './types';

export interface ExpiryInfo {
  bookmarkId: string;
  url: string;
  expiresAt: number;
  isExpired: boolean;
  daysRemaining: number;
}

export function setExpiry(store: Store, id: string, expiresAt: Date): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  bookmark.meta = { ...bookmark.meta, expiresAt: expiresAt.getTime() };
  return store;
}

export function removeExpiry(store: Store, id: string): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  if (bookmark.meta) delete bookmark.meta.expiresAt;
  return store;
}

export function getExpiry(bookmark: Bookmark): ExpiryInfo | null {
  const expiresAt = bookmark.meta?.expiresAt;
  if (!expiresAt) return null;
  const now = Date.now();
  const msRemaining = expiresAt - now;
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  return {
    bookmarkId: bookmark.id,
    url: bookmark.url,
    expiresAt,
    isExpired: msRemaining <= 0,
    daysRemaining,
  };
}

export function listExpiring(store: Store, withinDays = 30): ExpiryInfo[] {
  return store.bookmarks
    .map(getExpiry)
    .filter((e): e is ExpiryInfo => e !== null)
    .filter((e) => !e.isExpired && e.daysRemaining <= withinDays)
    .sort((a, b) => a.expiresAt - b.expiresAt);
}

export function listExpired(store: Store): ExpiryInfo[] {
  return store.bookmarks
    .map(getExpiry)
    .filter((e): e is ExpiryInfo => e !== null && e.isExpired)
    .sort((a, b) => a.expiresAt - b.expiresAt);
}

export function purgeExpired(store: Store): { store: Store; removed: number } {
  const before = store.bookmarks.length;
  store.bookmarks = store.bookmarks.filter((b) => {
    const info = getExpiry(b);
    return info === null || !info.isExpired;
  });
  return { store, removed: before - store.bookmarks.length };
}

export function formatExpiryInfo(info: ExpiryInfo): string {
  const date = new Date(info.expiresAt).toISOString().slice(0, 10);
  if (info.isExpired) return `[EXPIRED ${date}] ${info.url}`;
  return `[expires ${date} (${info.daysRemaining}d)] ${info.url}`;
}
