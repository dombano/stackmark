import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveBookmarkTarget } from "./cmd-open";
import { setAlias } from "./cmd-alias";
import type { Store, Bookmark } from "./types";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

function makeTempStore(): Store {
  return {
    bookmarks: [
      { id: "abc123", url: "https://example.com", title: "Example", tags: [], createdAt: "2024-01-01" },
      { id: "def456", url: "https://github.com", title: "GitHub", tags: [], createdAt: "2024-01-02" },
    ] as Bookmark[],
  };
}

describe("resolveBookmarkTarget", () => {
  it("resolves by exact id", () => {
    const store = makeTempStore();
    const bm = resolveBookmarkTarget(store, "abc123");
    expect(bm?.url).toBe("https://example.com");
  });

  it("resolves by id prefix", () => {
    const store = makeTempStore();
    const bm = resolveBookmarkTarget(store, "def");
    expect(bm?.url).toBe("https://github.com");
  });

  it("resolves by alias", () => {
    const store = setAlias(makeTempStore(), "abc123", "ex");
    const bm = resolveBookmarkTarget(store, "ex");
    expect(bm?.id).toBe("abc123");
  });

  it("prefers alias over id prefix when both match", () => {
    // alias 'def' on abc123 — would also match id prefix of def456
    const store = setAlias(makeTempStore(), "abc123", "def");
    const bm = resolveBookmarkTarget(store, "def");
    // alias lookup wins
    expect(bm?.id).toBe("abc123");
  });

  it("returns null when nothing matches", () => {
    const store = makeTempStore();
    expect(resolveBookmarkTarget(store, "zzz")).toBeNull();
  });
});
