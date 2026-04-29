import { Command } from "commander";
import { registerReadonlyCommand } from "./cmd-readonly-register";
import { BookmarkStore } from "./types";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function makeTempStore(store: BookmarkStore): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stackmark-"));
  const storePath = path.join(dir, "bookmarks.json");
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
  return storePath;
}

function makeProgram(storePath: string): Command {
  const program = new Command();
  program.exitOverride();
  jest.spyOn(require("./config"), "loadConfig").mockReturnValue({});
  jest.spyOn(require("./config"), "resolveStorePath").mockReturnValue(storePath);
  registerReadonlyCommand(program);
  return program;
}

const baseStore: BookmarkStore = {
  bookmarks: [
    { id: "1", url: "https://example.com", title: "Example", tags: [], createdAt: "2024-01-01" },
    { id: "2", url: "https://other.com", title: "Other", tags: [], createdAt: "2024-01-02" },
  ],
};

describe("registerReadonlyCommand", () => {
  let storePath: string;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    storePath = makeTempStore(JSON.parse(JSON.stringify(baseStore)));
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets a bookmark as readonly", async () => {
    const program = makeProgram(storePath);
    await program.parseAsync(["node", "test", "readonly", "set", "https://example.com"]);
    const store: BookmarkStore = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    const bm = store.bookmarks.find((b) => b.url === "https://example.com");
    expect((bm as any).readonly).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("readonly"));
  });

  it("unsets readonly from a bookmark", async () => {
    const store: BookmarkStore = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    (store.bookmarks[0] as any).readonly = true;
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
    const program = makeProgram(storePath);
    await program.parseAsync(["node", "test", "readonly", "unset", "https://example.com"]);
    const updated: BookmarkStore = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    const bm = updated.bookmarks.find((b) => b.url === "https://example.com");
    expect((bm as any).readonly).toBeFalsy();
  });

  it("lists readonly bookmarks", async () => {
    const store: BookmarkStore = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    (store.bookmarks[0] as any).readonly = true;
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
    const program = makeProgram(storePath);
    await program.parseAsync(["node", "test", "readonly", "list"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("https://example.com"));
  });

  it("prints message when no readonly bookmarks", async () => {
    const program = makeProgram(storePath);
    await program.parseAsync(["node", "test", "readonly", "list"]);
    expect(consoleSpy).toHaveBeenCalledWith("No readonly bookmarks.");
  });

  it("checks if a bookmark is readonly", async () => {
    const program = makeProgram(storePath);
    await program.parseAsync(["node", "test", "readonly", "check", "https://example.com"]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("not readonly"));
  });
});
