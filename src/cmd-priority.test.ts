import { describe, it, expect } from 'vitest';
import { Store } from './types';
import {
  isValidPriority,
  setPriority,
  removePriority,
  getPriority,
  filterByPriority,
  sortByPriority,
  formatPriorityList,
} from './cmd-priority';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: '1', url: 'https://a.com', title: 'Alpha', tags: [], createdAt: '2024-01-01' },
      { id: '2', url: 'https://b.com', title: 'Beta', tags: [], createdAt: '2024-01-02' },
      { id: '3', url: 'https://c.com', title: 'Gamma', tags: [], createdAt: '2024-01-03' },
    ],
  };
}

describe('isValidPriority', () => {
  it('accepts valid priorities', () => {
    expect(isValidPriority('low')).toBe(true);
    expect(isValidPriority('medium')).toBe(true);
    expect(isValidPriority('high')).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidPriority('urgent')).toBe(false);
    expect(isValidPriority('')).toBe(false);
  });
});

describe('setPriority / getPriority', () => {
  it('sets a priority on a bookmark', () => {
    const store = makeStore();
    const result = setPriority(store, '1', 'high');
    expect(result).not.toBeNull();
    expect(getPriority(result!)).toBe('high');
  });

  it('returns null for unknown id', () => {
    const store = makeStore();
    expect(setPriority(store, 'nope', 'low')).toBeNull();
  });
});

describe('removePriority', () => {
  it('removes priority from bookmark', () => {
    const store = makeStore();
    setPriority(store, '2', 'medium');
    const result = removePriority(store, '2');
    expect(getPriority(result!)).toBeUndefined();
  });

  it('returns null for unknown id', () => {
    expect(removePriority(makeStore(), 'x')).toBeNull();
  });
});

describe('filterByPriority', () => {
  it('returns only bookmarks with matching priority', () => {
    const store = makeStore();
    setPriority(store, '1', 'high');
    setPriority(store, '3', 'high');
    const results = filterByPriority(store, 'high');
    expect(results.map(b => b.id)).toEqual(['1', '3']);
  });
});

describe('sortByPriority', () => {
  it('sorts high before medium before low before none', () => {
    const store = makeStore();
    setPriority(store, '2', 'low');
    setPriority(store, '3', 'high');
    const sorted = sortByPriority(store.bookmarks);
    expect(sorted[0].id).toBe('3');
    expect(sorted[1].id).toBe('2');
    expect(sorted[2].id).toBe('1');
  });
});

describe('formatPriorityList', () => {
  it('returns message when empty', () => {
    expect(formatPriorityList([])).toBe('No bookmarks found.');
  });

  it('formats list with priority labels', () => {
    const store = makeStore();
    setPriority(store, '1', 'high');
    const output = formatPriorityList([store.bookmarks[0]]);
    expect(output).toContain('[HIGH]');
    expect(output).toContain('Alpha');
  });
});
