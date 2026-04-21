import { Store, Bookmark } from "./types";
import { findBookmark } from "./storage";
import { findByAlias } from "./cmd-alias";

export type ShareFormat = "url" | "markdown" | "text" | "json";

export function formatShareOutput(bookmark: Bookmark, format: ShareFormat): string {
  switch (format) {
    case "url":
      return bookmark.url;
    case "markdown": {
      const tags = bookmark.tags.length > 0 ? ` (${bookmark.tags.map(t => `#${t}`).join(" ")})` : "";
      return `[${bookmark.title || bookmark.url}](${bookmark.url})${tags}`;
    }
    case "json":
      return JSON.stringify(
        { url: bookmark.url, title: bookmark.title, tags: bookmark.tags, notes: bookmark.notes },
        null,
        2
      );
    case "text":
    default: {
      const parts = [`URL: ${bookmark.url}`];
      if (bookmark.title) parts.push(`Title: ${bookmark.title}`);
      if (bookmark.tags.length > 0) parts.push(`Tags: ${bookmark.tags.join(", ")}`);
      if (bookmark.notes) parts.push(`Notes: ${bookmark.notes}`);
      return parts.join("\n");
    }
  }
}

export function cmdShare(
  store: Store,
  query: string,
  format: ShareFormat = "url",
  out: (msg: string) => void = console.log,
  err: (msg: string) => void = console.error
): void {
  const byAlias = findByAlias(store, query);
  const bookmark = byAlias ?? findBookmark(store, query);

  if (!bookmark) {
    err(`No bookmark found for: ${query}`);
    return;
  }

  const output = formatShareOutput(bookmark, format);
  out(output);
}
