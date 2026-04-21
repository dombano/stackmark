import { Store, Bookmark } from './types';

export interface Snapshot {
  id: string;
  label: string;
  createdAt: string;
  bookmarks: Bookmark[];
}

export function createSnapshot(store: Store, label: string): Snapshot {
  const id = Date.now().toString(36);
  return {
    id,
    label,
    createdAt: new Date().toISOString(),
    bookmarks: store.bookmarks.map(b => ({ ...b })),
  };
}

export function saveSnapshot(store: Store, snapshot: Snapshot): Store {
  const snapshots: Snapshot[] = store.snapshots ?? [];
  return {
    ...store,
    snapshots: [...snapshots, snapshot],
  };
}

export function listSnapshots(store: Store): Snapshot[] {
  return store.snapshots ?? [];
}

export function restoreSnapshot(store: Store, id: string): Store | null {
  const snapshot = (store.snapshots ?? []).find(s => s.id === id);
  if (!snapshot) return null;
  return {
    ...store,
    bookmarks: snapshot.bookmarks.map(b => ({ ...b })),
  };
}

export function deleteSnapshot(store: Store, id: string): Store {
  return {
    ...store,
    snapshots: (store.snapshots ?? []).filter(s => s.id !== id),
  };
}

export function formatSnapshot(snapshot: Snapshot): string {
  const count = snapshot.bookmarks.length;
  return `[${snapshot.id}] "${snapshot.label}" — ${count} bookmark${count !== 1 ? 's' : ''} — ${snapshot.createdAt}`;
}
