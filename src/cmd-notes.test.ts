import { describe, it, expect, beforeEach, vi } from "vitest";
import { cmdNoteSet, cmdNoteGet, cmdNoteClear } from "./cmd-notes";
import * as storage from "./storage";
import * as config from "./config";
import type { Store, Bookmark } from "./types";

function makeStore(): Store {
  return {
    bookmarks: [
      {
        id: "1",
        url: "https://example.com",
        title: "Example",
        tags: ["test"],
        createdAt: "2024-01-01T00:00:00.000Z",
      } as Bookmark,
    ],
  };
}

describe("cmdNoteSet", () => {
  beforeEach(() => {
    vi.spyOn(config, "resolveStorePath").mockReturnValue("/tmp/store.json");
    vi.spyOn(storage, "saveStore").mockImplementation(() => {});
  });

  it("sets a note on a matched bookmark", async () => {
    const store = makeStore();
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    vi.spyOn(storage, "findBookmark").mockReturnValue(store.bookmarks[0]);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await cmdNoteSet("example", "My note here");

    expect(store.bookmarks[0].note).toBe("My note here");
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Note set"));
  });

  it("exits if no bookmark found", async () => {
    vi.spyOn(storage, "loadStore").mockReturnValue(makeStore());
    vi.spyOn(storage, "findBookmark").mockReturnValue(null);
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => { throw new Error("exit"); });

    await expect(cmdNoteSet("missing", "note")).rejects.toThrow("exit");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe("cmdNoteGet", () => {
  beforeEach(() => {
    vi.spyOn(config, "resolveStorePath").mockReturnValue("/tmp/store.json");
  });

  it("prints the note if present", async () => {
    const store = makeStore();
    store.bookmarks[0].note = "Saved note";
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    vi.spyOn(storage, "findBookmark").mockReturnValue(store.bookmarks[0]);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await cmdNoteGet("example");
    expect(consoleSpy).toHaveBeenCalledWith("Saved note");
  });

  it("prints (no note) if absent", async () => {
    const store = makeStore();
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    vi.spyOn(storage, "findBookmark").mockReturnValue(store.bookmarks[0]);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await cmdNoteGet("example");
    expect(consoleSpy).toHaveBeenCalledWith("(no note)");
  });
});

describe("cmdNoteClear", () => {
  beforeEach(() => {
    vi.spyOn(config, "resolveStorePath").mockReturnValue("/tmp/store.json");
    vi.spyOn(storage, "saveStore").mockImplementation(() => {});
  });

  it("removes the note from a bookmark", async () => {
    const store = makeStore();
    store.bookmarks[0].note = "To be cleared";
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    vi.spyOn(storage, "findBookmark").mockReturnValue(store.bookmarks[0]);
    vi.spyOn(console, "log").mockImplementation(() => {});

    await cmdNoteClear("example");
    expect(store.bookmarks[0].note).toBeUndefined();
  });
});
