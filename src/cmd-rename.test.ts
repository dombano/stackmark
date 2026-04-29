import { describe, it, expect } from 'vitest';
import { renameBookmark, formatRenameResult, cmdRename } from './cmd-rename';
import { Store } from './types';

function makeStore(): Store {
  return {
    bookmarks: [
      {
        id: 'abc123',
        url: 'https://example.com',
        title: 'Example Site',
        tags: ['web'],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
  };
}

describe('renameBookmark', () => {
  it('renames a bookmark by id', () => {
    const store = makeStore();
    const { updated, previous } = renameBookmark(store, 'abc123', 'New Title');
    expect(previous).toBe('Example Site');
    expect(updated.title).toBe('New Title');
  });

  it('sets updatedAt on rename', () => {
    const store = makeStore();
    const before = store.bookmarks[0].updatedAt;
    const { updated } = renameBookmark(store, 'abc123', 'Changed');
    expect(updated.updatedAt).not.toBe(before);
  });

  it('throws if bookmark not found', () => {
    const store = makeStore();
    expect(() => renameBookmark(store, 'notexist', 'X')).toThrow('not found');
  });
});

describe('formatRenameResult', () => {
  it('formats the rename output', () => {
    const store = makeStore();
    const { updated } = renameBookmark(store, 'abc123', 'Fresh Title');
    const result = formatRenameResult('Example Site', updated);
    expect(result).toContain('Example Site');
    expect(result).toContain('Fresh Title');
    expect(result).toContain('→');
  });
});

describe('cmdRename', () => {
  it('returns formatted message', () => {
    const store = makeStore();
    const out = cmdRename(store, 'abc123', 'Updated Name');
    expect(out).toContain('Updated Name');
  });

  it('returns only new title in quiet mode', () => {
    const store = makeStore();
    const out = cmdRename(store, 'abc123', 'Quiet Title', { quiet: true });
    expect(out).toBe('Quiet Title');
  });

  it('throws on empty title', () => {
    const store = makeStore();
    expect(() => cmdRename(store, 'abc123', '   ')).toThrow('empty');
  });
});
