import { Store } from "./types";
import { loadStore } from "./storage";
import { countByTag, listAllTags } from "./tags";
import { resolveStorePath, loadConfig } from "./config";

export interface StatsResult {
  total: number;
  tagged: number;
  untagged: number;
  uniqueTags: number;
  topTags: Array<{ tag: string; count: number }>;
  oldestDate: string | null;
  newestDate: string | null;
}

export function computeStats(store: Store): StatsResult {
  const bookmarks = store.bookmarks;
  const total = bookmarks.length;
  const tagged = bookmarks.filter((b) => b.tags && b.tags.length > 0).length;
  const untagged = total - tagged;

  const tagCounts = countByTag(store);
  const uniqueTags = Object.keys(tagCounts).length;
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const dates = bookmarks
    .map((b) => b.createdAt)
    .filter(Boolean)
    .sort();

  const oldestDate = dates.length > 0 ? dates[0] : null;
  const newestDate = dates.length > 0 ? dates[dates.length - 1] : null;

  return { total, tagged, untagged, uniqueTags, topTags, oldestDate, newestDate };
}

export function formatStats(stats: StatsResult): string {
  const lines: string[] = [
    `📚 Total bookmarks : ${stats.total}`,
    `🏷️  Tagged          : ${stats.tagged}`,
    `🔖 Untagged        : ${stats.untagged}`,
    `🗂️  Unique tags     : ${stats.uniqueTags}`,
  ];

  if (stats.topTags.length > 0) {
    lines.push("");
    lines.push("Top tags:");
    for (const { tag, count } of stats.topTags) {
      lines.push(`  ${tag.padEnd(20)} ${count}`);
    }
  }

  if (stats.oldestDate) {
    lines.push("");
    lines.push(`📅 Oldest : ${stats.oldestDate}`);
    lines.push(`📅 Newest : ${stats.newestDate}`);
  }

  return lines.join("\n");
}

export async function cmdStats(): Promise<void> {
  const config = await loadConfig();
  const storePath = resolveStorePath(config);
  const store = await loadStore(storePath);
  const stats = computeStats(store);
  console.log(formatStats(stats));
}
