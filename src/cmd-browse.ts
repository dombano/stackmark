import { BookmarkStore, Bookmark } from "./types";
import { searchBookmarks } from "./search";
import { filterByTags } from "./search";
import { formatBookmarkList } from "./format";

export interface BrowseOptions {
  tag?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export const PAGE_SIZE = 10;

export function browseBookmarks(
  store: BookmarkStore,
  options: BrowseOptions = {}
): { results: Bookmark[]; total: number; page: number; totalPages: number } {
  const { tag, query, page = 1, pageSize = PAGE_SIZE } = options;

  let results: Bookmark[] = store.bookmarks;

  if (tag) {
    results = filterByTags(results, [tag]);
  }

  if (query) {
    results = searchBookmarks(results, query);
  }

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = results.slice(start, start + pageSize);

  return { results: paged, total, page: safePage, totalPages };
}

export function formatBrowsePage(
  results: Bookmark[],
  page: number,
  totalPages: number,
  total: number
): string {
  if (results.length === 0) {
    return "No bookmarks found.";
  }
  const header = `Page ${page}/${totalPages} — ${total} bookmark(s) total\n`;
  return header + formatBookmarkList(results);
}

export function cmdBrowse(
  store: BookmarkStore,
  options: BrowseOptions = {}
): string {
  const { results, total, page, totalPages } = browseBookmarks(store, options);
  return formatBrowsePage(results, page, totalPages, total);
}
