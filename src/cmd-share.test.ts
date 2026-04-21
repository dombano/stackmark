import { describe, it, expect } from "vitest";
import { formatShareOutput, cmdShare } from "./cmd-share";
import { Store, Bookmark } from "./types";

function makeStore(overrides: Partial<Bookmark> = {}): Store {
  const bookmark: Bookmark = {
    id: "abc123",
    url: "https://example.com",
    title: "Example Site",
    tags: ["web", "demo"],
    notes: "A demo bookmark",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  return { bookmarks: [bookmark], aliases: {}, version: 1 };
}

describe("formatShareOutput", () => {
  it("returns url for url format", () => {
    const bm = makeStore().bookmarks[0];
    expect(formatShareOutput(bm, "url")).toBe("https://example.com");
  });

  it("returns markdown link with tags", () => {
    const bm = makeStore().bookmarks[0];
    const result = formatShareOutput(bm, "markdown");
    expect(result).toBe("[Example Site](https://example.com) (#web #demo)");
  });

  it("returns markdown link without tags when empty", () => {
    const bm = makeStore({ tags: [] }).bookmarks[0];
    const result = formatShareOutput(bm, "markdown");
    expect(result).toBe("[Example Site](https://example.com)");
  });

  it("returns text format with all fields", () => {
    const bm = makeStore().bookmarks[0];
    const result = formatShareOutput(bm, "text");
    expect(result).toContain("URL: https://example.com");
    expect(result).toContain("Title: Example Site");
    expect(result).toContain("Tags: web, demo");
    expect(result).toContain("Notes: A demo bookmark");
  });

  it("returns json format", () => {
    const bm = makeStore().bookmarks[0];
    const result = formatShareOutput(bm, "json");
    const parsed = JSON.parse(result);
    expect(parsed.url).toBe("https://example.com");
    expect(parsed.title).toBe("Example Site");
    expect(parsed.tags).toEqual(["web", "demo"]);
  });
});

describe("cmdShare", () => {
  it("outputs the bookmark url by default", () => {
    const store = makeStore();
    const out: string[] = [];
    cmdShare(store, "abc123", "url", (m) => out.push(m));
    expect(out[0]).toBe("https://example.com");
  });

  it("reports error when bookmark not found", () => {
    const store = makeStore();
    const errs: string[] = [];
    cmdShare(store, "notexist", "url", () => {}, (m) => errs.push(m));
    expect(errs[0]).toMatch(/No bookmark found/);
  });

  it("resolves by alias", () => {
    const store = makeStore();
    store.aliases = { mysite: "abc123" };
    const out: string[] = [];
    cmdShare(store, "mysite", "markdown", (m) => out.push(m));
    expect(out[0]).toContain("https://example.com");
  });
});
