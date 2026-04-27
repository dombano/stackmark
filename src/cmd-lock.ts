import { Store, Bookmark } from './types';

export function lockBookmark(store: Store, id: string): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  const updated: Bookmark = { ...bookmark, locked: true };
  return {
    ...store,
    bookmarks: store.bookmarks.map((b) => (b.id === id ? updated : b)),
  };
}

export function unlockBookmark(store: Store, id: string): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  const updated: Bookmark = { ...bookmark, locked: false };
  return {
    ...store,
    bookmarks: store.bookmarks.map((b) => (b.id === id ? updated : b)),
  };
}

export function isLocked(bookmark: Bookmark): boolean {
  return bookmark.locked === true;
}

export function listLocked(store: Store): Bookmark[] {
  return store.bookmarks.filter(isLocked);
}

export function guardLocked(store: Store, id: string, action: string): void {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (bookmark && isLocked(bookmark)) {
    throw new Error(
      `Cannot ${action} bookmark "${bookmark.title ?? id}": it is locked. Unlock it first with: stackmark lock --unlock ${id}`
    );
  }
}

export function formatLockedList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No locked bookmarks.';
  return bookmarks
    .map((b) => `  [locked] ${b.id}  ${b.url}${b.title ? '  ' + b.title : ''}`)
    .join('\n');
}
