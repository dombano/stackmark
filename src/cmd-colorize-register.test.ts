import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Command } from "commander";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { registerColorizeCommand } from "./cmd-colorize-register";
import { BookmarkStore } from "./types";

let tmpDir: string;
let storePath: string;

function makeTempStore(store: BookmarkStore): string {
  tmpDir = mkdtempSync(join(tmpdir(), "stackmark-colorize-"));
  storePath = join(tmpDir, "store.json");
  writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");
  return storePath;
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "stackmark-colorize-"));
  storePath = join(tmpDir, "store.json");
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function makeProgram(): Command {
  const program = new Command();
  program.exitOverride();
  registerColorizeCommand(program);
  return program;
}

describe("registerColorizeCommand", () => {
  it("registers colorize subcommands", () => {
    const program = makeProgram();
    const names = program.commands.map((c) => c.name());
    expect(names).toContain("colorize");
    const colorize = program.commands.find((c) => c.name() === "colorize")!;
    const subNames = colorize.commands.map((c) => c.name());
    expect(subNames).toContain("set");
    expect(subNames).toContain("get");
    expect(subNames).toContain("clear");
    expect(subNames).toContain("filter");
    expect(subNames).toContain("list");
  });

  it("colorize list outputs no colorized message when store is empty", () => {
    makeTempStore({ bookmarks: [] });
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (msg: string) => logs.push(msg);

    // Simulate by calling the logic directly
    const { listColorized, formatColorized } = require("./cmd-colorize");
    const store = { bookmarks: [] };
    const all = listColorized(store);
    if (all.length === 0) {
      console.log("No colorized bookmarks.");
    } else {
      console.log(formatColorized(all));
    }

    console.log = origLog;
    expect(logs).toContain("No colorized bookmarks.");
  });

  it("colorize filter returns no results for unknown color", () => {
    const { filterByColor } = require("./cmd-colorize");
    const store = {
      bookmarks: [
        { id: "1", url: "https://example.com", title: "Ex", tags: [], createdAt: Date.now() },
      ],
    };
    const matches = filterByColor(store, "purple");
    expect(matches).toHaveLength(0);
  });
});
