import { Bookmark } from './storage';

export function formatBookmark(bookmark: Bookmark, index?: number): string {
  const prefix = index !== undefined ? `${index + 1}. ` : '';
  const tags = bookmark.tags.length > 0 ? ` [${bookmark.tags.join(', ')}]` : '';
  const title = bookmark.title ? `${bookmark.title}\n   ` : '';
  return `${prefix}${title}${bookmark.url}${tags}`;
}

export function formatBookmarkList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No bookmarks found.';
  return bookmarks.map((b, i) => formatBookmark(b, i)).join('\n');
}

export function formatBookmarkPlain(bookmark: Bookmark): string {
  return bookmark.url;
}

export function formatCount(count: number, label = 'bookmark'): string {
  return `${count} ${label}${count === 1 ? '' : 's'}`;
}

export function formatTagList(tagCounts: Record<string, number>): string {
  const entries = Object.entries(tagCounts);
  if (entries.length === 0) return 'No tags found.';
  const maxLen = Math.max(...entries.map(([t]) => t.length));
  return entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tag, count]) => `${tag.padEnd(maxLen)}  ${formatCount(count)}`)
    .join('\n');
}
