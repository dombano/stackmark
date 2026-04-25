import { Command } from "commander";
import { loadConfig, resolveStorePath } from "./config";
import { readFileSync, writeFileSync } from "fs";
import { BookmarkStore } from "./types";
import {
  setColor,
  getColor,
  clearColor,
  filterByColor,
  listColorized,
  formatColorized,
} from "./cmd-colorize";

function loadStore(storePath: string): BookmarkStore {
  try {
    return JSON.parse(readFileSync(storePath, "utf-8"));
  } catch {
    return { bookmarks: [] };
  }
}

function writeStore(storePath: string, store: BookmarkStore): void {
  writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");
}

export function registerColorizeCommand(program: Command): void {
  const colorize = program
    .command("colorize")
    .description("Assign and manage colors for bookmarks");

  colorize
    .command("set <url> <color>")
    .description("Assign a color to a bookmark (e.g. red, blue, #ff0000)")
    .action((url: string, color: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = setColor(store, url, color);
      if (!result.ok) {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
      writeStore(storePath, result.store);
      console.log(`Color "${color}" assigned to ${url}`);
    });

  colorize
    .command("get <url>")
    .description("Get the color assigned to a bookmark")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const color = getColor(store, url);
      if (!color) {
        console.log(`No color assigned to ${url}`);
      } else {
        console.log(`Color: ${color}`);
      }
    });

  colorize
    .command("clear <url>")
    .description("Remove color from a bookmark")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = clearColor(store, url);
      if (!result.ok) {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
      writeStore(storePath, result.store);
      console.log(`Color cleared from ${url}`);
    });

  colorize
    .command("filter <color>")
    .description("List bookmarks with a specific color")
    .action((color: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const matches = filterByColor(store, color);
      if (matches.length === 0) {
        console.log(`No bookmarks with color "${color}".`);
      } else {
        console.log(formatColorized(matches));
      }
    });

  colorize
    .command("list")
    .description("List all colorized bookmarks")
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const all = listColorized(store);
      if (all.length === 0) {
        console.log("No colorized bookmarks.");
      } else {
        console.log(formatColorized(all));
      }
    });
}
