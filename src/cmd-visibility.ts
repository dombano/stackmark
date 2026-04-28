import { BookmarkStore, Bookmark } from './types';

export type Visibility = 'public' | 'private' | 'unlisted';

const VALID_VISIBILITIES: Visibility[] = ['public', 'private', 'unlisted'];

export function isValidVisibility(v: string): v is Visibility {
  return VALID_VISIBILITIES.includes(v as Visibility);
}

export function setVisibility(
  store: BookmarkStore,
  id: string,
  visibility: Visibility
): BookmarkStore {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  const updated = { ...bookmark, visibility };
  return {
    ...store,
    bookmarks: store.bookmarks.map((b) => (b.id === id ? updated : b)),
  };
}

export function removeVisibility(
  store: BookmarkStore,
  id: string
): BookmarkStore {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  const { visibility: _v, ...rest } = bookmark as Bookmark & { visibility?: Visibility };
  return {
    ...store,
    bookmarks: store.bookmarks.map((b) => (b.id === id ? (rest as Bookmark) : b)),
  };
}

export function getVisibility(
  store: BookmarkStore,
  id: string
): Visibility | undefined {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);
  return (bookmark as Bookmark & { visibility?: Visibility }).visibility;
}

export function filterByVisibility(
  store: BookmarkStore,
  visibility: Visibility
): Bookmark[] {
  return store.bookmarks.filter(
    (b) => (b as Bookmark & { visibility?: Visibility }).visibility === visibility
  );
}

export function formatVisibilityList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No bookmarks found.';
  return bookmarks
    .map((b) => {
      const vis = (b as Bookmark & { visibility?: Visibility }).visibility ?? 'public';
      return `[${vis}] ${b.id} — ${b.url}${b.title ? ` (${b.title})` : ''}`;
    })
    .join('\n');
}
