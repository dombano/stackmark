import { Store, Bookmark } from './types';
import { formatBookmarkList } from './format';

export interface RecentOptions {
  count?: number;
  tags?: string[];
  plain?: boolean;
}

export function getRecentBookmarks(
  store: Store,
  options: RecentOptions = {}
): Bookmark[] {
  const { count = 10, tags = [] } = options;

  let bookmarks = [...store.bookmarks];

  if (tags.length > 0) {
    const normalizedTags = tags.map((t) => t.toLowerCase());
    bookmarks = bookmarks.filter((b) =>
      normalizedTags.every((tag) =>
        (b.tags ?? []).map((t) => t.toLowerCase()).includes(tag)
      )
    );
  }

  bookmarks.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return bookmarks.slice(0, count);
}

export function cmdRecent(
  store: Store,
  options: RecentOptions = {}
): string {
  const results = getRecentBookmarks(store, options);

  if (results.length === 0) {
    return 'No bookmarks found.';
  }

  return formatBookmarkList(results, { plain: options.plain });
}
