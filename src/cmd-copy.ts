import * as clipboardy from "clipboardy";
import { loadStore } from "./storage";
import { resolveStorePath } from "./config";
import { findBookmark } from "./storage";
import { formatBookmarkPlain } from "./format";

export type CopyField = "url" | "title" | "all";

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

  await clipboardy.write(text);
  console.log(`Copied to clipboard: ${text}`);
}
