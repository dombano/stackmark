import { describe, it, expect } from 'vitest';
import { getRecentBookmarks, cmdRecent } from './cmd-recent';
import { Store, Bookmark } from './types';

function makeStore(overrides: Partial<Bookmark>[] = []): Store {
  const base: Bookmark[] = [
    {
      id: '1',
      url: 'https://example.com',
      title: 'Example',
      tags: ['web'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      url: 'https://github.com',
      title: 'GitHub',
      tags: ['dev', 'web'],
      createdAt: '2024-03-15T00:00:00Z',
    },
    {
      id: '3',
      url: 'https://news.ycombinator.com',
      title: 'Hacker News',
      tags: ['news'],
      createdAt: '2024-02-10T00:00:00Z',
    },
  ];
  return { bookmarks: [...base, ...overrides.map((o, i) => ({ id: `extra-${i}`, url: '', title: '', tags: [], createdAt: '', ...o }))] };
}

describe('getRecentBookmarks', () => {
  it('returns bookmarks sorted by createdAt descending', () => {
    const store = makeStore();
    const results = getRecentBookmarks(store);
    expect(results[0].id).toBe('2');
    expect(results[1].id).toBe('3');
    expect(results[2].id).toBe('1');
  });

  it('respects count option', () => {
    const store = makeStore();
    const results = getRecentBookmarks(store, { count: 2 });
    expect(results).toHaveLength(2);
  });

  it('filters by tags', () => {
    const store = makeStore();
    const results = getRecentBookmarks(store, { tags: ['web'] });
    expect(results.every((b) => b.tags?.includes('web'))).toBe(true);
    expect(results).toHaveLength(2);
  });

  it('returns empty array when no bookmarks match tags', () => {
    const store = makeStore();
    const results = getRecentBookmarks(store, { tags: ['nonexistent'] });
    expect(results).toHaveLength(0);
  });
});

describe('cmdRecent', () => {
  it('returns formatted list for results', () => {
    const store = makeStore();
    const output = cmdRecent(store, { count: 2 });
    expect(output).toContain('GitHub');
  });

  it('returns no bookmarks message for empty store', () => {
    const store: Store = { bookmarks: [] };
    const output = cmdRecent(store);
    expect(output).toBe('No bookmarks found.');
  });
});
