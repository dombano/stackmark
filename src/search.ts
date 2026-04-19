/**
 * Fuzzy search utilities for filtering bookmarks by URL, title, or tags.
 */

import { Bookmark } from './storage';

/**
 * Computes a simple fuzzy match score between a query and a target string.
 * Returns a positive score if matched, 0 if not.
 */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (t.includes(q)) {
    // Exact substring match gets highest score
    return 100 + (q.length / t.length) * 50;
  }

  let qi = 0;
  let score = 0;
  let lastMatchIndex = -1;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      // Consecutive matches score higher
      score += lastMatchIndex === ti - 1 ? 10 : 1;
      lastMatchIndex = ti;
      qi++;
    }
  }

  // All query characters must be found in order
  if (qi < q.length) return 0;

  return score;
}

/**
 * Computes the best fuzzy score for a bookmark across URL, title, and tags.
 */
export function scoreBookmark(query: string, bookmark: Bookmark): number {
  const scores = [
    fuzzyScore(query, bookmark.url),
    bookmark.title ? fuzzyScore(query, bookmark.title) : 0,
    ...bookmark.tags.map((tag) => fuzzyScore(query, tag)),
  ];

  return Math.max(...scores);
}

export interface SearchResult {
  bookmark: Bookmark;
  score: number;
}

/**
 * Searches bookmarks using fuzzy matching against URL, title, and tags.
 * Returns results sorted by descending relevance score.
 *
 * @param query - The search string
 * @param bookmarks - List of bookmarks to search
 * @param limit - Maximum number of results to return (default: 20)
 */
export function searchBookmarks(
  query: string,
  bookmarks: Bookmark[],
  limit = 20
): SearchResult[] {
  if (!query.trim()) {
    // Return all bookmarks with equal score when query is empty
    return bookmarks
      .slice(0, limit)
      .map((bookmark) => ({ bookmark, score: 1 }));
  }

  const results: SearchResult[] = bookmarks
    .map((bookmark) => ({ bookmark, score: scoreBookmark(query, bookmark) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

/**
 * Filters bookmarks that contain ALL of the specified tags.
 *
 * @param tags - Tags to filter by
 * @param bookmarks - List of bookmarks to filter
 */
export function filterByTags(tags: string[], bookmarks: Bookmark[]): Bookmark[] {
  if (tags.length === 0) return bookmarks;

  const normalizedTags = tags.map((t) => t.toLowerCase());

  return bookmarks.filter((bookmark) => {
    const bookmarkTags = bookmark.tags.map((t) => t.toLowerCase());
    return normalizedTags.every((tag) => bookmarkTags.includes(tag));
  });
}
