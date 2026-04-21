import { BookmarkStore, Bookmark } from "./types";

export interface DuplicateGroup {
  url: string;
  bookmarks: Bookmark[];
}

export function findDuplicates(store: BookmarkStore): DuplicateGroup[] {
  const urlMap = new Map<string, Bookmark[]>();

  for (const bookmark of store.bookmarks) {
    const normalized = bookmark.url.replace(/\/+$/, "").toLowerCase();
    if (!urlMap.has(normalized)) {
      urlMap.set(normalized, []);
    }
    urlMap.get(normalized)!.push(bookmark);
  }

  const groups: DuplicateGroup[] = [];
  for (const [url, bookmarks] of urlMap.entries()) {
    if (bookmarks.length > 1) {
      groups.push({ url, bookmarks });
    }
  }

  return groups;
}

export function mergeDuplicateGroup(group: DuplicateGroup): Bookmark {
  const sorted = [...group.bookmarks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const base = sorted[0];
  const allTags = new Set<string>();
  for (const bm of group.bookmarks) {
    for (const tag of bm.tags) {
      allTags.add(tag);
    }
  }

  return {
    ...base,
    tags: Array.from(allTags),
  };
}

export function dedupeStore(
  store: BookmarkStore,
  strategy: "keep-newest" | "keep-oldest" | "merge" = "merge"
): { store: BookmarkStore; removed: number } {
  const groups = findDuplicates(store);
  if (groups.length === 0) {
    return { store, removed: 0 };
  }

  const duplicateIds = new Set<string>();
  const replacements: Bookmark[] = [];

  for (const group of groups) {
    const sorted = [...group.bookmarks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let keeper: Bookmark;
    if (strategy === "keep-newest") {
      keeper = sorted[0];
    } else if (strategy === "keep-oldest") {
      keeper = sorted[sorted.length - 1];
    } else {
      keeper = mergeDuplicateGroup(group);
    }

    for (const bm of group.bookmarks) {
      if (bm.id !== keeper.id) {
        duplicateIds.add(bm.id);
      }
    }

    if (strategy === "merge") {
      replacements.push(keeper);
    }
  }

  const filtered = store.bookmarks.filter((bm) => !duplicateIds.has(bm.id));

  if (strategy === "merge") {
    const keeperIds = new Set(replacements.map((r) => r.id));
    const withReplacements = filtered.map((bm) => {
      const replacement = replacements.find((r) => r.id === bm.id);
      return replacement ?? bm;
    });
    return {
      store: { ...store, bookmarks: withReplacements },
      removed: duplicateIds.size,
    };
  }

  return {
    store: { ...store, bookmarks: filtered },
    removed: duplicateIds.size,
  };
}
