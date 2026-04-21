import * as clipboardy from "clipboardy";
import { loadStore } from "./storage";
import { resolveStorePath } from "./config";
import { findBookmark } from "./storage";
import { formatBookmarkPlain } from "./format";

export type CopyField = "url" | "title" | "all";

/**
 * Copies a bookmark field to the system clipboard.
 *
 * @param query - Search query to locate the bookmark (by title, URL, or tag).
 * @param options.field - Which field to copy: "url" (default), "title", or "all".
 * @param options.storePath - Override path to the bookmark store file.
 */
export async function cmdCopy(
  query: string,
  options: { field?: CopyField; storePath?: string } = {}
): Promise<void> {
  const storePath = options.storePath ?? resolveStorePath();
  const store = loadStore(storePath);
  const field: CopyField = options.field ?? "url";

  const bookmark = findBookmark(store, query);
  if (!bookmark) {
    console.error(`No bookmark found matching: ${query}`);
    process.exit(1);
  }

  let text: string;
  switch (field) {
    case "url":
      text = bookmark.url;
      break;
    case "title":
      text = bookmark.title ?? bookmark.url;
      break;
    case "all":
      text = formatBookmarkPlain(bookmark);
      break;
    default:
      text = bookmark.url;
  }

  try {
    await clipboardy.write(text);
  } catch (err) {
    console.error(`Failed to write to clipboard: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  console.log(`Copied to clipboard: ${text}`);
}
