import { Command } from "commander";
import fs from "fs";
import { loadConfig, resolveStorePath } from "./config";
import { BookmarkStore } from "./types";
import {
  setReadonly,
  isReadonly,
  listReadonly,
  guardReadonly,
  toggleReadonly,
} from "./cmd-readonly";

function loadStore(storePath: string): BookmarkStore {
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, "utf-8"));
}

function writeStore(storePath: string, store: BookmarkStore): void {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

export function registerReadonlyCommand(program: Command): void {
  const cmd = program.command("readonly").description("Manage readonly bookmarks");

  cmd
    .command("set <url>")
    .description("Mark a bookmark as readonly")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = setReadonly(store, url, true);
      if (!result.ok) {
        console.error(result.error);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Bookmark "${url}" marked as readonly.`);
    });

  cmd
    .command("unset <url>")
    .description("Remove readonly flag from a bookmark")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = setReadonly(store, url, false);
      if (!result.ok) {
        console.error(result.error);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Bookmark "${url}" is no longer readonly.`);
    });

  cmd
    .command("toggle <url>")
    .description("Toggle readonly flag on a bookmark")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = toggleReadonly(store, url);
      if (!result.ok) {
        console.error(result.error);
        process.exit(1);
      }
      writeStore(storePath, store);
      const state = isReadonly(store, url) ? "readonly" : "editable";
      console.log(`Bookmark "${url}" is now ${state}.`);
    });

  cmd
    .command("list")
    .description("List all readonly bookmarks")
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const items = listReadonly(store);
      if (items.length === 0) {
        console.log("No readonly bookmarks.");
        return;
      }
      items.forEach((b) => console.log(`[readonly] ${b.url}${b.title ? " — " + b.title : ""}`));
    });

  cmd
    .command("check <url>")
    .description("Check if a bookmark is readonly")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const locked = isReadonly(store, url);
      console.log(locked ? `"${url}" is readonly.` : `"${url}" is not readonly.`);
    });
}
