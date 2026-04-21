import { describe, it, expect } from 'vitest';
import { BookmarkStore, Bookmark } from './types';
import {
  setRating, removeRating, getRating,
  filterByMinRating, sortByRating, formatRating, averageRating
} from './cmd-rating';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '2024-01-01' },
      { id: 'b2', url: 'https://test.dev', title: 'Test Dev', tags: [], createdAt: '2024-01-02' },
      { id: 'c3', url: 'https://docs.io', title: 'Docs', tags: [], createdAt: '2024-01-03' },
    ] as Bookmark[],
  };
}

describe('setRating', () => {
  it('sets a valid rating', () => {
    const store = makeStore();
    const bm = setRating(store, 'a1', 4);
    expect(getRating(bm)).toBe(4);
  });

  it('throws for rating out of range', () => {
    const store = makeStore();
    expect(() => setRating(store, 'a1', 6)).toThrow();
    expect(() => setRating(store, 'a1', 0)).toThrow();
  });

  it('throws for non-integer rating', () => {
    const store = makeStore();
    expect(() => setRating(store, 'a1', 3.5)).toThrow();
  });

  it('throws for unknown id', () => {
    const store = makeStore();
    expect(() => setRating(store, 'zzz', 3)).toThrow();
  });
});

describe('removeRating', () => {
  it('removes an existing rating', () => {
    const store = makeStore();
    setRating(store, 'a1', 3);
    removeRating(store, 'a1');
    expect(getRating(store.bookmarks[0])).toBeUndefined();
  });
});

describe('filterByMinRating', () => {
  it('returns bookmarks at or above min rating', () => {
    const store = makeStore();
    setRating(store, 'a1', 5);
    setRating(store, 'b2', 2);
    const results = filterByMinRating(store, 3);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('a1');
  });
});

describe('sortByRating', () => {
  it('sorts descending by default', () => {
    const store = makeStore();
    setRating(store, 'a1', 2);
    setRating(store, 'b2', 5);
    setRating(store, 'c3', 3);
    const sorted = sortByRating(store.bookmarks);
    expect(sorted[0].id).toBe('b2');
    expect(sorted[2].id).toBe('a1');
  });
});

describe('formatRating', () => {
  it('formats stars correctly', () => {
    const store = makeStore();
    setRating(store, 'a1', 3);
    expect(formatRating(store.bookmarks[0])).toBe('★★★☆☆ (3/5)');
  });

  it('returns no rating message when unset', () => {
    const store = makeStore();
    expect(formatRating(store.bookmarks[0])).toBe('No rating');
  });
});

describe('averageRating', () => {
  it('returns null when no ratings exist', () => {
    expect(averageRating(makeStore())).toBeNull();
  });

  it('calculates average correctly', () => {
    const store = makeStore();
    setRating(store, 'a1', 4);
    setRating(store, 'b2', 2);
    expect(averageRating(store)).toBe(3);
  });
});
