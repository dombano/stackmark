import { BookmarkStore, Bookmark } from './types';

export function addLabel(store: BookmarkStore, id: string, label: string): Bookmark {
  const bm = store.bookmarks.find(b => b.id === id);
  if (!bm) throw new Error(`Bookmark not found: ${id}`);
  if (!bm.labels) bm.labels = [];
  const normalized = label.trim().toLowerCase();
  if (!bm.labels.includes(normalized)) {
    bm.labels.push(normalized);
  }
  return bm;
}

export function removeLabel(store: BookmarkStore, id: string, label: string): Bookmark {
  const bm = store.bookmarks.find(b => b.id === id);
  if (!bm) throw new Error(`Bookmark not found: ${id}`);
  const normalized = label.trim().toLowerCase();
  bm.labels = (bm.labels ?? []).filter(l => l !== normalized);
  return bm;
}

export function listLabels(store: BookmarkStore): string[] {
  const set = new Set<string>();
  for (const bm of store.bookmarks) {
    for (const label of bm.labels ?? []) {
      set.add(label);
    }
  }
  return Array.from(set).sort();
}

export function filterByLabel(store: BookmarkStore, label: string): Bookmark[] {
  const normalized = label.trim().toLowerCase();
  return store.bookmarks.filter(bm => (bm.labels ?? []).includes(normalized));
}

export function renameLabel(store: BookmarkStore, oldLabel: string, newLabel: string): number {
  const oldNorm = oldLabel.trim().toLowerCase();
  const newNorm = newLabel.trim().toLowerCase();
  let count = 0;
  for (const bm of store.bookmarks) {
    if (!bm.labels) continue;
    const idx = bm.labels.indexOf(oldNorm);
    if (idx !== -1) {
      bm.labels[idx] = newNorm;
      count++;
    }
  }
  return count;
}
