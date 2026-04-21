import { describe, it, expect } from 'vitest';
import { importFromJson, importFromCsv } from './import';
import { BookmarkStore } from './storage';

function emptyStore(): BookmarkStore {
  return { bookmarks: [] };
}

describe('importFromJson', () => {
  it('adds bookmarks from valid JSON', () => {
    const store = emptyStore();
    const raw = JSON.stringify([{ url: 'https://example.com', tags: ['web'] }]);
    const result = importFromJson(store, raw);
    expect(result.added).toBe(1);
    expect(store.bookmarks).toHaveLength(1);
  });

  it('skips duplicate urls', () => {
    const store = emptyStore();
    const raw = JSON.stringify([{ url: 'https://example.com', tags: [] }]);
    importFromJson(store, raw);
    const result = importFromJson(store, raw);
    expect(result.skipped).toBe(1);
    expect(store.bookmarks).toHaveLength(1);
  });

  it('reports error on invalid JSON', () => {
    const store = emptyStore();
    const result = importFromJson(store, 'not json');
    expect(result.errors).toHaveLength(1);
    expect(result.added).toBe(0);
  });

  it('reports error when not an array', () => {
    const store = emptyStore();
    const result = importFromJson(store, '{"url":"x"}');
    expect(result.errors[0]).toMatch(/array/);
  });

  it('normalizes tags', () => {
    const store = emptyStore();
    importFromJson(store, JSON.stringify([{ url: 'https://x.com', tags: ['  WEB ', 'Dev'] }]));
    expect(store.bookmarks[0].tags).toEqual(['web', 'dev']);
  });

  it('skips entries missing a url', () => {
    const store = emptyStore();
    const raw = JSON.stringify([{ tags: ['web'] }, { url: 'https://valid.com', tags: [] }]);
    const result = importFromJson(store, raw);
    expect(result.added).toBe(1);
    expect(result.skipped).toBe(1);
    expect(store.bookmarks).toHaveLength(1);
  });
});

describe('importFromCsv', () => {
  it('imports rows from CSV', () => {
    const store = emptyStore();
    const csv = 'id,url,title,tags,createdAt\n1,https://example.com,Example,web;demo,2024-01-01';
    const result = importFromCsv(store, csv);
    expect(result.added).toBe(1);
    expect(store.bookmarks[0].tags).toEqual(['web', 'demo']);
  });

  it('skips duplicate urls', () => {
    const store = emptyStore();
    const csv = 'id,url,title,tags,createdAt\n1,https://example.com,Example,,2024-01-01';
    importFromCsv(store, csv);
    const result = importFromCsv(store, csv);
    expect(result.skipped).toBe(1);
  });
});
