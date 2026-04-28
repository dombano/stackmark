import { Command } from "commander";
import { loadStore, writeStore } from "./cmd-archive-register";
import {
  setVisibility,
  removeVisibility,
  getVisibility,
  filterByVisibility,
  isValidVisibility,
} from "./cmd-visibility";
import { formatBookmarkList } from "./format";

export function registerVisibilityCommand(program: Command): void {
  const vis = program.command("visibility").description("Manage bookmark visibility");

  vis
    .command("set <url> <level>")
    .description("Set visibility level for a bookmark (public|private|unlisted)")
    .option("-s, --store <path>", "path to store file")
    .action(async (url: string, level: string, opts: { store?: string }) => {
      if (!isValidVisibility(level)) {
        console.error(`Invalid visibility level: ${level}. Use public, private, or unlisted.`);
        process.exit(1);
      }
      const store = await loadStore(opts.store);
      const updated = setVisibility(store, url, level as "public" | "private" | "unlisted");
      if (!updated) {
        console.error(`Bookmark not found: ${url}`);
        process.exit(1);
      }
      await writeStore(opts.store, store);
      console.log(`Visibility set to "${level}" for ${url}`);
    });

  vis
    .command("get <url>")
    .description("Get visibility level for a bookmark")
    .option("-s, --store <path>", "path to store file")
    .action(async (url: string, opts: { store?: string }) => {
      const store = await loadStore(opts.store);
      const level = getVisibility(store, url);
      if (level === undefined) {
        console.error(`Bookmark not found: ${url}`);
        process.exit(1);
      }
      console.log(level ?? "(not set)");
    });

  vis
    .command("remove <url>")
    .description("Remove visibility setting from a bookmark")
    .option("-s, --store <path>", "path to store file")
    .action(async (url: string, opts: { store?: string }) => {
      const store = await loadStore(opts.store);
      const ok = removeVisibility(store, url);
      if (!ok) {
        console.error(`Bookmark not found: ${url}`);
        process.exit(1);
      }
      await writeStore(opts.store, store);
      console.log(`Visibility removed from ${url}`);
    });

  vis
    .command("list <level>")
    .description("List bookmarks with a specific visibility level")
    .option("-s, --store <path>", "path to store file")
    .action(async (level: string, opts: { store?: string }) => {
      if (!isValidVisibility(level)) {
        console.error(`Invalid visibility level: ${level}. Use public, private, or unlisted.`);
        process.exit(1);
      }
      const store = await loadStore(opts.store);
      const results = filterByVisibility(store, level as "public" | "private" | "unlisted");
      if (results.length === 0) {
        console.log(`No bookmarks with visibility "${level}".`);
        return;
      }
      console.log(formatBookmarkList(results));
    });
}
