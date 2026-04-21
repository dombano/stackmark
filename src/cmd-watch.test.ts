import { formatWatchSummary } from "./cmd-watch";
import { BookmarkStore } from "./types";

function makeStore(overrides: Partial<BookmarkStore> = {}): BookmarkStore {
  return {
    bookmarks: [
      {
        id: "1",
        url: "https://example.com",
        title: "Example",
        tags: ["web", "tools"],
        createdAt: new Date("2024-01-01").toISOString(),
        pinned: false,
      },
      {
        id: "2",
        url: "https://github.com",
        title: "GitHub",
        tags: ["dev", "tools"],
        createdAt: new Date("2024-02-15").toISOString(),
        pinned: true,
      },
      {
        id: "3",
        url: "https://news.ycombinator.com",
        title: "Hacker News",
        tags: ["news"],
        createdAt: new Date("2024-03-10").toISOString(),
        pinned: false,
      },
    ],
    ...overrides,
  };
}

describe("formatWatchSummary", () => {
  it("includes total bookmark count", () => {
    const store = makeStore();
    const output = formatWatchSummary(store);
    expect(output).toContain("3");
  });

  it("lists top tags", () => {
    const store = makeStore();
    const output = formatWatchSummary(store);
    expect(output).toContain("tools");
  });

  it("shows pinned count", () => {
    const store = makeStore();
    const output = formatWatchSummary(store);
    expect(output).toContain("1");
  });

  it("handles empty store", () => {
    const store: BookmarkStore = { bookmarks: [] };
    const output = formatWatchSummary(store);
    expect(output).toContain("0");
  });

  it("shows most recently added bookmark title", () => {
    const store = makeStore();
    const output = formatWatchSummary(store);
    expect(output).toContain("Hacker News");
  });
});
