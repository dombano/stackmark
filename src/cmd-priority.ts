import { Store, Bookmark } from './types';

export type Priority = 'low' | 'medium' | 'high';

const VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export function isValidPriority(value: string): value is Priority {
  return VALID_PRIORITIES.includes(value as Priority);
}

export function setPriority(store: Store, id: string, priority: Priority): Bookmark | null {
  const bookmark = store.bookmarks.find(b => b.id === id);
  if (!bookmark) return null;
  (bookmark as any).priority = priority;
  return bookmark;
}

export function removePriority(store: Store, id: string): Bookmark | null {
  const bookmark = store.bookmarks.find(b => b.id === id);
  if (!bookmark) return null;
  delete (bookmark as any).priority;
  return bookmark;
}

export function getPriority(bookmark: Bookmark): Priority | undefined {
  return (bookmark as any).priority as Priority | undefined;
}

export function filterByPriority(store: Store, priority: Priority): Bookmark[] {
  return store.bookmarks.filter(b => (b as any).priority === priority);
}

export function sortByPriority(bookmarks: Bookmark[]): Bookmark[] {
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  return [...bookmarks].sort((a, b) => {
    const pa = (a as any).priority as Priority | undefined;
    const pb = (b as any).priority as Priority | undefined;
    const oa = pa !== undefined ? order[pa] : 99;
    const ob = pb !== undefined ? order[pb] : 99;
    return oa - ob;
  });
}

export function formatPriorityList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No bookmarks found.';
  return bookmarks
    .map(b => {
      const p = getPriority(b) ?? 'none';
      return `[${p.toUpperCase()}] ${b.title ?? b.url} (${b.id})`;
    })
    .join('\n');
}
