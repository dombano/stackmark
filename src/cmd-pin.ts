import * as fs from "fs";
import { loadStore, saveStore } from "./storage";
import { resolveStorePath } from "./config";
import { formatBookmark } from "./format";
import type { Store } from "./types";

export function cmdPin(url: string, options: { unpin?: boolean } = {}): void {
  const storePath = resolveStorePath();
  const store = loadStore(storePath);

  const bookmark = store.bookmarks.find((b) => b.url === url);
  if (!bookmark) {
    console.error(`Bookmark not found: ${url}`);
    process.exit(1);
  }

  const wasPinned = (bookmark as any).pinned === true;
  const shouldUnpin = options.unpin ?? false;

  if (shouldUnpin) {
    (bookmark as any).pinned = false;
    saveStore(storePath, store);
    console.log(`Unpinned: ${formatBookmark(bookmark)}`);
  } else {
    (bookmark as any).pinned = true;
    saveStore(storePath, store);
    console.log(`Pinned: ${formatBookmark(bookmark)}`);
  }
}

export function cmdPinList(): void {
  const storePath = resolveStorePath();
  const store = loadStore(storePath);

  const pinned = store.bookmarks.filter((b) => (b as any).pinned === true);

  if (pinned.length === 0) {
    console.log("No pinned bookmarks.");
    return;
  }

  console.log(`Pinned bookmarks (${pinned.length}):`);
  for (const b of pinned) {
    console.log(`  ${formatBookmark(b)}`);
  }
}
