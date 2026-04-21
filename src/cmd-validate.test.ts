import { describe, it, expect } from "vitest";
import {
  validateUrl,
  validateBookmark,
  validateStore,
  formatValidationSummary,
} from "./cmd-validate";
import { BookmarkStore, Bookmark } from "./types";

function makeStore(bookmarks: Partial<Bookmark>[]): BookmarkStore {
  return {
    bookmarks: bookmarks.map((b, i) => ({
      id: `id-${i}`,
      url: "https://example.com",
      title: "Example",
      tags: [],
      createdAt: new Date().toISOString(),
      ...b,
    })) as Bookmark[],
  };
}

describe("validateUrl", () => {
  it("accepts https URLs", () => {
    expect(validateUrl("https://example.com")).toBe(true);
  });

  it("accepts http URLs", () => {
    expect(validateUrl("http://example.com")).toBe(true);
  });

  it("rejects bare domains", () => {
    expect(validateUrl("example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateUrl("")).toBe(false);
  });
});

describe("validateBookmark", () => {
  it("returns no issues for a valid bookmark", () => {
    const result = validateBookmark({
      id: "1",
      url: "https://example.com",
      title: "Example",
      tags: ["dev"],
      createdAt: new Date().toISOString(),
    });
    expect(result.issues).toHaveLength(0);
  });

  it("reports empty URL", () => {
    const result = validateBookmark({
      id: "1",
      url: "",
      title: "Example",
      tags: [],
      createdAt: new Date().toISOString(),
    });
    expect(result.issues).toContain("URL is empty");
  });

  it("reports invalid URL scheme", () => {
    const result = validateBookmark({
      id: "1",
      url: "ftp://files.example.com",
      title: "FTP",
      tags: [],
      createdAt: new Date().toISOString(),
    });
    expect(result.issues[0]).toMatch(/does not start with/);
  });

  it("reports empty title", () => {
    const result = validateBookmark({
      id: "1",
      url: "https://example.com",
      title: "",
      tags: [],
      createdAt: new Date().toISOString(),
    });
    expect(result.issues).toContain("Title is empty");
  });
});

describe("validateStore", () => {
  it("returns correct summary for all valid bookmarks", () => {
    const store = makeStore([
      { url: "https://a.com", title: "A" },
      { url: "https://b.com", title: "B" },
    ]);
    const summary = validateStore(store);
    expect(summary.total).toBe(2);
    expect(summary.valid).toBe(2);
    expect(summary.invalid).toBe(0);
    expect(summary.results).toHaveLength(0);
  });

  it("identifies invalid bookmarks", () => {
    const store = makeStore([
      { url: "not-a-url", title: "Bad" },
      { url: "https://ok.com", title: "Good" },
    ]);
    const summary = validateStore(store);
    expect(summary.invalid).toBe(1);
    expect(summary.results[0].id).toBe("id-0");
  });
});

describe("formatValidationSummary", () => {
  it("shows all valid message when no issues", () => {
    const summary = { total: 3, valid: 3, invalid: 0, results: [] };
    const output = formatValidationSummary(summary);
    expect(output).toContain("All bookmarks are valid");
  });

  it("lists issues for invalid bookmarks", () => {
    const summary = {
      total: 1,
      valid: 0,
      invalid: 1,
      results: [{ id: "abc", url: "bad", issues: ["URL is empty"] }],
    };
    const output = formatValidationSummary(summary);
    expect(output).toContain("[abc]");
    expect(output).toContain("URL is empty");
  });
});
