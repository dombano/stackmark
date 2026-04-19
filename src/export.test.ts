import { describe, it, expect } from 'vitest';
import { exportToJson, exportToCsv, exportToMarkdown, exportStore } from './export';
import { BookmarkStore } from './storage';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: '1', url: 'https://example.com', title: 'Example', tags: ['web', 'demo'], createdAt: '2024-01-01T00:00:00.000Z' },
      { id: '2', url: 'https://nodejs.org', title: 'Node.js', tags: ['node'], createdAt: '2024-01-02T00:00:00.000Z' },
    ],
  };
}

describe('exportToJson', () => {
  it('produces valid JSON array', () => {
    const out = exportToJson(makeStore());
    const parsed = JSON.parse(out);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
  });
});

describe('exportToCsv', () => {
  it('includes header row', () => {
    const out = exportToCsv(makeStore());
    expect(out.startsWith('id,url,title,tags,createdAt')).toBe(true);
  });
  it('has correct number of rows', () => {
    const rows = exportToCsv(makeStore()).split('\n');
    expect(rows).toHaveLength(3);
  });
  it('joins tags with semicolon', () => {
    const out = exportToCsv(makeStore());
    expect(out).toContain('web;demo');
  });
});

describe('exportToMarkdown', () => {
  it('renders links', () => {
    const out = exportToMarkdown(makeStore());
    expect(out).toContain('[Example](https://example.com)');
  });
  it('renders tags', () => {
    const out = exportToMarkdown(makeStore());
    expect(out).toContain('`web`');
  });
  it('handles empty store', () => {
    const out = exportToMarkdown({ bookmarks: [] });
    expect(out).toContain('No bookmarks');
  });
});

describe('exportStore', () => {
  it('delegates to correct format', () => {
    const store = makeStore();
    expect(exportStore(store, 'json')).toBe(exportToJson(store));
    expect(exportStore(store, 'csv')).toBe(exportToCsv(store));
    expect(exportStore(store, 'markdown')).toBe(exportToMarkdown(store));
  });
});
