import { BookmarkStore, Bookmark } from './types';

export type StatusValue = 'unread' | 'reading' | 'done' | 'archived';

const VALID_STATUSES: StatusValue[] = ['unread', 'reading', 'done', 'archived'];

export function isValidStatus(status: string): status is StatusValue {
  return VALID_STATUSES.includes(status as StatusValue);
}

export function setStatus(store: BookmarkStore, id: string, status: StatusValue): BookmarkStore {
  const bookmarks = store.bookmarks.map((b) =>
    b.id === id ? { ...b, status } : b
  );
  return { ...store, bookmarks };
}

export function removeStatus(store: BookmarkStore, id: string): BookmarkStore {
  const bookmarks = store.bookmarks.map((b) => {
    if (b.id !== id) return b;
    const { status: _s, ...rest } = b as any;
    return rest as Bookmark;
  });
  return { ...store, bookmarks };
}

export function getStatus(store: BookmarkStore, id: string): StatusValue | undefined {
  const b = store.bookmarks.find((b) => b.id === id);
  return b ? (b as any).status : undefined;
}

export function filterByStatus(store: BookmarkStore, status: StatusValue): Bookmark[] {
  return store.bookmarks.filter((b) => (b as any).status === status);
}

export function countByStatus(store: BookmarkStore): Record<StatusValue, number> {
  const counts: Record<StatusValue, number> = { unread: 0, reading: 0, done: 0, archived: 0 };
  for (const b of store.bookmarks) {
    const s = (b as any).status as StatusValue | undefined;
    if (s && isValidStatus(s)) counts[s]++;
  }
  return counts;
}

export function formatStatusSummary(counts: Record<StatusValue, number>): string {
  return VALID_STATUSES.map((s) => `${s}: ${counts[s]}`).join('  ');
}
