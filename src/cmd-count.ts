import { BookmarkStore } from './types';

export interface CountResult {
  total: number;
  tagged: number;
  untagged: number;
  pinned: number;
  archived: number;
  byTag: Record<string, number>;
}

export function computeCount(store: BookmarkStore): CountResult {
  const bookmarks = store.bookmarks;
  const byTag: Record<string, number> = {};

  let tagged = 0;
  let pinned = 0;
  let archived = 0;

  for (const bm of bookmarks) {
    if (bm.tags && bm.tags.length > 0) {
      tagged++;
      for (const tag of bm.tags) {
        byTag[tag] = (byTag[tag] ?? 0) + 1;
      }
    }
    if ((bm as any).pinned) pinned++;
    if ((bm as any).archived) archived++;
  }

  return {
    total: bookmarks.length,
    tagged,
    untagged: bookmarks.length - tagged,
    pinned,
    archived,
    byTag,
  };
}

export function formatCount(result: CountResult, verbose = false): string {
  const lines: string[] = [
    `Total bookmarks : ${result.total}`,
    `Tagged          : ${result.tagged}`,
    `Untagged        : ${result.untagged}`,
    `Pinned          : ${result.pinned}`,
    `Archived        : ${result.archived}`,
  ];

  if (verbose && Object.keys(result.byTag).length > 0) {
    lines.push('');
    lines.push('By tag:');
    const sorted = Object.entries(result.byTag).sort((a, b) => b[1] - a[1]);
    for (const [tag, count] of sorted) {
      lines.push(`  ${tag.padEnd(20)} ${count}`);
    }
  }

  return lines.join('\n');
}

export function cmdCount(
  store: BookmarkStore,
  options: { verbose?: boolean; json?: boolean } = {}
): string {
  const result = computeCount(store);
  if (options.json) {
    return JSON.stringify(result, null, 2);
  }
  return formatCount(result, options.verbose);
}
