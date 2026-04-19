import { loadStore } from './storage';
import { searchBookmarks, filterByTags } from './search';
import { formatBookmarkList, formatCount } from './format';

export interface SearchOptions {
  tags?: string[];
  limit?: number;
  plain?: boolean;
}

export async function cmdSearch(query: string, options: SearchOptions = {}): Promise<void> {
  const store = await loadStore();
  const { tags, limit = 20, plain = false } = options;

  let results = query
    ? searchBookmarks(store.bookmarks, query, limit)
    : store.bookmarks.slice(0, limit);

  if (tags && tags.length > 0) {
    results = filterByTags(results, tags);
  }

  if (results.length === 0) {
    console.log('No bookmarks found.');
    return;
  }

  console.log(formatBookmarkList(results, plain));
  console.log(formatCount(results.length, 'bookmark'));
}

export async function cmdList(options: SearchOptions = {}): Promise<void> {
  return cmdSearch('', options);
}
