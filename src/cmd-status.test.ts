import { describe, it, expect } from 'vitest';
import {
  isValidStatus,
  setStatus,
  removeStatus,
  getStatus,
  filterByStatus,
  countByStatus,
  formatStatusSummary,
} from './cmd-status';
import { BookmarkStore } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '' },
      { id: 'b2', url: 'https://foo.dev', title: 'Foo', tags: [], createdAt: '', status: 'reading' } as any,
      { id: 'c3', url: 'https://bar.io', title: 'Bar', tags: [], createdAt: '', status: 'done' } as any,
    ],
  };
}

describe('isValidStatus', () => {
  it('accepts valid statuses', () => {
    expect(isValidStatus('unread')).toBe(true);
    expect(isValidStatus('reading')).toBe(true);
    expect(isValidStatus('done')).toBe(true);
    expect(isValidStatus('archived')).toBe(true);
  });
  it('rejects invalid values', () => {
    expect(isValidStatus('pending')).toBe(false);
    expect(isValidStatus('')).toBe(false);
  });
});

describe('setStatus', () => {
  it('sets status on a bookmark', () => {
    const store = makeStore();
    const updated = setStatus(store, 'a1', 'reading');
    expect((updated.bookmarks[0] as any).status).toBe('reading');
  });
  it('does not mutate original store', () => {
    const store = makeStore();
    setStatus(store, 'a1', 'done');
    expect((store.bookmarks[0] as any).status).toBeUndefined();
  });
});

describe('removeStatus', () => {
  it('removes status from a bookmark', () => {
    const store = makeStore();
    const updated = removeStatus(store, 'b2');
    expect((updated.bookmarks[1] as any).status).toBeUndefined();
  });
});

describe('getStatus', () => {
  it('returns status for existing bookmark', () => {
    expect(getStatus(makeStore(), 'b2')).toBe('reading');
  });
  it('returns undefined for missing id', () => {
    expect(getStatus(makeStore(), 'zz')).toBeUndefined();
  });
});

describe('filterByStatus', () => {
  it('returns only bookmarks with matching status', () => {
    const results = filterByStatus(makeStore(), 'done');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('c3');
  });
});

describe('countByStatus', () => {
  it('counts bookmarks per status', () => {
    const counts = countByStatus(makeStore());
    expect(counts.unread).toBe(0);
    expect(counts.reading).toBe(1);
    expect(counts.done).toBe(1);
    expect(counts.archived).toBe(0);
  });
});

describe('formatStatusSummary', () => {
  it('formats counts as a string', () => {
    const counts = { unread: 2, reading: 1, done: 3, archived: 0 };
    const out = formatStatusSummary(counts);
    expect(out).toContain('unread: 2');
    expect(out).toContain('done: 3');
  });
});
