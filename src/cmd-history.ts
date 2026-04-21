import { Store, Bookmark } from './types';
import { loadStore, saveStore } from './storage';

export interface HistoryEntry {
  action: 'add' | 'remove' | 'edit' | 'tag';
  bookmarkId: string;
  url: string;
  timestamp: string;
  detail?: string;
}

export function recordHistory(
  store: Store,
  entry: Omit<HistoryEntry, 'timestamp'>
): Store {
  const history: HistoryEntry[] = store.history ?? [];
  const newEntry: HistoryEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...history].slice(0, 100);
  return { ...store, history: updated };
}

export function getHistory(
  store: Store,
  limit = 20
): HistoryEntry[] {
  return (store.history ?? []).slice(0, limit);
}

export function clearHistory(store: Store): Store {
  return { ...store, history: [] };
}

export function formatHistoryEntry(entry: HistoryEntry): string {
  const date = new Date(entry.timestamp).toLocaleString();
  const detail = entry.detail ? ` (${entry.detail})` : '';
  return `[${date}] ${entry.action.toUpperCase()} ${entry.url}${detail}`;
}

export function cmdHistory(
  storePath: string,
  opts: { limit?: number; clear?: boolean } = {}
): void {
  const store = loadStore(storePath);

  if (opts.clear) {
    const cleared = clearHistory(store);
    saveStore(storePath, cleared);
    console.log('History cleared.');
    return;
  }

  const entries = getHistory(store, opts.limit ?? 20);
  if (entries.length === 0) {
    console.log('No history found.');
    return;
  }

  entries.forEach((e) => console.log(formatHistoryEntry(e)));
}
