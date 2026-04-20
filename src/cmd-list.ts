import { loadStore } from "./storage";
import { resolveStorePath, loadConfig } from "./config";
import { filterByTags } from "./search";
import { formatBookmarkList, formatCount, formatTagList } from "./format";
import { Bookmark } from "./types";

export interface ListOptions {
  tags?: string[];
  limit?: number;
  sort?: "newest" | "oldest" | "alpha";
  plain?: boolean;
}

export function sortBookmarks(bookmarks: Bookmark[], sort: ListOptions["sort"]): Bookmark[] {
  const copy = [...bookmarks];
  if (sort === "oldest") {
    return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  if (sort === "alpha") {
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }
  // newest (default)
  return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function cmdList(options: ListOptions = {}): Promise<void> {
  const config = loadConfig();
  const storePath = resolveStorePath(config);
  const store = loadStore(storePath);

  let bookmarks = store.bookmarks;

  if (options.tags && options.tags.length > 0) {
    bookmarks = filterByTags(bookmarks, options.tags);
  }

  bookmarks = sortBookmarks(bookmarks, options.sort ?? "newest");

  if (options.limit && options.limit > 0) {
    bookmarks = bookmarks.slice(0, options.limit);
  }

  if (bookmarks.length === 0) {
    console.log("No bookmarks found.");
    return;
  }

  console.log(formatBookmarkList(bookmarks, options.plain));
  console.log(formatCount(bookmarks.length, "bookmark"));

  if (!options.plain) {
    const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags))).sort();
    if (allTags.length > 0) {
      console.log("Tags: " + formatTagList(allTags));
    }
  }
}
