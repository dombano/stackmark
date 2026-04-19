import { describe, it, expect, beforeEach } from 'vitest';
import { listAllTags, countByTag, renameTag, removeTag, normalizeTags } from './tags';
import { Store } from './storage';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: '1', url: 'https://a.com', title: 'A', tags: ['ts', 'dev'], createdAt: '' },
      { id: '2', url: 'https://b.com', title: 'B', tags: ['ts', 'web'], createdAt: '' },
      { id: '3', url: 'https://c.com', title: 'C', tags: ['dev'], createdAt: '' },
    ],
  };
}

describe('listAllTags', () => {
  it('returns sorted unique tags', () => {
    expect(listAllTags(makeStore())).toEqual(['dev', 'ts', 'web']);
  });

  it('returns empty array for empty store', () => {
    expect(listAllTags({ bookmarks: [] })).toEqual([]);
  });
});

describe('countByTag', () => {
  it('counts bookmarks per tag', () => {
    const counts = countByTag(makeStore());
    expect(counts['ts']).toBe(2);
    expect(counts['dev']).toBe(2);
    expect(counts['web']).toBe(1);
  });
});

describe('renameTag', () => {
  it('renames a tag across all bookmarks', () => {
    const store = makeStore();
    const affected = renameTag(store, 'ts', 'typescript');
    expect(affected).toBe(2);
    expect(store.bookmarks[0].tags).toContain('typescript');
    expect(store.bookmarks[0].tags).not.toContain('ts');
  });

  it('returns 0 when tag does not exist', () => {
    const store = makeStore();
    expect(renameTag(store, 'nonexistent', 'other')).toBe(0);
  });
});

describe('removeTag', () => {
  it('removes a tag from all bookmarks', () => {
    const store = makeStore();
    const affected = removeTag(store, 'dev');
    expect(affected).toBe(2);
    expect(store.bookmarks[0].tags).not.toContain('dev');
  });

  it('returns 0 when tag does not exist', () => {
    const store = makeStore();
    expect(removeTag(store, 'nonexistent')).toBe(0);
  });
});

describe('normalizeTags', () => {
  it('lowercases, trims, deduplicates and sorts', () => {
    expect(normalizeTags(['TS', ' dev ', 'ts', 'WEB'])).toEqual(['dev', 'ts', 'web']);
  });
  it('filters empty strings', () => {
    expect(normalizeTags(['', '  ', 'ok'])).toEqual(['ok']);
  });
});
