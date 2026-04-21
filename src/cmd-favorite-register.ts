import { Command } from "commander";
import { loadConfig, resolveStorePath } from "./config";
import { readFileSync, writeFileSync } from "fs";
import { BookmarkStore } from "./types";
import {
  setFavorite,
  unsetFavorite,
  isFavorite,
  listFavorites,
  toggleFavorite,
} from "./cmd-favorite";
import { formatBookmarkList } from "./format";

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

/**
 * Register the `favorite` subcommand group with the CLI program.
 */
export function registerFavoriteCommand(program: Command): void {
  const fav = program
    .command("favorite")
    .alias("fav")
    .description("Manage favorite bookmarks");

  // stackmark favorite add <url>
  fav
    .command("add <url>")
    .description("Mark a bookmark as a favorite")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const updated = setFavorite(store, url);
      if (!updated) {
        console.error(`No bookmark found for URL: ${url}`);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`⭐ Marked as favorite: ${url}`);
    });

  // stackmark favorite remove <url>
  fav
    .command("remove <url>")
    .description("Remove a bookmark from favorites")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const updated = unsetFavorite(store, url);
      if (!updated) {
        console.error(`No bookmark found for URL: ${url}`);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Removed from favorites: ${url}`);
    });

  // stackmark favorite toggle <url>
  fav
    .command("toggle <url>")
    .description("Toggle the favorite status of a bookmark")
    .action((url: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = toggleFavorite(store, url);
      if (result === null) {
        console.error(`No bookmark found for URL: ${url}`);
        process.exit(1);
      }
      writeStore(storePath, store);
      const state = isFavorite(store, url) ? "⭐ favorited" : "unfavorited";
      console.log(`Bookmark ${state}: ${url}`);
    });

  // stackmark favorite list
  fav
    .command("list")
    .description("List all favorite bookmarks")
    .option("--plain", "Output plain URLs without formatting")
    .action((opts: { plain?: boolean }) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const favorites = listFavorites(store);
      if (favorites.length === 0) {
        console.log("No favorite bookmarks found.");
        return;
      }
      if (opts.plain) {
        favorites.forEach((b) => console.log(b.url));
      } else {
        console.log(formatBookmarkList(favorites));
      }
    });
}
