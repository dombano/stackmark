import { describe, it, expect } from "vitest";
import { findDuplicates, mergeDuplicateGroup, dedupeStore } from "./cmd-dedupe";
import { BookmarkStore, Bookmark } from "./types";

function makeStore(bookmarks: Partial<Bookmark>[]): BookmarkStore {
  return {
    bookmarks: bookmarks.map((b, i) => ({
      id: b.id ?? `id-${i}`,
      url: b.url ?? `https://example.com/${i}`,
      title: b.title ?? `Title ${i}`,
      tags: b.tags ?? [],
      createdAt: b.createdAt ?? new Date(1000 * (i + 1)).toISOString(),
      pinned: b.pinned ?? false,
    })),
    version: 1,
  };
}

describe("findDuplicates", () => {
  it("returns empty array when no duplicates", () => {
    const store = makeStore([
      { url: "https://a.com" },
      { url: "https://b.com" },
    ]);
    expect(findDuplicates(store)).toEqual([]);
  });

  it("detects duplicate URLs", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com" },
      { id: "2", url: "https://a.com" },
      { id: "3", url: "https://b.com" },
    ]);
    const groups = findDuplicates(store);
    expect(groups).toHaveLength(1);
    expect(groups[0].bookmarks).toHaveLength(2);
  });

  it("normalizes trailing slashes", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com/" },
      { id: "2", url: "https://a.com" },
    ]);
    const groups = findDuplicates(store);
    expect(groups).toHaveLength(1);
  });
});

describe("mergeDuplicateGroup", () => {
  it("merges tags from all duplicates", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com", tags: ["dev"], createdAt: new Date(2000).toISOString() },
      { id: "2", url: "https://a.com", tags: ["work"], createdAt: new Date(1000).toISOString() },
    ]);
    const group = findDuplicates(store)[0];
    const merged = mergeDuplicateGroup(group);
    expect(merged.tags).toContain("dev");
    expect(merged.tags).toContain("work");
  });

  it("keeps the newest bookmark as base", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com", title: "Old", createdAt: new Date(1000).toISOString() },
      { id: "2", url: "https://a.com", title: "New", createdAt: new Date(9000).toISOString() },
    ]);
    const group = findDuplicates(store)[0];
    const merged = mergeDuplicateGroup(group);
    expect(merged.title).toBe("New");
  });
});

describe("dedupeStore", () => {
  it("returns unchanged store when no duplicates", () => {
    const store = makeStore([{ url: "https://a.com" }, { url: "https://b.com" }]);
    const { store: result, removed } = dedupeStore(store);
    expect(removed).toBe(0);
    expect(result.bookmarks).toHaveLength(2);
  });

  it("removes duplicates with keep-newest strategy", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com", createdAt: new Date(1000).toISOString() },
      { id: "2", url: "https://a.com", createdAt: new Date(9000).toISOString() },
    ]);
    const { store: result, removed } = dedupeStore(store, "keep-newest");
    expect(removed).toBe(1);
    expect(result.bookmarks).toHaveLength(1);
    expect(result.bookmarks[0].id).toBe("2");
  });

  it("removes duplicates with keep-oldest strategy", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com", createdAt: new Date(1000).toISOString() },
      { id: "2", url: "https://a.com", createdAt: new Date(9000).toISOString() },
    ]);
    const { store: result, removed } = dedupeStore(store, "keep-oldest");
    expect(removed).toBe(1);
    expect(result.bookmarks[0].id).toBe("1");
  });

  it("merges tags with merge strategy", () => {
    const store = makeStore([
      { id: "1", url: "https://a.com", tags: ["dev"], createdAt: new Date(1000).toISOString() },
      { id: "2", url: "https://a.com", tags: ["oss"], createdAt: new Date(9000).toISOString() },
    ]);
    const { store: result, removed } = dedupeStore(store, "merge");
    expect(removed).toBe(1);
    expect(result.bookmarks[0].tags).toContain("dev");
    expect(result.bookmarks[0].tags).toContain("oss");
  });
});
