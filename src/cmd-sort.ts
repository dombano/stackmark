import { BookmarkStore, Bookmark } from './types';

export type SortField = 'title' | 'url' | 'createdAt' | 'tags' | 'visits';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
  tag?: string;
}

export function sortBookmarksByField(
  store: BookmarkStore,
  options: SortOptions
): Bookmark[] {
  const { field, order, tag } = options;

  let bookmarks = Object.values(store.bookmarks);

  if (tag) {
    bookmarks = bookmarks.filter((b) =>
      b.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
  }

  const sorted = [...bookmarks].sort((a, b) => {
    let valA: string | number;
    let valB: string | number;

    switch (field) {
      case 'title':
        valA = (a.title ?? '').toLowerCase();
        valB = (b.title ?? '').toLowerCase();
        break;
      case 'url':
        valA = a.url.toLowerCase();
        valB = b.url.toLowerCase();
        break;
      case 'createdAt':
        valA = a.createdAt ?? '';
        valB = b.createdAt ?? '';
        break;
      case 'tags':
        valA = (a.tags ?? []).join(',').toLowerCase();
        valB = (b.tags ?? []).join(',').toLowerCase();
        break;
      case 'visits':
        valA = (a as any).visits ?? 0;
        valB = (b as any).visits ?? 0;
        break;
      default:
        valA = '';
        valB = '';
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

export function cmdSort(
  store: BookmarkStore,
  field: SortField = 'createdAt',
  order: SortOrder = 'asc',
  tag?: string
): { bookmarks: Bookmark[]; count: number } {
  const bookmarks = sortBookmarksByField(store, { field, order, tag });
  return { bookmarks, count: bookmarks.length };
}
