import { Bookmark, BookmarkStore } from './storage';

export type ExportFormat = 'json' | 'csv' | 'markdown';

export function exportToJson(store: BookmarkStore): string {
  return JSON.stringify(store.bookmarks, null, 2);
}

export function exportToCsv(store: BookmarkStore): string {
  const header = 'id,url,title,tags,createdAt';
  const rows = store.bookmarks.map((b) => {
    const tags = b.tags.join(';');
    const title = `"${(b.title ?? '').replace(/"/g, '""')}"`;
    return `${b.id},${b.url},${title},${tags},${b.createdAt}`;
  });
  return [header, ...rows].join('\n');
}

export function exportToMarkdown(store: BookmarkStore): string {
  if (store.bookmarks.length === 0) return '_No bookmarks._\n';
  const lines: string[] = ['# Bookmarks', ''];
  for (const b of store.bookmarks) {
    const title = b.title ?? b.url;
    lines.push(`- [${title}](${b.url})`);
    if (b.tags.length > 0) {
      lines.push(`  Tags: ${b.tags.map((t) => '`' + t + '`').join(', ')}`);
    }
  }
  return lines.join('\n') + '\n';
}

export function exportStore(store: BookmarkStore, format: ExportFormat): string {
  switch (format) {
    case 'json': return exportToJson(store);
    case 'csv': return exportToCsv(store);
    case 'markdown': return exportToMarkdown(store);
  }
}
