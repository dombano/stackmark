import { describe, it, expect, beforeEach } from "vitest";
import { Store, Bookmark } from "./types";
import { mergeBookmarks, cmdMerge } from "./cmd-merge";

function makeStore(): Store {
  return {
    bookmarks: [
      {
        id: "a1",
        url: "https://example.com",
        title: "Example",
        tags: ["dev", "web"],
        notes: "first note",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "b2",
        url: "https://other.com",
        title: "Other",
        tags: ["web", "tools"],
        notes: "second note",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: "c3",
        url: "https://third.com",
        title: "Third",
        tags: ["ref"],
        notes: undefined,
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z",
      },
    ],
  } as Store;
}

describe("mergeBookmarks", () => {
  let store: Store;
  beforeEach(() => { store = makeStore(); });

  it("merges tags from source into target without duplicates", () => {
    const { merged } = mergeBookmarks(store, "a1", ["b2"]);
    expect(merged.tags).toContain("dev");
    expect(merged.tags).toContain("web");
    expect(merged.tags).toContain("tools");
    expect(merged.tags.filter((t) => t === "web").length).toBe(1);
  });

  it("removes source bookmarks from store", () => {
    mergeBookmarks(store, "a1", ["b2"]);
    expect(store.bookmarks.find((b) => b.id === "b2")).toBeUndefined();
    expect(store.bookmarks.find((b) => b.id === "a1")).toBeDefined();
  });

  it("concatenates notes from all sources", () => {
    const { merged } = mergeBookmarks(store, "a1", ["b2"]);
    expect(merged.notes).toContain("first note");
    expect(merged.notes).toContain("second note");
  });

  it("handles source with no notes", () => {
    const { merged } = mergeBookmarks(store, "a1", ["c3"]);
    expect(merged.notes).toBe("first note");
  });

  it("merges multiple sources at once", () => {
    const { merged, removedIds } = mergeBookmarks(store, "a1", ["b2", "c3"]);
    expect(removedIds).toHaveLength(2);
    expect(merged.tags).toContain("ref");
    expect(store.bookmarks).toHaveLength(1);
  });

  it("throws if target not found", () => {
    expect(() => mergeBookmarks(store, "zzz", ["b2"])).toThrow("not found");
  });

  it("throws if source not found", () => {
    expect(() => mergeBookmarks(store, "a1", ["zzz"])).toThrow("not found");
  });

  it("throws if merging bookmark into itself", () => {
    expect(() => mergeBookmarks(store, "a1", ["a1"])).toThrow("itself");
  });
});

describe("cmdMerge", () => {
  it("logs merge summary", () => {
    const store = makeStore();
    const logs: string[] = [];
    cmdMerge(store, "a1", ["b2"], (msg) => logs.push(msg));
    expect(logs[0]).toMatch(/Merged 1 bookmark/);
    expect(logs[1]).toMatch(/Tags:/);
  });
});
