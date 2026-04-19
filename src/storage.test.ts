import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const TEST_DIR = path.join(os.tmpdir(), '.stackmark-test-' + Date.now());

vi.mock('os', async (importOriginal) => {
  const actual = await importOriginal<typeof os>();
  return { ...actual, homedir: () => TEST_DIR };
});

import { addBookmark, listBookmarks, removeBookmark, loadStore } from './storage';

describe('storage', () => {
  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  it('returns empty bookmarks on first load', () => {
    const store = loadStore();
    expect(store.bookmarks).toEqual([]);
  });

  it('adds a bookmark and persists it', () => {
    const bm = addBookmark({ url: 'https://example.com', title: 'Example', tags: ['test'] });
    expect(bm.id).toBeDefined();
    expect(bm.createdAt).toBeDefined();
    const bookmarks = listBookmarks();
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].url).toBe('https://example.com');
  });

  it('lists all bookmarks', () => {
    addBookmark({ url: 'https://a.com', title: 'A', tags: [] });
    addBookmark({ url: 'https://b.com', title: 'B', tags: ['dev'] });
    expect(listBookmarks()).toHaveLength(2);
  });

  it('removes a bookmark by id', () => {
    const bm = addBookmark({ url: 'https://remove.com', title: 'Remove', tags: [] });
    const result = removeBookmark(bm.id);
    expect(result).toBe(true);
    expect(listBookmarks()).toHaveLength(0);
  });

  it('returns false when removing non-existent id', () => {
    const result = removeBookmark('non-existent-id');
    expect(result).toBe(false);
  });
});
