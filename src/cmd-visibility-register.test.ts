import { Command } from "commander";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import { registerVisibilityCommand } from "./cmd-visibility-register";
import { BookmarkStore } from "./types";

async function makeTempStore(store: BookmarkStore): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "stackmark-vis-"));
  const file = path.join(dir, "store.json");
  await fs.writeFile(file, JSON.stringify(store));
  return file;
}

function makeProgram(): Command {
  const program = new Command();
  program.exitOverride();
  registerVisibilityCommand(program);
  return program;
}

const baseStore: BookmarkStore = {
  bookmarks: [
    { id: "1", url: "https://example.com", title: "Example", tags: [], createdAt: "2024-01-01" },
    { id: "2", url: "https://private.com", title: "Private", tags: [], createdAt: "2024-01-02", visibility: "private" },
  ],
};

test("visibility set updates the bookmark", async () => {
  const storePath = await makeTempStore(JSON.parse(JSON.stringify(baseStore)));
  const program = makeProgram();
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});
  await program.parseAsync(["node", "test", "visibility", "set", "https://example.com", "public", "-s", storePath]);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining("public"));
  spy.mockRestore();
});

test("visibility set rejects invalid level", async () => {
  const storePath = await makeTempStore(JSON.parse(JSON.stringify(baseStore)));
  const program = makeProgram();
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => { throw new Error("exit"); });
  await expect(program.parseAsync(["node", "test", "visibility", "set", "https://example.com", "secret", "-s", storePath])).rejects.toThrow();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining("Invalid"));
  spy.mockRestore();
  exitSpy.mockRestore();
});

test("visibility get returns level", async () => {
  const storePath = await makeTempStore(JSON.parse(JSON.stringify(baseStore)));
  const program = makeProgram();
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});
  await program.parseAsync(["node", "test", "visibility", "get", "https://private.com", "-s", storePath]);
  expect(spy).toHaveBeenCalledWith("private");
  spy.mockRestore();
});

test("visibility remove clears level", async () => {
  const storePath = await makeTempStore(JSON.parse(JSON.stringify(baseStore)));
  const program = makeProgram();
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});
  await program.parseAsync(["node", "test", "visibility", "remove", "https://private.com", "-s", storePath]);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining("removed"));
  spy.mockRestore();
});

test("visibility list filters correctly", async () => {
  const storePath = await makeTempStore(JSON.parse(JSON.stringify(baseStore)));
  const program = makeProgram();
  const spy = jest.spyOn(console, "log").mockImplementation(() => {});
  await program.parseAsync(["node", "test", "visibility", "list", "private", "-s", storePath]);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining("private.com"));
  spy.mockRestore();
});
