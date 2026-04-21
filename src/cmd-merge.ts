import { Store, Bookmark } from "./types";
import { findBookmark, removeBookmark } from "./storage";
import { normalizeTags } from "./tags";

export interface MergeResult {
  merged: Bookmark;
  removedIds: string[];
}

export function mergeBookmarks(
  store: Store,
  targetId: string,
  sourceIds: string[]
): MergeResult {
  const target = findBookmark(store, targetId);
  if (!target) throw new Error(`Bookmark not found: ${targetId}`);

  const sources: Bookmark[] = [];
  for (const id of sourceIds) {
    const bm = findBookmark(store, id);
    if (!bm) throw new Error(`Bookmark not found: ${id}`);
    if (id === targetId) throw new Error(`Cannot merge bookmark into itself: ${id}`);
    sources.push(bm);
  }

  const allTags = normalizeTags([
    ...target.tags,
    ...sources.flatMap((s) => s.tags),
  ]);

  const mergedNotes = [target.notes, ...sources.map((s) => s.notes)]
    .filter(Boolean)
    .join(" | ");

  const merged: Bookmark = {
    ...target,
    tags: allTags,
    notes: mergedNotes || undefined,
    updatedAt: new Date().toISOString(),
  };

  const idx = store.bookmarks.findIndex((b) => b.id === targetId);
  store.bookmarks[idx] = merged;

  for (const id of sourceIds) {
    removeBookmark(store, id);
  }

  return { merged, removedIds: sourceIds };
}

export function cmdMerge(
  store: Store,
  targetId: string,
  sourceIds: string[],
  log: (msg: string) => void = console.log
): void {
  const result = mergeBookmarks(store, targetId, sourceIds);
  log(`Merged ${result.removedIds.length} bookmark(s) into ${result.merged.id}.`);
  log(`Tags: ${result.merged.tags.join(", ") || "(none)"}`);
  if (result.merged.notes) {
    log(`Notes: ${result.merged.notes}`);
  }
}
