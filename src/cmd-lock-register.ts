import { Command } from "commander";
import { loadStore, writeStore } from "./cmd-archive-register";
import {
  lockBookmark,
  unlockBookmark,
  isLocked,
  listLocked,
  guardLocked,
} from "./cmd-lock";
import { findBookmark } from "./storage";
import { formatBookmarkList } from "./format";

/**
 * Registers the `lock` subcommands onto the given Commander program.
 *
 * Commands:
 *   lock set <id>      – Lock a bookmark so it cannot be edited or removed
 *   lock unset <id>    – Remove the lock from a bookmark
 *   lock list          – List all locked bookmarks
 *   lock check <id>    – Print whether a bookmark is currently locked
 */
export function registerLockCommand(program: Command): void {
  const lock = program
    .command("lock")
    .description("Lock bookmarks to prevent accidental edits or removal");

  // lock set <id>
  lock
    .command("set <id>")
    .description("Lock a bookmark")
    .action((id: string) => {
      const store = loadStore();
      const bm = findBookmark(store, id);
      if (!bm) {
        console.error(`Bookmark not found: ${id}`);
        process.exit(1);
      }
      if (isLocked(bm)) {
        console.log(`Bookmark "${bm.title}" is already locked.`);
        return;
      }
      const updated = lockBookmark(store, id);
      writeStore(updated);
      console.log(`Locked bookmark: ${bm.title}`);
    });

  // lock unset <id>
  lock
    .command("unset <id>")
    .description("Unlock a bookmark")
    .action((id: string) => {
      const store = loadStore();
      const bm = findBookmark(store, id);
      if (!bm) {
        console.error(`Bookmark not found: ${id}`);
        process.exit(1);
      }
      if (!isLocked(bm)) {
        console.log(`Bookmark "${bm.title}" is not locked.`);
        return;
      }
      const updated = unlockBookmark(store, id);
      writeStore(updated);
      console.log(`Unlocked bookmark: ${bm.title}`);
    });

  // lock list
  lock
    .command("list")
    .description("List all locked bookmarks")
    .option("--plain", "Plain output without formatting")
    .action((opts: { plain?: boolean }) => {
      const store = loadStore();
      const locked = listLocked(store);
      if (locked.length === 0) {
        console.log("No locked bookmarks.");
        return;
      }
      console.log(formatBookmarkList(locked, { plain: opts.plain }));
    });

  // lock check <id>
  lock
    .command("check <id>")
    .description("Check whether a bookmark is locked")
    .action((id: string) => {
      const store = loadStore();
      const bm = findBookmark(store, id);
      if (!bm) {
        console.error(`Bookmark not found: ${id}`);
        process.exit(1);
      }
      const locked = isLocked(bm);
      console.log(
        locked
          ? `Bookmark "${bm.title}" is locked.`
          : `Bookmark "${bm.title}" is not locked.`
      );
    });

  // lock guard <id> – internal helper exposed as a command for scripting
  lock
    .command("guard <id>")
    .description(
      "Exit with an error if the bookmark is locked (useful in scripts)"
    )
    .action((id: string) => {
      const store = loadStore();
      const bm = findBookmark(store, id);
      if (!bm) {
        console.error(`Bookmark not found: ${id}`);
        process.exit(1);
      }
      try {
        guardLocked(bm);
        console.log(`Bookmark "${bm.title}" is not locked — proceeding.`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(message);
        process.exit(1);
      }
    });
}
