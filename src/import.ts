import { Bookmark, BookmarkStore } from './storage';
import { normalizeTags } from './tags';
import { randomUUID } from 'crypto';

export interface ImportResult {
  added: number;
  skipped: number;
  errors: string[];
}

export function importFromJson(store: BookmarkStore, raw: string): ImportResult {
  const result: ImportResult = { added: 0, skipped: 0, errors: [] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    result.errors.push('Invalid JSON');
    return result;
  }
  if (!Array.isArray(parsed)) {
    result.errors.push('Expected a JSON array of bookmarks');
    return result;
  }
  const existing = new Set(store.bookmarks.map((b) => b.url));
  for (const item of parsed as Record<string, unknown>[]) {
    if (typeof item.url !== 'string') {
      result.errors.push(`Skipping entry without url: ${JSON.stringify(item)}`);
      result.skipped++;
      continue;
    }
    if (existing.has(item.url)) {
      result.skipped++;
      continue;
    }
    const bookmark: Bookmark = {
      id: typeof item.id === 'string' ? item.id : randomUUID(),
      url: item.url,
      title: typeof item.title === 'string' ? item.title : undefined,
      tags: normalizeTags(Array.isArray(item.tags) ? item.tags : []),
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    };
    store.bookmarks.push(bookmark);
    existing.add(bookmark.url);
    result.added++;
  }
  return result;
}

export function importFromCsv(store: BookmarkStore, raw: string): ImportResult {
  const result: ImportResult = { added: 0, skipped: 0, errors: [] };
  const lines = raw.trim().split('\n');
  if (lines.length < 2) return result;
  const existing = new Set(store.bookmarks.map((b) => b.url));
  for (const line of lines.slice(1)) {
    const parts = line.split(',');
    if (parts.length < 2) { result.skipped++; continue; }
    const [id, url, , tagsPart] = parts;
    if (!url) { result.skipped++; continue; }
    if (existing.has(url)) { result.skipped++; continue; }
    const tags = normalizeTags(tagsPart ? tagsPart.split(';').filter(Boolean) : []);
    store.bookmarks.push({ id: id || randomUUID(), url, tags, createdAt: new Date().toISOString() });
    existing.add(url);
    result.added++;
  }
  return result;
}
