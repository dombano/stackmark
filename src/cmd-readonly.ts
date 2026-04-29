import { BookmarkStore, Bookmark } from './types';

export function setReadonly(store: BookmarkStore, id: string, value: boolean): Bookmark | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  (bm as any).readonly = value;
  return bm;
}

export function isReadonly(bm: Bookmark): boolean {
  return !!(bm as any).readonly;
}

export function listReadonly(store: BookmarkStore): Bookmark[] {
  return store.bookmarks.filter((b) => isReadonly(b));
}

export function guardReadonly(bm: Bookmark, action: string): string | null {
  if (isReadonly(bm)) {
    return `Cannot ${action}: bookmark "${bm.url}" is marked as read-only.`;
  }
  return null;
}

export function toggleReadonly(store: BookmarkStore, id: string): Bookmark | null {
  const bm = store.bookmarks.find((b) => b.id === id);
  if (!bm) return null;
  const current = isReadonly(bm);
  (bm as any).readonly = !current;
  return bm;
}

export function formatReadonlyList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No read-only bookmarks.';
  const lines = bookmarks.map((b) => {
    const tags = (b.tags ?? []).length > 0 ? `  [${b.tags!.join(', ')}]` : '';
    return `  🔒 ${b.url}${tags}`;
  });
  return `Read-only bookmarks (${bookmarks.length}):\n${lines.join('\n')}`;
}
