import { describe, it, expect, beforeEach } from 'vitest';
import { BookmarkStore, Bookmark } from './types';
import {
  archiveBookmark,
  unarchiveBookmark,
  listArchived,
  purgeArchived,
  formatArchivedList,
} from './cmd-archive';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', tags: ['dev'], createdAt: '2024-01-01' },
      { id: 'a2', url: 'https://news.ycombinator.com', tags: ['news'], createdAt: '2024-01-02' },
      { id: 'a3', url: 'https://github.com', tags: ['dev', 'tools'], createdAt: '2024-01-03' },
    ] as Bookmark[],
  };
}

describe('archiveBookmark', () => {
  it('marks a bookmark as archived', () => {
    const store = makeStore();
    const result = archiveBookmark(store, 'a1');
    expect(result).not.toBeNull();
    expect((result as any).archived).toBe(true);
    expect((result as any).archivedAt).toBeDefined();
  });

  it('returns null for unknown id', () => {
    const store = makeStore();
    expect(archiveBookmark(store, 'nope')).toBeNull();
  });
});

describe('unarchiveBookmark', () => {
  it('removes archived flag', () => {
    const store = makeStore();
    archiveBookmark(store, 'a2');
    const result = unarchiveBookmark(store, 'a2');
    expect((result as any).archived).toBeUndefined();
    expect((result as any).archivedAt).toBeUndefined();
  });

  it('returns null for unknown id', () => {
    const store = makeStore();
    expect(unarchiveBookmark(store, 'ghost')).toBeNull();
  });
});

describe('listArchived', () => {
  it('returns only archived bookmarks', () => {
    const store = makeStore();
    archiveBookmark(store, 'a1');
    archiveBookmark(store, 'a3');
    const archived = listArchived(store);
    expect(archived).toHaveLength(2);
    expect(archived.map((b) => b.id)).toEqual(['a1', 'a3']);
  });

  it('returns empty array when none archived', () => {
    const store = makeStore();
    expect(listArchived(store)).toHaveLength(0);
  });
});

describe('purgeArchived', () => {
  it('removes all archived bookmarks and returns count', () => {
    const store = makeStore();
    archiveBookmark(store, 'a1');
    archiveBookmark(store, 'a2');
    const count = purgeArchived(store);
    expect(count).toBe(2);
    expect(store.bookmarks).toHaveLength(1);
    expect(store.bookmarks[0].id).toBe('a3');
  });
});

describe('formatArchivedList', () => {
  it('shows message when empty', () => {
    expect(formatArchivedList([])).toBe('No archived bookmarks.');
  });

  it('formats archived bookmarks', () => {
    const store = makeStore();
    archiveBookmark(store, 'a1');
    const archived = listArchived(store);
    const output = formatArchivedList(archived);
    expect(output).toContain('a1');
    expect(output).toContain('https://example.com');
    expect(output).toContain('archived:');
  });
});
