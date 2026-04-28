import {
  setVisibility,
  removeVisibility,
  getVisibility,
  filterByVisibility,
  isValidVisibility,
  formatVisibilityList,
} from './cmd-visibility';
import { BookmarkStore, Bookmark } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', tags: [], createdAt: '2024-01-01' } as Bookmark,
      { id: 'b2', url: 'https://private.io', tags: [], createdAt: '2024-01-02' } as Bookmark,
      { id: 'c3', url: 'https://unlisted.dev', tags: [], createdAt: '2024-01-03' } as Bookmark,
    ],
  } as BookmarkStore;
}

describe('isValidVisibility', () => {
  it('accepts valid values', () => {
    expect(isValidVisibility('public')).toBe(true);
    expect(isValidVisibility('private')).toBe(true);
    expect(isValidVisibility('unlisted')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidVisibility('hidden')).toBe(false);
    expect(isValidVisibility('')).toBe(false);
  });
});

describe('setVisibility', () => {
  it('sets visibility on a bookmark', () => {
    const store = makeStore();
    const updated = setVisibility(store, 'a1', 'private');
    expect(getVisibility(updated, 'a1')).toBe('private');
  });

  it('throws for unknown id', () => {
    expect(() => setVisibility(makeStore(), 'zz', 'public')).toThrow('Bookmark not found: zz');
  });

  it('does not mutate other bookmarks', () => {
    const store = makeStore();
    const updated = setVisibility(store, 'a1', 'unlisted');
    expect(getVisibility(updated, 'b2')).toBeUndefined();
  });
});

describe('removeVisibility', () => {
  it('removes visibility from a bookmark', () => {
    let store = makeStore();
    store = setVisibility(store, 'b2', 'private');
    store = removeVisibility(store, 'b2');
    expect(getVisibility(store, 'b2')).toBeUndefined();
  });

  it('throws for unknown id', () => {
    expect(() => removeVisibility(makeStore(), 'xx')).toThrow('Bookmark not found: xx');
  });
});

describe('filterByVisibility', () => {
  it('returns only bookmarks with matching visibility', () => {
    let store = makeStore();
    store = setVisibility(store, 'a1', 'public');
    store = setVisibility(store, 'b2', 'private');
    store = setVisibility(store, 'c3', 'private');
    const privates = filterByVisibility(store, 'private');
    expect(privates.map((b) => b.id)).toEqual(['b2', 'c3']);
  });

  it('returns empty array when none match', () => {
    const store = makeStore();
    expect(filterByVisibility(store, 'unlisted')).toHaveLength(0);
  });
});

describe('formatVisibilityList', () => {
  it('returns message when empty', () => {
    expect(formatVisibilityList([])).toBe('No bookmarks found.');
  });

  it('formats bookmarks with visibility', () => {
    let store = makeStore();
    store = setVisibility(store, 'a1', 'public');
    const result = formatVisibilityList(filterByVisibility(store, 'public'));
    expect(result).toContain('[public]');
    expect(result).toContain('https://example.com');
  });
});
