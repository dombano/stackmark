import { describe, it, expect } from 'vitest';
import { sortBookmarksByField, cmdSort } from './cmd-sort';
import { BookmarkStore } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: {
      a: { id: 'a', url: 'https://zebra.com', title: 'Zebra', tags: ['z', 'animal'], createdAt: '2024-01-03' },
      b: { id: 'b', url: 'https://apple.com', title: 'Apple', tags: ['a', 'fruit'], createdAt: '2024-01-01' },
      c: { id: 'c', url: 'https://mango.com', title: 'Mango', tags: ['m', 'fruit'], createdAt: '2024-01-02' },
    },
  } as BookmarkStore;
}

describe('sortBookmarksByField', () => {
  it('sorts by title ascending', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'title', order: 'asc' });
    expect(result.map((b) => b.title)).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  it('sorts by title descending', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'title', order: 'desc' });
    expect(result.map((b) => b.title)).toEqual(['Zebra', 'Mango', 'Apple']);
  });

  it('sorts by url ascending', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'url', order: 'asc' });
    expect(result[0].url).toBe('https://apple.com');
  });

  it('sorts by createdAt ascending', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'createdAt', order: 'asc' });
    expect(result.map((b) => b.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by createdAt descending', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'createdAt', order: 'desc' });
    expect(result.map((b) => b.id)).toEqual(['a', 'c', 'b']);
  });

  it('filters by tag before sorting', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'title', order: 'asc', tag: 'fruit' });
    expect(result.map((b) => b.title)).toEqual(['Apple', 'Mango']);
  });

  it('returns empty array when tag matches nothing', () => {
    const store = makeStore();
    const result = sortBookmarksByField(store, { field: 'title', order: 'asc', tag: 'nonexistent' });
    expect(result).toHaveLength(0);
  });
});

describe('cmdSort', () => {
  it('returns sorted bookmarks and count', () => {
    const store = makeStore();
    const { bookmarks, count } = cmdSort(store, 'title', 'asc');
    expect(count).toBe(3);
    expect(bookmarks[0].title).toBe('Apple');
  });

  it('uses defaults when no args provided', () => {
    const store = makeStore();
    const { bookmarks, count } = cmdSort(store);
    expect(count).toBe(3);
    expect(bookmarks[0].createdAt).toBe('2024-01-01');
  });
});
