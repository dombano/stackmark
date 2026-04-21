import { describe, it, expect, beforeEach } from 'vitest';
import {
  setFavorite,
  unsetFavorite,
  isFavorite,
  listFavorites,
  toggleFavorite,
  formatFavoriteList,
} from './cmd-favorite';
import { BookmarkStore, Bookmark } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', tags: [], createdAt: Date.now() },
      { id: 'b2', url: 'https://github.com', title: 'GitHub', tags: ['dev'], createdAt: Date.now() },
      { id: 'c3', url: 'https://news.ycombinator.com', tags: ['news'], createdAt: Date.now() },
    ] as Bookmark[],
  };
}

describe('setFavorite', () => {
  it('marks a bookmark as favorite', () => {
    const store = makeStore();
    const result = setFavorite(store, 'a1');
    expect(result).not.toBeNull();
    expect(isFavorite(result!)).toBe(true);
  });

  it('returns null for unknown id', () => {
    const store = makeStore();
    expect(setFavorite(store, 'zzz')).toBeNull();
  });
});

describe('unsetFavorite', () => {
  it('removes favorite flag', () => {
    const store = makeStore();
    setFavorite(store, 'b2');
    const result = unsetFavorite(store, 'b2');
    expect(isFavorite(result!)).toBe(false);
  });
});

describe('listFavorites', () => {
  it('returns only favorited bookmarks', () => {
    const store = makeStore();
    setFavorite(store, 'a1');
    setFavorite(store, 'c3');
    const favs = listFavorites(store);
    expect(favs).toHaveLength(2);
    expect(favs.map((b) => b.id)).toEqual(expect.arrayContaining(['a1', 'c3']));
  });

  it('returns empty array when none favorited', () => {
    expect(listFavorites(makeStore())).toHaveLength(0);
  });
});

describe('toggleFavorite', () => {
  it('toggles on then off', () => {
    const store = makeStore();
    expect(toggleFavorite(store, 'a1')).toBe(true);
    expect(toggleFavorite(store, 'a1')).toBe(false);
  });

  it('returns null for unknown id', () => {
    expect(toggleFavorite(makeStore(), 'nope')).toBeNull();
  });
});

describe('formatFavoriteList', () => {
  it('formats a list of favorites', () => {
    const store = makeStore();
    setFavorite(store, 'b2');
    const output = formatFavoriteList(listFavorites(store));
    expect(output).toContain('★');
    expect(output).toContain('GitHub');
  });

  it('shows message when empty', () => {
    expect(formatFavoriteList([])).toBe('No favorites saved.');
  });
});
