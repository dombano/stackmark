import { describe, it, expect } from "vitest";
import { setAlias, removeAlias, findByAlias, listAliases } from "./cmd-alias";
import type { Store, Bookmark } from "./types";

function makeStore(): Store {
  return {
    bookmarks: [
      { id: "abc123", url: "https://example.com", title: "Example", tags: ["web"], createdAt: "2024-01-01" },
      { id: "def456", url: "https://github.com", title: "GitHub", tags: ["dev"], createdAt: "2024-01-02" },
    ] as Bookmark[],
  };
}

describe("setAlias", () => {
  it("sets an alias on a bookmark", () => {
    const store = setAlias(makeStore(), "abc123", "ex");
    const bm = store.bookmarks.find((b) => b.id === "abc123") as any;
    expect(bm.alias).toBe("ex");
  });

  it("throws if bookmark not found", () => {
    expect(() => setAlias(makeStore(), "notexist", "ex")).toThrow('not found');
  });

  it("throws if alias already taken by another bookmark", () => {
    const store = setAlias(makeStore(), "abc123", "gh");
    expect(() => setAlias(store, "def456", "gh")).toThrow('already used');
  });

  it("allows reassigning the same alias to the same bookmark", () => {
    const store = setAlias(makeStore(), "abc123", "ex");
    const updated = setAlias(store, "abc123", "ex");
    const bm = updated.bookmarks.find((b) => b.id === "abc123") as any;
    expect(bm.alias).toBe("ex");
  });
});

describe("removeAlias", () => {
  it("removes an alias from a bookmark", () => {
    const store = setAlias(makeStore(), "abc123", "ex");
    const updated = removeAlias(store, "abc123");
    const bm = updated.bookmarks.find((b) => b.id === "abc123") as any;
    expect(bm.alias).toBeUndefined();
  });

  it("throws if bookmark not found", () => {
    expect(() => removeAlias(makeStore(), "notexist")).toThrow('not found');
  });
});

describe("findByAlias", () => {
  it("finds a bookmark by alias", () => {
    const store = setAlias(makeStore(), "abc123", "mysite");
    const bm = findByAlias(store, "mysite");
    expect(bm?.id).toBe("abc123");
  });

  it("returns undefined when alias does not exist", () => {
    expect(findByAlias(makeStore(), "ghost")).toBeUndefined();
  });
});

describe("listAliases", () => {
  it("returns only bookmarks with aliases", () => {
    let store = setAlias(makeStore(), "abc123", "ex");
    store = setAlias(store, "def456", "gh");
    const aliases = listAliases(store);
    expect(aliases).toHaveLength(2);
    expect(aliases.map((a) => a.alias)).toEqual(expect.arrayContaining(["ex", "gh"]));
  });

  it("returns empty array when no aliases defined", () => {
    expect(listAliases(makeStore())).toHaveLength(0);
  });
});
