import * as fs from "fs";
import * as path from "path";
import { BookmarkStore, Bookmark } from "./types";
import { validateUrl } from "./cmd-validate";

/** Result of a watch check for a single bookmark */
export interface WatchResult {
  bookmark: Bookmark;
  reachable: boolean;
  statusCode?: number;
  error?: string;
  checkedAt: string;
}

/** Summary of a full watch run */
export interface WatchSummary {
  total: number;
  reachable: number;
  unreachable: number;
  results: WatchResult[];
}

/**
 * Check whether a URL is reachable by performing a HEAD request.
 * Falls back to GET if HEAD is not supported.
 */
export async function checkUrl(url: string): Promise<{ reachable: boolean; statusCode?: number; error?: string }> {
  // Only check http/https URLs
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { reachable: true }; // skip non-web URLs
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    }).finally(() => clearTimeout(timeout));

    if (res.status === 405) {
      // HEAD not allowed — retry with GET
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 8000);
      const res2 = await fetch(url, {
        method: "GET",
        signal: controller2.signal,
        redirect: "follow",
      }).finally(() => clearTimeout(timeout2));
      return { reachable: res2.ok || res2.status < 400, statusCode: res2.status };
    }

    return { reachable: res.ok || res.status < 400, statusCode: res.status };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { reachable: false, error: "timeout" };
    }
    return { reachable: false, error: err?.message ?? "unknown error" };
  }
}

/**
 * Run a reachability check on all bookmarks in the store.
 * Optionally filter to only bookmarks with specific tags.
 */
export async function watchBookmarks(
  store: BookmarkStore,
  options: { tags?: string[]; concurrency?: number } = {}
): Promise<WatchSummary> {
  const { tags, concurrency = 5 } = options;

  let targets = store.bookmarks;
  if (tags && tags.length > 0) {
    targets = targets.filter((b) =>
      tags.some((t) => b.tags.map((bt) => bt.toLowerCase()).includes(t.toLowerCase()))
    );
  }

  const results: WatchResult[] = [];
  const now = new Date().toISOString();

  // Process in batches to limit concurrency
  for (let i = 0; i < targets.length; i += concurrency) {
    const batch = targets.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (bookmark): Promise<WatchResult> => {
        const check = await checkUrl(bookmark.url);
        return {
          bookmark,
          reachable: check.reachable,
          statusCode: check.statusCode,
          error: check.error,
          checkedAt: now,
        };
      })
    );
    results.push(...batchResults);
  }

  const reachable = results.filter((r) => r.reachable).length;
  return {
    total: results.length,
    reachable,
    unreachable: results.length - reachable,
    results,
  };
}

/** Format a watch summary for terminal output */
export function formatWatchSummary(summary: WatchSummary, verbose = false): string {
  const lines: string[] = [];

  lines.push(`Checked ${summary.total} bookmark(s): ${summary.reachable} reachable, ${summary.unreachable} unreachable.`);

  const broken = summary.results.filter((r) => !r.reachable);
  if (broken.length > 0) {
    lines.push("");
    lines.push("Unreachable bookmarks:");
    for (const r of broken) {
      const detail = r.statusCode ? `HTTP ${r.statusCode}` : r.error ?? "unknown";
      lines.push(`  [${r.bookmark.id}] ${r.bookmark.url}  (${detail})`);
    }
  }

  if (verbose) {
    lines.push("");
    lines.push("All results:");
    for (const r of summary.results) {
      const status = r.reachable ? "OK" : "FAIL";
      const detail = r.statusCode ? `HTTP ${r.statusCode}` : r.error ? `(${r.error})` : "";
      lines.push(`  [${status}] ${r.bookmark.url} ${detail}`.trimEnd());
    }
  }

  return lines.join("\n");
}
