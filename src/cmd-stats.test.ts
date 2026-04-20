import { describe, it, expect } from "vitest";
import { computeStats, formatStats, StatsResult } from "./cmd-stats";
import { Store } from "./types";

function makeStore(overrides: Partial<Store> = {}): Store {
  return {
    bookmarks: [
      { id: "1", url: "https://example.com", title: "Example", tags: ["web", "ref"], createdAt: "2023-01-01" },
      { id: "2", url: "https://rust-lang.org", title: "Rust", tags: ["rust", "lang"], createdAt: "2024-03-15" },
      { id: "3", url: "https://typescriptlang.org", title: "TS", tags: ["web"], createdAt: "2023-06-20" },
      { id: "4", url: "https://untagged.io", title: "No tags", tags: [], createdAt: "2022-11-01" },
    ],
    ...overrides,
  };
}

describe("computeStats", () => {
  it("counts total bookmarks", () => {
    const stats = computeStats(makeStore());
    expect(stats.total).toBe(4);
  });

  it("counts tagged and untagged", () => {
    const stats = computeStats(makeStore());
    expect(stats.tagged).toBe(3);
    expect(stats.untagged).toBe(1);
  });

  it("counts unique tags", () => {
    const stats = computeStats(makeStore());
    expect(stats.uniqueTags).toBe(3); // web, ref, rust, lang -> 4
  });

  it("returns top tags sorted by count", () => {
    const stats = computeStats(makeStore());
    expect(stats.topTags[0].tag).toBe("web");
    expect(stats.topTags[0].count).toBe(2);
  });

  it("returns oldest and newest dates", () => {
    const stats = computeStats(makeStore());
    expect(stats.oldestDate).toBe("2022-11-01");
    expect(stats.newestDate).toBe("2024-03-15");
  });

  it("handles empty store", () => {
    const stats = computeStats({ bookmarks: [] });
    expect(stats.total).toBe(0);
    expect(stats.tagged).toBe(0);
    expect(stats.untagged).toBe(0);
    expect(stats.uniqueTags).toBe(0);
    expect(stats.topTags).toEqual([]);
    expect(stats.oldestDate).toBeNull();
    expect(stats.newestDate).toBeNull();
  });
});

describe("formatStats", () => {
  it("includes total in output", () => {
    const stats = computeStats(makeStore());
    const output = formatStats(stats);
    expect(output).toContain("4");
  });

  it("includes top tags section when tags exist", () => {
    const stats = computeStats(makeStore());
    const output = formatStats(stats);
    expect(output).toContain("Top tags:");
    expect(output).toContain("web");
  });

  it("includes date info when available", () => {
    const stats = computeStats(makeStore());
    const output = formatStats(stats);
    expect(output).toContain("2022-11-01");
    expect(output).toContain("2024-03-15");
  });

  it("omits date section for empty store", () => {
    const stats = computeStats({ bookmarks: [] });
    const output = formatStats(stats);
    expect(output).not.toContain("Oldest");
  });
});
