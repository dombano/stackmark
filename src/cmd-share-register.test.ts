import { describe, it, expect, vi } from "vitest";
import { Command } from "commander";
import { registerShareCommand } from "./cmd-share-register";
import * as shareModule from "./cmd-share";
import * as storageModule from "./storage";
import * as configModule from "./config";
import { Store } from "./types";

function makeStore(): Store {
  return {
    bookmarks: [
      {
        id: "xyz",
        url: "https://test.dev",
        title: "Test",
        tags: [],
        notes: "",
        createdAt: new Date().toISOString(),
      },
    ],
    aliases: {},
    version: 1,
  };
}

describe("registerShareCommand", () => {
  it("registers share command on program", () => {
    const program = new Command();
    registerShareCommand(program);
    const names = program.commands.map((c) => c.name());
    expect(names).toContain("share");
  });

  it("calls cmdShare with correct format", () => {
    vi.spyOn(configModule, "resolveStorePath").mockReturnValue("/tmp/store.json");
    vi.spyOn(storageModule, "loadStore").mockReturnValue(makeStore());
    const shareSpy = vi.spyOn(shareModule, "cmdShare").mockImplementation(() => {});

    const program = new Command();
    program.exitOverride();
    registerShareCommand(program);
    program.parse(["node", "stackmark", "share", "xyz", "--format", "markdown"]);

    expect(shareSpy).toHaveBeenCalledWith(
      expect.anything(),
      "xyz",
      "markdown",
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("defaults to url format for unknown format string", () => {
    vi.spyOn(configModule, "resolveStorePath").mockReturnValue("/tmp/store.json");
    vi.spyOn(storageModule, "loadStore").mockReturnValue(makeStore());
    const shareSpy = vi.spyOn(shareModule, "cmdShare").mockImplementation(() => {});

    const program = new Command();
    program.exitOverride();
    registerShareCommand(program);
    program.parse(["node", "stackmark", "share", "xyz", "--format", "invalid"]);

    expect(shareSpy).toHaveBeenCalledWith(
      expect.anything(),
      "xyz",
      "url",
      expect.any(Function),
      expect.any(Function)
    );
  });
});
