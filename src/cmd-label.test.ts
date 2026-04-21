import { describe, it, expect, beforeEach } from 'vitest';
import { addLabel, removeLabel, listLabels, filterByLabel, renameLabel } from './cmd-label';
import { BookmarkStore } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', title: 'Example', tags: [], createdAt: Date.now() },
      { id: 'b2', url: 'https://foo.dev', title: 'Foo', tags: [], labels: ['work'], createdAt: Date.now() },
      { id: 'c3', url: 'https://bar.io', title: 'Bar', tags: [], labels: ['work', 'read'], createdAt: Date.now() },
    ],
  };
}

describe('addLabel', () => {
  it('adds a label to a bookmark', () => {
    const store = makeStore();
    const bm = addLabel(store, 'a1', 'personal');
    expect(bm.labels).toContain('personal');
  });

  it('normalizes label to lowercase', () => {
    const store = makeStore();
    addLabel(store, 'a1', 'Personal');
    expect(store.bookmarks[0].labels).toContain('personal');
  });

  it('does not add duplicate labels', () => {
    const store = makeStore();
    addLabel(store, 'b2', 'work');
    expect(store.bookmarks[1].labels!.filter(l => l === 'work').length).toBe(1);
  });

  it('throws if bookmark not found', () => {
    const store = makeStore();
    expect(() => addLabel(store, 'z9', 'test')).toThrow('Bookmark not found: z9');
  });
});

describe('removeLabel', () => {
  it('removes a label from a bookmark', () => {
    const store = makeStore();
    removeLabel(store, 'b2', 'work');
    expect(store.bookmarks[1].labels).not.toContain('work');
  });

  it('is a no-op if label does not exist', () => {
    const store = makeStore();
    const bm = removeLabel(store, 'a1', 'missing');
    expect(bm.labels).toEqual([]);
  });
});

describe('listLabels', () => {
  it('returns all unique labels sorted', () => {
    const store = makeStore();
    expect(listLabels(store)).toEqual(['read', 'work']);
  });

  it('returns empty array when no labels exist', () => {
    expect(listLabels({ bookmarks: [] })).toEqual([]);
  });
});

describe('filterByLabel', () => {
  it('returns bookmarks matching label', () => {
    const store = makeStore();
    const results = filterByLabel(store, 'work');
    expect(results.map(b => b.id)).toEqual(['b2', 'c3']);
  });

  it('returns empty array when no match', () => {
    const store = makeStore();
    expect(filterByLabel(store, 'nonexistent')).toEqual([]);
  });
});

describe('renameLabel', () => {
  it('renames a label across all bookmarks', () => {
    const store = makeStore();
    const count = renameLabel(store, 'work', 'office');
    expect(count).toBe(2);
    expect(listLabels(store)).toContain('office');
    expect(listLabels(store)).not.toContain('work');
  });

  it('returns 0 when label not found', () => {
    const store = makeStore();
    expect(renameLabel(store, 'ghost', 'phantom')).toBe(0);
  });
});
