import { describe, it, expect } from 'vitest';
import { computeCount, formatCount, cmdCount } from './cmd-count';
import { BookmarkStore } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: '1', url: 'https://a.com', title: 'A', tags: ['ts', 'web'], createdAt: '' },
      { id: '2', url: 'https://b.com', title: 'B', tags: ['ts'], createdAt: '', pinned: true } as any,
      { id: '3', url: 'https://c.com', title: 'C', tags: [], createdAt: '' },
      { id: '4', url: 'https://d.com', title: 'D', tags: ['cli'], createdAt: '', archived: true } as any,
      { id: '5', url: 'https://e.com', title: 'E', tags: [], createdAt: '' },
    ],
  };
}

describe('computeCount', () => {
  it('returns correct totals', () => {
    const result = computeCount(makeStore());
    expect(result.total).toBe(5);
    expect(result.tagged).toBe(3);
    expect(result.untagged).toBe(2);
    expect(result.pinned).toBe(1);
    expect(result.archived).toBe(1);
  });

  it('builds byTag counts correctly', () => {
    const result = computeCount(makeStore());
    expect(result.byTag['ts']).toBe(2);
    expect(result.byTag['web']).toBe(1);
    expect(result.byTag['cli']).toBe(1);
  });

  it('handles empty store', () => {
    const result = computeCount({ bookmarks: [] });
    expect(result.total).toBe(0);
    expect(result.tagged).toBe(0);
    expect(result.byTag).toEqual({});
  });
});

describe('formatCount', () => {
  it('includes summary lines', () => {
    const result = computeCount(makeStore());
    const output = formatCount(result);
    expect(output).toContain('Total bookmarks');
    expect(output).toContain('5');
    expect(output).toContain('Tagged');
  });

  it('shows per-tag breakdown when verbose', () => {
    const result = computeCount(makeStore());
    const output = formatCount(result, true);
    expect(output).toContain('By tag:');
    expect(output).toContain('ts');
  });

  it('omits tag section when not verbose', () => {
    const result = computeCount(makeStore());
    const output = formatCount(result, false);
    expect(output).not.toContain('By tag:');
  });
});

describe('cmdCount', () => {
  it('returns JSON when json option set', () => {
    const store = makeStore();
    const output = cmdCount(store, { json: true });
    const parsed = JSON.parse(output);
    expect(parsed.total).toBe(5);
    expect(parsed.byTag.ts).toBe(2);
  });

  it('returns formatted string by default', () => {
    const store = makeStore();
    const output = cmdCount(store);
    expect(typeof output).toBe('string');
    expect(output).toContain('Total bookmarks');
  });
});
