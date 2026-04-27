import {
  lockBookmark,
  unlockBookmark,
  isLocked,
  listLocked,
  guardLocked,
  formatLockedList,
} from './cmd-lock';
import { Store, Bookmark } from './types';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '2024-01-01' },
      { id: 'b2', url: 'https://locked.com', title: 'Locked', tags: [], createdAt: '2024-01-02', locked: true },
    ],
  };
}

describe('lockBookmark', () => {
  it('sets locked to true on the target bookmark', () => {
    const store = makeStore();
    const updated = lockBookmark(store, 'a1');
    expect(updated.bookmarks.find((b) => b.id === 'a1')?.locked).toBe(true);
  });

  it('does not affect other bookmarks', () => {
    const store = makeStore();
    const updated = lockBookmark(store, 'a1');
    expect(updated.bookmarks.find((b) => b.id === 'b2')?.locked).toBe(true);
  });

  it('throws when bookmark not found', () => {
    expect(() => lockBookmark(makeStore(), 'missing')).toThrow('Bookmark not found: missing');
  });
});

describe('unlockBookmark', () => {
  it('sets locked to false on a locked bookmark', () => {
    const store = makeStore();
    const updated = unlockBookmark(store, 'b2');
    expect(updated.bookmarks.find((b) => b.id === 'b2')?.locked).toBe(false);
  });

  it('throws when bookmark not found', () => {
    expect(() => unlockBookmark(makeStore(), 'nope')).toThrow('Bookmark not found: nope');
  });
});

describe('isLocked', () => {
  it('returns true for a locked bookmark', () => {
    const b = { id: 'x', url: 'u', tags: [], createdAt: '', locked: true } as Bookmark;
    expect(isLocked(b)).toBe(true);
  });

  it('returns false when locked is absent', () => {
    const b = { id: 'x', url: 'u', tags: [], createdAt: '' } as Bookmark;
    expect(isLocked(b)).toBe(false);
  });
});

describe('listLocked', () => {
  it('returns only locked bookmarks', () => {
    const result = listLocked(makeStore());
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b2');
  });
});

describe('guardLocked', () => {
  it('throws when attempting an action on a locked bookmark', () => {
    expect(() => guardLocked(makeStore(), 'b2', 'delete')).toThrow(/Cannot delete/);
  });

  it('does not throw for an unlocked bookmark', () => {
    expect(() => guardLocked(makeStore(), 'a1', 'delete')).not.toThrow();
  });
});

describe('formatLockedList', () => {
  it('returns a message when no locked bookmarks exist', () => {
    expect(formatLockedList([])).toBe('No locked bookmarks.');
  });

  it('lists locked bookmarks with their url and title', () => {
    const output = formatLockedList(listLocked(makeStore()));
    expect(output).toContain('[locked]');
    expect(output).toContain('https://locked.com');
    expect(output).toContain('Locked');
  });
});
