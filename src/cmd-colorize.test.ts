import { describe, it, expect } from "vitest";
import {
  setColor,
  getColor,
  filterByColor,
  clearColor,
  isValidColor,
  listColoredBookmarks,
} from "./cmd-colorize";
import { BookmarkStore, Bookmark } from "./types";

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: "1", url: "https://example.com", tags: [], createdAt: "2024-01-01" } as unknown as Bookmark,
      { id: "2", url: "https://github.com", tags: [], createdAt: "2024-01-02" } as unknown as Bookmark,
      { id: "3", url: "https://news.ycombinator.com", tags: [], createdAt: "2024-01-03" } as unknown as Bookmark,
    ],
  } as BookmarkStore;
}

describe("isValidColor", () => {
  it("accepts valid colors", () => {
    expect(isValidColor("red")).toBe(true);
    expect(isValidColor("blue")).toBe(true);
    expect(isValidColor("none")).toBe(true);
  });

  it("rejects invalid colors", () => {
    expect(isValidColor("purple")).toBe(false);
    expect(isValidColor("")).toBe(false);
  });
});

describe("setColor / getColor", () => {
  it("sets a color on a bookmark", () => {
    const store = makeStore();
    const updated = setColor(store, "1", "red");
    const bm = updated.bookmarks.find((b) => b.id === "1")!;
    expect(getColor(bm)).toBe("red");
  });

  it("throws if bookmark not found", () => {
    const store = makeStore();
    expect(() => setColor(store, "99", "green")).toThrow("not found");
  });

  it("does not mutate original store", () => {
    const store = makeStore();
    setColor(store, "1", "blue");
    expect(getColor(store.bookmarks[0])).toBeUndefined();
  });
});

describe("clearColor", () => {
  it("removes color from bookmark", () => {
    let store = makeStore();
    store = setColor(store, "2", "yellow");
    store = clearColor(store, "2");
    const bm = store.bookmarks.find((b) => b.id === "2")!;
    expect(getColor(bm)).toBeUndefined();
  });
});

describe("filterByColor", () => {
  it("returns bookmarks with the given color", () => {
    let store = makeStore();
    store = setColor(store, "1", "green");
    store = setColor(store, "3", "green");
    const results = filterByColor(store, "green");
    expect(results).toHaveLength(2);
    expect(results.map((b) => b.id)).toEqual(["1", "3"]);
  });

  it("returns empty array when no matches", () => {
    const store = makeStore();
    expect(filterByColor(store, "cyan")).toHaveLength(0);
  });
});

describe("listColoredBookmarks", () => {
  it("returns message when none are colored", () => {
    const store = makeStore();
    expect(listColoredBookmarks(store)).toMatch(/No colored/);
  });

  it("lists colored bookmarks with icons", () => {
    let store = makeStore();
    store = setColor(store, "1", "red");
    const output = listColoredBookmarks(store);
    expect(output).toContain("🔴");
    expect(output).toContain("https://example.com");
  });
});
