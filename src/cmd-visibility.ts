import { BookmarkStore, Bookmark } from "./types";

export type VisibilityLevel = "public" | "private" | "unlisted";

export function isValidVisibility(level: string): level is VisibilityLevel {
  return ["public", "private", "unlisted"].includes(level);
}

export function setVisibility(
  store: BookmarkStore,
  url: string,
  level: VisibilityLevel
): Bookmark | undefined {
  const bm = store.bookmarks.find((b) => b.url === url);
  if (!bm) return undefined;
  (bm as any).visibility = level;
  return bm;
}

export function removeVisibility(
  store: BookmarkStore,
  url: string
): boolean {
  const bm = store.bookmarks.find((b) => b.url === url);
  if (!bm) return false;
  delete (bm as any).visibility;
  return true;
}

export function getVisibility(
  store: BookmarkStore,
  url: string
): VisibilityLevel | null | undefined {
  const bm = store.bookmarks.find((b) => b.url === url);
  if (!bm) return undefined;
  return (bm as any).visibility ?? null;
}

export function filterByVisibility(
  store: BookmarkStore,
  level: VisibilityLevel
): Bookmark[] {
  return store.bookmarks.filter((b) => (b as any).visibility === level);
}

export function formatVisibilitySummary(store: BookmarkStore): string {
  const counts: Record<string, number> = { public: 0, private: 0, unlisted: 0, none: 0 };
  for (const bm of store.bookmarks) {
    const v = (bm as any).visibility;
    if (v && counts[v] !== undefined) {
      counts[v]++;
    } else {
      counts["none"]++;
    }
  }
  return [
    `public:   ${counts["public"]}`,
    `private:  ${counts["private"]}`,
    `unlisted: ${counts["unlisted"]}`,
    `none:     ${counts["none"]}`,
  ].join("\n");
}
