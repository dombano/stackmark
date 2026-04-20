import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { cmdEdit } from "./cmd-edit";
import type { BookmarkStore } from "./types";

const makeStore = (overrides?: Partial<BookmarkStore>): BookmarkStore => ({
  version: 1,
  bookmarks: [
    {
      id: "abc123",
      url: "https://example.com",
      title: "Example",
      tags: ["web"],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  ...overrides,
});

let tmpDir: string;
let storePath: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), "stackmark-edit-"));
  storePath = join(tmpDir, "bookmarks.json");
  await writeFile(storePath, JSON.stringify(makeStore()));
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true });
});

describe("cmdEdit", () => {
  it("updates the title of a bookmark", async () => {
    const result = await cmdEdit("abc123", { title: "New Title", storePath });
    expect(result).toContain("New Title");
  });

  it("updates the url of a bookmark", async () => {
    const result = await cmdEdit("abc123", {
      url: "https://updated.com",
      storePath,
    });
    expect(result).toContain("https://updated.com");
  });

  it("updates tags of a bookmark", async () => {
    const result = await cmdEdit("abc123", { tags: "dev,tools", storePath });
    expect(result).toContain("dev");
    expect(result).toContain("tools");
  });

  it("throws if bookmark id not found", async () => {
    await expect(
      cmdEdit("nonexistent", { title: "X", storePath })
    ).rejects.toThrow("Bookmark not found: nonexistent");
  });
});
