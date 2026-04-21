import { describe, it, expect } from "vitest";
import { applyBatchOperation, formatBatchResult } from "./cmd-batch";
import { BookmarkStore } from "./types";

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: "1", url: "https://a.com", title: "A", tags: ["foo"], createdAt: "2024-01-01" },
      { id: "2", url: "https://b.com", title: "B", tags: ["bar"], createdAt: "2024-01-02" },
      { id: "3", url: "https://c.com", title: "C", tags: ["foo", "bar"], createdAt: "2024-01-03" },
    ],
  };
}

describe("applyBatchOperation", () => {
  it("adds a tag to multiple bookmarks", () => {
    const store = makeStore();
    const result = applyBatchOperation(store, ["1", "2"], { type: "add-tag", tag: "new" });
    expect(result.affected).toBe(2);
    expect(store.bookmarks[0].tags).toContain("new");
    expect(store.bookmarks[1].tags).toContain("new");
  });

  it("does not duplicate tags on add", () => {
    const store = makeStore();
    applyBatchOperation(store, ["1"], { type: "add-tag", tag: "foo" });
    expect(store.bookmarks[0].tags.filter((t) => t === "foo").length).toBe(1);
  });

  it("removes a tag from matching bookmarks", () => {
    const store = makeStore();
    const result = applyBatchOperation(store, ["1", "3"], { type: "remove-tag", tag: "foo" });
    expect(result.affected).toBe(2);
    expect(store.bookmarks[0].tags).not.toContain("foo");
    expect(store.bookmarks[2].tags).not.toContain("foo");
  });

  it("deletes bookmarks by id", () => {
    const store = makeStore();
    const result = applyBatchOperation(store, ["2"], { type: "delete" });
    expect(result.affected).toBe(1);
    expect(store.bookmarks.find((b) => b.id === "2")).toBeUndefined();
    expect(store.bookmarks.length).toBe(2);
  });

  it("skips unknown ids", () => {
    const store = makeStore();
    const result = applyBatchOperation(store, ["99"], { type: "add-tag", tag: "x" });
    expect(result.affected).toBe(0);
    expect(result.skipped).toBe(1);
  });

  it("sets a label on bookmarks", () => {
    const store = makeStore();
    const result = applyBatchOperation(store, ["1", "2"], { type: "set-label", label: "work" });
    expect(result.affected).toBe(2);
    expect((store.bookmarks[0] as any).label).toBe("work");
  });
});

describe("formatBatchResult", () => {
  it("formats a batch result summary", () => {
    const result = { affected: 3, skipped: 1, ids: ["1", "2", "3"] };
    const out = formatBatchResult(result, { type: "add-tag", tag: "dev" });
    expect(out).toContain('add tag "dev"');
    expect(out).toContain("Affected : 3");
    expect(out).toContain("Skipped  : 1");
    expect(out).toContain("1, 2, 3");
  });

  it("formats delete operation label", () => {
    const result = { affected: 1, skipped: 0, ids: ["5"] };
    const out = formatBatchResult(result, { type: "delete" });
    expect(out).toContain("delete");
  });
});
