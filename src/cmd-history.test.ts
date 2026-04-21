import { recordHistory, getHistory, clearHistory, formatHistoryEntry, HistoryEntry } from './cmd-history';
import { Store } from './types';

function makeStore(history?: HistoryEntry[]): Store {
  return {
    bookmarks: [],
    history: history ?? [],
  } as unknown as Store;
}

describe('recordHistory', () => {
  it('prepends a new entry with a timestamp', () => {
    const store = makeStore();
    const updated = recordHistory(store, {
      action: 'add',
      bookmarkId: 'abc',
      url: 'https://example.com',
    });
    expect(updated.history).toHaveLength(1);
    expect(updated.history![0].action).toBe('add');
    expect(updated.history![0].url).toBe('https://example.com');
    expect(updated.history![0].timestamp).toBeTruthy();
  });

  it('prepends newer entries before older ones', () => {
    let store = makeStore();
    store = recordHistory(store, { action: 'add', bookmarkId: '1', url: 'https://a.com' });
    store = recordHistory(store, { action: 'remove', bookmarkId: '2', url: 'https://b.com' });
    expect(store.history![0].url).toBe('https://b.com');
  });

  it('caps history at 100 entries', () => {
    const entries: HistoryEntry[] = Array.from({ length: 100 }, (_, i) => ({
      action: 'add',
      bookmarkId: String(i),
      url: `https://site${i}.com`,
      timestamp: new Date().toISOString(),
    }));
    const store = makeStore(entries);
    const updated = recordHistory(store, { action: 'edit', bookmarkId: 'x', url: 'https://new.com' });
    expect(updated.history).toHaveLength(100);
    expect(updated.history![0].url).toBe('https://new.com');
  });
});

describe('getHistory', () => {
  it('returns up to the specified limit', () => {
    const entries: HistoryEntry[] = Array.from({ length: 30 }, (_, i) => ({
      action: 'add',
      bookmarkId: String(i),
      url: `https://site${i}.com`,
      timestamp: new Date().toISOString(),
    }));
    const store = makeStore(entries);
    expect(getHistory(store, 10)).toHaveLength(10);
  });

  it('returns empty array when no history', () => {
    const store = makeStore();
    expect(getHistory(store)).toEqual([]);
  });
});

describe('clearHistory', () => {
  it('empties the history array', () => {
    const entries: HistoryEntry[] = [{ action: 'add', bookmarkId: '1', url: 'https://x.com', timestamp: '' }];
    const store = makeStore(entries);
    expect(clearHistory(store).history).toEqual([]);
  });
});

describe('formatHistoryEntry', () => {
  it('includes action, url, and detail', () => {
    const entry: HistoryEntry = {
      action: 'tag',
      bookmarkId: '1',
      url: 'https://example.com',
      timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
      detail: 'added:dev',
    };
    const result = formatHistoryEntry(entry);
    expect(result).toContain('TAG');
    expect(result).toContain('https://example.com');
    expect(result).toContain('added:dev');
  });
});
