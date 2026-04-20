import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cmdRemove } from './cmd-remove';
import * as storage from './storage';
import { BookmarkStore } from './types';

const makeStore = (): BookmarkStore => ({
  bookmarks: [
    { id: '1', url: 'https://example.com', title: 'Example', tags: ['web'], createdAt: '2024-01-01' },
    { id: '2', url: 'https://github.com', title: 'GitHub', tags: ['dev'], createdAt: '2024-01-02' },
  ],
});

describe('cmdRemove', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('removes a bookmark by id and prints confirmation', () => {
    const store = makeStore();
    vi.spyOn(storage, 'removeBookmark').mockReturnValue({
      bookmarks: [store.bookmarks[1]],
    });
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = cmdRemove(store, '1');
    expect(storage.removeBookmark).toHaveBeenCalledWith(store, '1');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Removed'));
    expect(result.bookmarks).toHaveLength(1);
  });

  it('prints error when bookmark not found', () => {
    const store = makeStore();
    vi.spyOn(storage, 'removeBookmark').mockReturnValue(store);
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    cmdRemove(store, 'nonexistent');
    expect(err).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });
});
