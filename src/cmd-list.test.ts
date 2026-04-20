import { describe, it, expect, vi, beforeEach } from "vitest";
import { sortBookmarks, cmdList } from "./cmd-list";
import { Bookmark } from "./types";

const makeBookmark = (overrides: Partial<Bookmark> = {}): Bookmark => ({
  id: "abc123",
  url: "https://example.com",
  title: "Example",
  tags: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

describe("sortBookmarks", () => {
  const bmarks: Bookmark[] = [
    makeBookmark({ id: "1", title: "Zebra", createdAt: "2024-03-01T00:00:00.000Z" }),
    makeBookmark({ id: "2", title: "Apple", createdAt: "2024-01-01T00:00:00.000Z" }),
    makeBookmark({ id: "3", title: "Mango", createdAt: "2024-02-01T00:00:00.000Z" }),
  ];

  it("sorts newest first by default", () => {
    const result = sortBookmarks(bmarks, "newest");
    expect(result[0].id).toBe("1");
    expect(result[2].id).toBe("2");
  });

  it("sorts oldest first", () => {
    const result = sortBookmarks(bmarks, "oldest");
    expect(result[0].id).toBe("2");
    expect(result[2].id).toBe("1");
  });

  it("sorts alphabetically", () => {
    const result = sortBookmarks(bmarks, "alpha");
    expect(result[0].title).toBe("Apple");
    expect(result[2].title).toBe("Zebra");
  });
});

describe("cmdList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("prints 'No bookmarks found.' when store is empty", async () => {
    vi.mock("./storage", () => ({ loadStore: () => ({ bookmarks: [] }) }));
    vi.mock("./config", () => ({
      loadConfig: () => ({}),
      resolveStorePath: () => "/tmp/store.json",
    }));
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await cmdList();
    expect(spy).toHaveBeenCalledWith("No bookmarks found.");
  });
});
