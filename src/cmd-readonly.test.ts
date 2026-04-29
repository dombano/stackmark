import { describe, it, expect } from 'vitest';
import { BookmarkStore } from './types';
import {
  setReadonly,
  isReadonly,
  listReadonly,
  guardReadonly,
  toggleReadonly,
  formatReadonlyList,
} from './cmd-readonly';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', tags: ['dev'], createdAt: '2024-01-01' },
      { id: 'b2', url: 'https://other.org', tags: [], createdAt: '2024-01-02' },
    ],
  } as unknown as BookmarkStore;
}

describe('setReadonly', () => {
  it('marks a bookmark as read-only', () => {
    const store = makeStore();
    const bm = setReadonly(store, 'a1', true);
    expect(bm).not.toBeNull();
    expect(isReadonly(bm!)).toBe(true);
  });

  it('returns null for unknown id', () => {
    const store = makeStore();
    expect(setReadonly(store, 'zzz', true)).toBeNull();
  });

  it('unsets read-only', () => {
    const store = makeStore();
    setReadonly(store, 'a1', true);
    setReadonly(store, 'a1', false);
    expect(isReadonly(store.bookmarks[0])).toBe(false);
  });
});

describe('listReadonly', () => {
  it('returns only read-only bookmarks', () => {
    const store = makeStore();
    setReadonly(store, 'a1', true);
    const result = listReadonly(store);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a1');
  });

  it('returns empty array when none are read-only', () => {
    const store = makeStore();
    expect(listReadonly(store)).toHaveLength(0);
  });
});

describe('guardReadonly', () => {
  it('returns error message if bookmark is read-only', () => {
    const store = makeStore();
    const bm = setReadonly(store, 'a1', true)!;
    const msg = guardReadonly(bm, 'delete');
    expect(msg).toMatch(/read-only/);
    expect(msg).toMatch(/delete/);
  });

  it('returns null if not read-only', () => {
    const store = makeStore();
    expect(guardReadonly(store.bookmarks[0], 'delete')).toBeNull();
  });
});

describe('toggleReadonly', () => {
  it('toggles the read-only state', () => {
    const store = makeStore();
    toggleReadonly(store, 'b2');
    expect(isReadonly(store.bookmarks[1])).toBe(true);
    toggleReadonly(store, 'b2');
    expect(isReadonly(store.bookmarks[1])).toBe(false);
  });
});

describe('formatReadonlyList', () => {
  it('shows a header and each bookmark', () => {
    const store = makeStore();
    setReadonly(store, 'a1', true);
    const out = formatReadonlyList(listReadonly(store));
    expect(out).toMatch(/Read-only bookmarks/);
    expect(out).toMatch(/example\.com/);
  });

  it('shows empty message when list is empty', () => {
    expect(formatReadonlyList([])).toBe('No read-only bookmarks.');
  });
});
