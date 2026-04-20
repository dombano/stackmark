import { describe, it, expect, beforeEach, vi } from "vitest";
import * as storage from "./storage";
import * as config from "./config";
import { cmdPin, cmdPinList } from "./cmd-pin";
import type { Store, Bookmark } from "./types";

function makeStore(bookmarks: Bookmark[]): Store {
  return { bookmarks };
}

const STORE_PATH = "/tmp/test-store.json";

beforeEach(() => {
  vi.spyOn(config, "resolveStorePath").mockReturnValue(STORE_PATH);
});

describe("cmdPin", () => {
  it("pins an existing bookmark", () => {
    const store = makeStore([
      { url: "https://example.com", title: "Example", tags: [], createdAt: "2024-01-01" },
    ]);
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    const saveSpy = vi.spyOn(storage, "saveStore").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    cmdPin("https://example.com");

    expect((store.bookmarks[0] as any).pinned).toBe(true);
    expect(saveSpy).toHaveBeenCalledWith(STORE_PATH, store);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Pinned"));
  });

  it("unpins a bookmark when --unpin flag is set", () => {
    const store = makeStore([
      { url: "https://example.com", title: "Example", tags: [], createdAt: "2024-01-01", pinned: true } as any,
    ]);
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    const saveSpy = vi.spyOn(storage, "saveStore").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    cmdPin("https://example.com", { unpin: true });

    expect((store.bookmarks[0] as any).pinned).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Unpinned"));
  });

  it("exits with error when bookmark not found", () => {
    const store = makeStore([]);
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => { throw new Error("exit"); });
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => cmdPin("https://notfound.com")).toThrow("exit");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe("cmdPinList", () => {
  it("lists pinned bookmarks", () => {
    const store = makeStore([
      { url: "https://pinned.com", title: "Pinned", tags: [], createdAt: "2024-01-01", pinned: true } as any,
      { url: "https://unpinned.com", title: "Unpinned", tags: [], createdAt: "2024-01-01" },
    ]);
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    cmdPinList();

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("1"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("pinned.com"));
  });

  it("shows message when no pinned bookmarks", () => {
    const store = makeStore([
      { url: "https://example.com", title: "Example", tags: [], createdAt: "2024-01-01" },
    ]);
    vi.spyOn(storage, "loadStore").mockReturnValue(store);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    cmdPinList();

    expect(logSpy).toHaveBeenCalledWith("No pinned bookmarks.");
  });
});
