import { describe, it, expect } from "vitest";
import { browseBookmarks, formatBrowsePage, cmdBrowse, PAGE_SIZE } from "./cmd-browse";
import { BookmarkStore, Bookmark } from "./types";

function makeStore(count: number): BookmarkStore {
  const bookmarks: Bookmark[] = Array.from({ length: count }, (_, i) => ({
    id: `id-${i}`,
    url: `https://example.com/${i}`,
    title: `Bookmark ${i}`,
    tags: i % 2 === 0 ? ["even"] : ["odd"],
    createdAt: new Date(2024, 0, i + 1).toISOString(),
  }));
  return { bookmarks };
}

describe("browseBookmarks", () => {
  it("returns first page by default", () => {
    const store = makeStore(25);
    const { results, total, page, totalPages } = browseBookmarks(store);
    expect(results).toHaveLength(PAGE_SIZE);
    expect(total).toBe(25);
    expect(page).toBe(1);
    expect(totalPages).toBe(3);
  });

  it("returns correct page", () => {
    const store = makeStore(25);
    const { results, page } = browseBookmarks(store, { page: 3 });
    expect(results).toHaveLength(5);
    expect(page).toBe(3);
  });

  it("clamps page to valid range", () => {
    const store = makeStore(5);
    const { page } = browseBookmarks(store, { page: 99 });
    expect(page).toBe(1);
  });

  it("filters by tag", () => {
    const store = makeStore(20);
    const { total } = browseBookmarks(store, { tag: "even" });
    expect(total).toBe(10);
  });

  it("filters by query", () => {
    const store = makeStore(10);
    const { total } = browseBookmarks(store, { query: "Bookmark 1" });
    expect(total).toBeGreaterThan(0);
  });

  it("returns empty for no matches", () => {
    const store = makeStore(5);
    const { results, total } = browseBookmarks(store, { tag: "nonexistent" });
    expect(results).toHaveLength(0);
    expect(total).toBe(0);
  });
});

describe("formatBrowsePage", () => {
  it("shows no bookmarks message when empty", () => {
    expect(formatBrowsePage([], 1, 1, 0)).toBe("No bookmarks found.");
  });

  it("includes page info in header", () => {
    const store = makeStore(3);
    const output = formatBrowsePage(store.bookmarks, 1, 1, 3);
    expect(output).toContain("Page 1/1");
    expect(output).toContain("3 bookmark(s) total");
  });
});

describe("cmdBrowse", () => {
  it("returns formatted output", () => {
    const store = makeStore(5);
    const output = cmdBrowse(store);
    expect(output).toContain("Page 1/1");
  });
});
