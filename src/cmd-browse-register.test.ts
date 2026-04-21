import { describe, it, expect, vi, beforeEach } from "vitest";
import { Command } from "commander";
import { registerBrowseCommand } from "./cmd-browse-register";
import * as fs from "fs";

vi.mock("fs");
vi.mock("./config", () => ({
  loadConfig: () => ({ storePath: "/tmp/test-store.json" }),
  resolveStorePath: (c: { storePath: string }) => c.storePath,
}));

function makeTempStore() {
  return {
    bookmarks: [
      { id: "1", url: "https://a.com", title: "Alpha", tags: ["dev"], createdAt: "2024-01-01" },
      { id: "2", url: "https://b.com", title: "Beta", tags: ["news"], createdAt: "2024-01-02" },
    ],
  };
}

beforeEach(() => {
  vi.mocked(fs.existsSync).mockReturnValue(true);
  vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(makeTempStore()));
});

describe("registerBrowseCommand", () => {
  it("registers browse command", () => {
    const program = new Command();
    registerBrowseCommand(program);
    const cmd = program.commands.find((c) => c.name() === "browse");
    expect(cmd).toBeDefined();
  });

  it("runs without error and logs output", async () => {
    const program = new Command();
    registerBrowseCommand(program);
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await program.parseAsync(["node", "test", "browse"]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("accepts --tag option", async () => {
    const program = new Command();
    registerBrowseCommand(program);
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await program.parseAsync(["node", "test", "browse", "--tag", "dev"]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("returns no bookmarks message for missing store", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const program = new Command();
    registerBrowseCommand(program);
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await program.parseAsync(["node", "test", "browse"]);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("No bookmarks found."));
    spy.mockRestore();
  });
});
