import { Bookmark, Store } from './storage';

export function listAllTags(store: Store): string[] {
  const tagSet = new Set<string>();
  for (const bookmark of store.bookmarks) {
    for (const tag of bookmark.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function countByTag(store: Store): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const bookmark of store.bookmarks) {
    for (const tag of bookmark.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return counts;
}

export function renameTag(store: Store, oldTag: string, newTag: string): number {
  let affected = 0;
  for (const bookmark of store.bookmarks) {
    const idx = bookmark.tags.indexOf(oldTag);
    if (idx !== -1) {
      bookmark.tags[idx] = newTag;
      affected++;
    }
  }
  return affected;
}

export function removeTag(store: Store, tag: string): number {
  let affected = 0;
  for (const bookmark of store.bookmarks) {
    const before = bookmark.tags.length;
    bookmark.tags = bookmark.tags.filter(t => t !== tag);
    if (bookmark.tags.length !== before) affected++;
  }
  return affected;
}

export function normalizeTags(tags: string[]): string[] {
  return Array.from(
    new Set(tags.map(t => t.toLowerCase().trim()).filter(t => t.length > 0))
  ).sort();
}
