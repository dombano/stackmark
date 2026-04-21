import { BookmarkStore, Bookmark } from './types';

export function setRating(store: BookmarkStore, id: string, rating: number): Bookmark {
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    throw new Error('Rating must be an integer between 1 and 5');
  }
  const bm = store.bookmarks.find(b => b.id === id);
  if (!bm) throw new Error(`Bookmark not found: ${id}`);
  (bm as any).rating = rating;
  return bm;
}

export function removeRating(store: BookmarkStore, id: string): Bookmark {
  const bm = store.bookmarks.find(b => b.id === id);
  if (!bm) throw new Error(`Bookmark not found: ${id}`);
  delete (bm as any).rating;
  return bm;
}

export function getRating(bm: Bookmark): number | undefined {
  return (bm as any).rating as number | undefined;
}

export function filterByMinRating(store: BookmarkStore, min: number): Bookmark[] {
  return store.bookmarks.filter(b => {
    const r = getRating(b);
    return r !== undefined && r >= min;
  });
}

export function sortByRating(bookmarks: Bookmark[], order: 'asc' | 'desc' = 'desc'): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    const ra = getRating(a) ?? 0;
    const rb = getRating(b) ?? 0;
    return order === 'desc' ? rb - ra : ra - rb;
  });
}

export function formatRating(bm: Bookmark): string {
  const r = getRating(bm);
  if (r === undefined) return 'No rating';
  const stars = '★'.repeat(r) + '☆'.repeat(5 - r);
  return `${stars} (${r}/5)`;
}

export function averageRating(store: BookmarkStore): number | null {
  const rated = store.bookmarks.filter(b => getRating(b) !== undefined);
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, b) => acc + (getRating(b) as number), 0);
  return Math.round((sum / rated.length) * 10) / 10;
}
