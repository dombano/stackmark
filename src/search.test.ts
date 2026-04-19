import { describe, it, expect } from 'vitest';
import { fuzzyScore, scoreBookmark, searchBookmarks, filterByTags } from './search';

const bookmarks = [
  { id: '1', url: 'https://github.com', title: 'GitHub', tags: ['dev', 'git'], createdAt: '' },
  { id: '2', url: 'https://typescript.org', title: 'TypeScript', tags: ['dev', 'ts'], createdAt: '' },
  { id: '3', url: 'https://cooking.com', title: 'Recipes', tags: ['food'], createdAt: '' },
];

describe('fuzzyScore', () => {
  it('returns high score for exact match', () => {
    expect(fuzzyScore('github', 'github')).toBeGreaterThan(0);
  });

  it('returns 0 for no match', () => {
    expect(fuzzyScore('zzz', 'github')).toBe(0);
  });

  it('is case insensitive', () => {
    expect(fuzzyScore('GITHUB', 'github')).toBeGreaterThan(0);
  });
});

describe('scoreBookmark', () => {
  it('scores a bookmark against a query', () => {
    const score = scoreBookmark(bookmarks[0], 'github');
    expect(score).toBeGreaterThan(0);
  });
});

describe('searchBookmarks', () => {
  it('returns relevant results sorted by score', () => {
    const results = searchBookmarks(bookmarks, 'typescript');
    expect(results[0].title).toBe('TypeScript');
  });

  it('respects limit', () => {
    const results = searchBookmarks(bookmarks, 'dev', 1);
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it('returns empty array when no match', () => {
    const results = searchBookmarks(bookmarks, 'zzznomatch');
    expect(results).toHaveLength(0);
  });
});

describe('filterByTags', () => {
  it('filters bookmarks by tag', () => {
    const results = filterByTags(bookmarks, ['dev']);
    expect(results).toHaveLength(2);
  });

  it('returns empty when no bookmarks match tag', () => {
    const results = filterByTags(bookmarks, ['unknown']);
    expect(results).toHaveLength(0);
  });

  it('matches any of the provided tags', () => {
    const results = filterByTags(bookmarks, ['food', 'ts']);
    expect(results).toHaveLength(2);
  });
});
