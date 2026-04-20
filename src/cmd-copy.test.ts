import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as clipboardy from "clipboardy";
import * as storage from "./storage";
import * as config from "./config";
import { cmdCopy } from "./cmd-copy";
import type { Bookmark, BookmarkStore } from "./types";

const makeStore = (): BookmarkStore => ({
  bookmarks: [
    {
      id: "abc123",
      url: "https://example.com",
      title: "Example Site",
      tags: ["web"],
      createdAt: "2024-01-01T00:00:00.000Z",
      pinned: false,
    },
  ],
});

vi.mock("clipboardy", () => ({ write: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./storage");
vi.mock("./config");

describe("cmdCopy", () => {
  beforeEach(() => {
    vi.mocked(config.resolveStorePath).mockReturnValue("/tmp/store.json");
    vi.mocked(storage.loadStore).mockReturnValue(makeStore());
    vi.mocked(storage.findBookmark).mockReturnValue(makeStore().bookmarks[0]);
  });

  afterEach(() => vi.clearAllMocks());

  it("copies url by default", async () => {
    await cmdCopy("example");
    expect(clipboardy.write).toHaveBeenCalledWith("https://example.com");
  });

  it("copies title when field=title", async () => {
    await cmdCopy("example", { field: "title" });
    expect(clipboardy.write).toHaveBeenCalledWith("Example Site");
  });

  it("copies formatted text when field=all", async () => {
    await cmdCopy("example", { field: "all" });
    const call = vi.mocked(clipboardy.write).mock.calls[0][0];
    expect(call).toContain("https://example.com");
  });

  it("exits with error when bookmark not found", async () => {
    vi.mocked(storage.findBookmark).mockReturnValue(undefined);
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit");
    });
    await expect(cmdCopy("missing")).rejects.toThrow("exit");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
