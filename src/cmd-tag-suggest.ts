import { BookmarkStore, Bookmark } from './types';
import { fuzzyScore } from './search';

/**
 * Suggest tags for a bookmark based on URL, title, and existing tags in the store.
 */
export function suggestTags(
  bookmark: Pick<Bookmark, 'url' | 'title' | 'tags'>,
  store: BookmarkStore,
  limit = 5
): string[] {
  const allTags = collectAllTags(store);
  const input = `${bookmark.url} ${bookmark.title ?? ''}`.toLowerCase();

  const scores: Map<string, number> = new Map();

  for (const tag of allTags) {
    if (bookmark.tags?.includes(tag)) continue;
    let score = 0;

    // Score based on tag appearing in URL/title
    if (input.includes(tag.toLowerCase())) {
      score += 10;
    }

    // Score based on fuzzy match of tag against input words
    const words = input.split(/[\s/._-]+/).filter(Boolean);
    for (const word of words) {
      const s = fuzzyScore(tag, word);
      if (s > 0) score += s;
    }

    // Boost frequently used tags
    const freq = tagFrequency(tag, store);
    score += Math.log1p(freq) * 2;

    if (score > 0) scores.set(tag, score);
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

function collectAllTags(store: BookmarkStore): string[] {
  const set = new Set<string>();
  for (const bm of store.bookmarks) {
    for (const tag of bm.tags ?? []) set.add(tag);
  }
  return Array.from(set);
}

function tagFrequency(tag: string, store: BookmarkStore): number {
  return store.bookmarks.filter(bm => bm.tags?.includes(tag)).length;
}

export function formatSuggestions(tags: string[]): string {
  if (tags.length === 0) return 'No tag suggestions found.';
  return `Suggested tags:\n${tags.map(t => `  • ${t}`).join('\n')}`;
}
