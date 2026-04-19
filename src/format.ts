import { Bookmark } from './storage';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const GRAY = '\x1b[90m';

export function formatBookmark(bookmark: Bookmark, index?: number): string {
  const prefix = index !== undefined ? `${DIM}${index + 1}.${RESET} ` : '';
  const title = `${BOLD}${CYAN}${bookmark.title}${RESET}`;
  const url = `${GREEN}${bookmark.url}${RESET}`;
  const tags =
    bookmark.tags.length > 0
      ? ` ${YELLOW}[${bookmark.tags.join(', ')}]${RESET}`
      : '';
  const note = bookmark.note ? `\n   ${DIM}${GRAY}${bookmark.note}${RESET}` : '';
  const date = `${GRAY}${new Date(bookmark.createdAt).toLocaleDateString()}${RESET}`;

  return `${prefix}${title}\n   ${url}${tags} ${date}${note}`;
}

export function formatBookmarkList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) {
    return `${DIM}No bookmarks found.${RESET}`;
  }
  return bookmarks.map((b, i) => formatBookmark(b, i)).join('\n\n');
}

export function formatBookmarkPlain(bookmark: Bookmark, index?: number): string {
  const prefix = index !== undefined ? `${index + 1}. ` : '';
  const tags = bookmark.tags.length > 0 ? ` [${bookmark.tags.join(', ')}]` : '';
  const note = bookmark.note ? `\n   ${bookmark.note}` : '';
  const date = new Date(bookmark.createdAt).toLocaleDateString();
  return `${prefix}${bookmark.title}\n   ${bookmark.url}${tags} ${date}${note}`;
}

export function formatCount(count: number, total: number): string {
  return `${DIM}Showing ${RESET}${BOLD}${count}${RESET}${DIM} of ${total} bookmark${total !== 1 ? 's' : ''}${RESET}`;
}
