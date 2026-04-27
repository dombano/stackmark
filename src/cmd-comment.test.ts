import { describe, it, expect, beforeEach } from 'vitest';
import { BookmarkStore, Bookmark } from './types';
import {
  setComment,
  removeComment,
  getComment,
  listWithComments,
  formatComment,
  formatCommentList,
} from './cmd-comment';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', title: 'Example', tags: [], createdAt: Date.now() },
      { id: 'b2', url: 'https://github.com', title: 'GitHub', tags: ['dev'], createdAt: Date.now() },
    ] as Bookmark[],
  };
}

describe('setComment', () => {
  it('adds a comment to a bookmark', () => {
    const store = makeStore();
    const bm = setComment(store, 'a1', 'Great resource');
    expect(getComment(bm)).toBe('Great resource');
  });

  it('trims whitespace from comment', () => {
    const store = makeStore();
    const bm = setComment(store, 'a1', '  trimmed  ');
    expect(getComment(bm)).toBe('trimmed');
  });

  it('throws if bookmark not found', () => {
    const store = makeStore();
    expect(() => setComment(store, 'missing', 'hi')).toThrow('Bookmark not found: missing');
  });
});

describe('removeComment', () => {
  it('removes a comment from a bookmark', () => {
    const store = makeStore();
    setComment(store, 'a1', 'temp');
    const bm = removeComment(store, 'a1');
    expect(getComment(bm)).toBeUndefined();
  });

  it('throws if bookmark not found', () => {
    const store = makeStore();
    expect(() => removeComment(store, 'nope')).toThrow('Bookmark not found: nope');
  });
});

describe('listWithComments', () => {
  it('returns only bookmarks with comments', () => {
    const store = makeStore();
    setComment(store, 'a1', 'hello');
    const result = listWithComments(store);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a1');
  });

  it('returns empty array when no comments exist', () => {
    const store = makeStore();
    expect(listWithComments(store)).toHaveLength(0);
  });
});

describe('formatComment', () => {
  it('formats a bookmark with a comment', () => {
    const store = makeStore();
    const bm = setComment(store, 'b2', 'Code hub');
    const out = formatComment(bm);
    expect(out).toContain('https://github.com');
    expect(out).toContain('Code hub');
  });

  it('shows no comment placeholder when missing', () => {
    const store = makeStore();
    const out = formatComment(store.bookmarks[0]);
    expect(out).toContain('no comment');
  });
});

describe('formatCommentList', () => {
  it('returns message when list is empty', () => {
    expect(formatCommentList([])).toBe('No bookmarks with comments.');
  });

  it('formats multiple bookmarks', () => {
    const store = makeStore();
    setComment(store, 'a1', 'first');
    setComment(store, 'b2', 'second');
    const out = formatCommentList(listWithComments(store));
    expect(out).toContain('first');
    expect(out).toContain('second');
  });
});
