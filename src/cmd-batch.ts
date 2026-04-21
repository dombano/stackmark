import { BookmarkStore, Bookmark } from "./types";

export type BatchOperation =
  | { type: "add-tag"; tag: string }
  | { type: "remove-tag"; tag: string }
  | { type: "delete" }
  | { type: "set-label"; label: string };

export interface BatchResult {
  affected: number;
  skipped: number;
  ids: string[];
}

export function applyBatchOperation(
  store: BookmarkStore,
  ids: string[],
  op: BatchOperation
): BatchResult {
  const result: BatchResult = { affected: 0, skipped: 0, ids: [] };

  for (const id of ids) {
    const idx = store.bookmarks.findIndex((b) => b.id === id);
    if (idx === -1) {
      result.skipped++;
      continue;
    }

    const bookmark = store.bookmarks[idx];

    if (op.type === "add-tag") {
      if (!bookmark.tags.includes(op.tag)) {
        bookmark.tags = [...bookmark.tags, op.tag];
      }
      result.affected++;
      result.ids.push(id);
    } else if (op.type === "remove-tag") {
      bookmark.tags = bookmark.tags.filter((t) => t !== op.tag);
      result.affected++;
      result.ids.push(id);
    } else if (op.type === "delete") {
      store.bookmarks.splice(idx, 1);
      result.affected++;
      result.ids.push(id);
    } else if (op.type === "set-label") {
      (bookmark as any).label = op.label;
      result.affected++;
      result.ids.push(id);
    }
  }

  return result;
}

export function formatBatchResult(result: BatchResult, op: BatchOperation): string {
  const opLabel =
    op.type === "add-tag" ? `add tag "${op.tag}"`
    : op.type === "remove-tag" ? `remove tag "${op.tag}"`
    : op.type === "set-label" ? `set label "${(op as any).label}"`
    : "delete";

  const lines: string[] = [
    `Batch operation: ${opLabel}`,
    `  Affected : ${result.affected}`,
    `  Skipped  : ${result.skipped}`,
  ];
  if (result.ids.length > 0) {
    lines.push(`  IDs      : ${result.ids.join(", ")}`);
  }
  return lines.join("\n");
}
