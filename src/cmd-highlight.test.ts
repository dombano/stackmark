import { describe, it, expect } from 'vitest';
import { setHighlight, getHighlightedBookmarks, clearAllHighlights } from './cmd-highlight';
import type { BookmarkStore, Bookmark } from './types';

function makeStore(bookmarks: Partial<Bookmark>[] = []): BookmarkStore {
  return {
    bookmarks: bookmarks.map((b, i) => ({
      url: `https://example${i}.com`,
      title: `Example ${i}`,
      tags: [],
      createdAt: new Date().toISOString(),
      ...b,
    })) as Bookmark[],
    version: 1,
  };
}

describe('setHighlight', () => {
  it('sets a highlight color on a bookmark', () => {
    const store = makeStore([{ url: 'https://example.com' }]);
    const { bookmark } = setHighlight(store, 'https://example.com', 'red');
    expect((bookmark as any).highlight).toBe('red');
  });

  it('removes highlight when color is none', () => {
    const store = makeStore([{ url: 'https://example.com', highlight: 'blue' } as any]);
    const { bookmark } = setHighlight(store, 'https://example.com', 'none');
    expect((bookmark as any).highlight).toBeUndefined();
  });

  it('updates the store bookmarks list', () => {
    const store = makeStore([{ url: 'https://example.com' }, { url: 'https://other.com' }]);
    const { store: updated } = setHighlight(store, 'https://example.com', 'green');
    const target = updated.bookmarks.find((b) => b.url === 'https://example.com');
    expect((target as any).highlight).toBe('green');
    const other = updated.bookmarks.find((b) => b.url === 'https://other.com');
    expect((other as any).highlight).toBeUndefined();
  });

  it('throws if bookmark not found', () => {
    const store = makeStore([]);
    expect(() => setHighlight(store, 'https://missing.com', 'red')).toThrow(
      'Bookmark not found'
    );
  });

  it('throws for invalid color', () => {
    const store = makeStore([{ url: 'https://example.com' }]);
    expect(() => setHighlight(store, 'https://example.com', 'pink' as any)).toThrow(
      'Invalid color'
    );
  });
});

describe('getHighlightedBookmarks', () => {
  it('returns all highlighted bookmarks when no color filter', () => {
    const store = makeStore([
      { url: 'https://a.com', highlight: 'red' } as any,
      { url: 'https://b.com' },
      { url: 'https://c.com', highlight: 'blue' } as any,
    ]);
    const result = getHighlightedBookmarks(store);
    expect(result).toHaveLength(2);
  });

  it('filters by specific color', () => {
    const store = makeStore([
      { url: 'https://a.com', highlight: 'red' } as any,
      { url: 'https://b.com', highlight: 'blue' } as any,
    ]);
    const result = getHighlightedBookmarks(store, 'red');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://a.com');
  });
});

describe('clearAllHighlights', () => {
  it('removes all highlights from all bookmarks', () => {
    const store = makeStore([
      { url: 'https://a.com', highlight: 'red' } as any,
      { url: 'https://b.com', highlight: 'yellow' } as any,
    ]);
    const updated = clearAllHighlights(store);
    updated.bookmarks.forEach((b) => {
      expect((b as any).highlight).toBeUndefined();
    });
  });
});
