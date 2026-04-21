import type { Argv } from "yargs";
import { loadStore, saveStore } from "./storage";
import { resolveStorePath } from "./config";
import { findDuplicates, mergeDuplicateGroup, dedupeStore } from "./cmd-dedupe";
import { formatBookmark } from "./format";

/**
 * Registers the `dedupe` command with the yargs CLI.
 *
 * Subcommands:
 *   dedupe list   — show duplicate bookmark groups
 *   dedupe merge  — merge all duplicates automatically
 */
export function registerDedupeCommand(yargs: Argv): Argv {
  return yargs.command(
    "dedupe",
    "Find and remove duplicate bookmarks",
    (y) =>
      y
        .command(
          "list",
          "List duplicate bookmark groups",
          (y) =>
            y.option("json", {
              type: "boolean",
              description: "Output results as JSON",
              default: false,
            }),
          async (argv) => {
            const storePath = resolveStorePath();
            const store = loadStore(storePath);
            const groups = findDuplicates(store);

            if (groups.length === 0) {
              console.log("No duplicate bookmarks found.");
              return;
            }

            if (argv.json) {
              console.log(JSON.stringify(groups, null, 2));
              return;
            }

            console.log(`Found ${groups.length} duplicate group(s):\n`);
            groups.forEach((group, i) => {
              console.log(`Group ${i + 1}:`);
              group.forEach((bm) => console.log("  " + formatBookmark(bm)));
              console.log();
            });
          }
        )
        .command(
          "merge",
          "Merge all duplicate bookmark groups, keeping the first entry",
          (y) =>
            y
              .option("dry-run", {
                type: "boolean",
                description: "Preview changes without saving",
                default: false,
              })
              .option("keep", {
                choices: ["first", "last"] as const,
                description: "Which duplicate to keep when merging",
                default: "first",
              }),
          async (argv) => {
            const storePath = resolveStorePath();
            const store = loadStore(storePath);
            const groups = findDuplicates(store);

            if (groups.length === 0) {
              console.log("No duplicate bookmarks found.");
              return;
            }

            // Merge each group into a single bookmark
            let merged = { ...store };
            let totalRemoved = 0;

            for (const group of groups) {
              const ordered =
                argv.keep === "last" ? [...group].reverse() : group;
              const result = mergeDuplicateGroup(merged, ordered);
              totalRemoved += group.length - 1;
              merged = result;
            }

            if (argv["dry-run"]) {
              console.log(
                `[dry-run] Would remove ${totalRemoved} duplicate bookmark(s) across ${groups.length} group(s).`
              );
              return;
            }

            saveStore(storePath, merged);
            console.log(
              `Removed ${totalRemoved} duplicate bookmark(s) across ${groups.length} group(s).`
            );
          }
        )
        .command(
          "auto",
          "Automatically deduplicate the entire store",
          (y) =>
            y.option("dry-run", {
              type: "boolean",
              description: "Preview changes without saving",
              default: false,
            }),
          async (argv) => {
            const storePath = resolveStorePath();
            const store = loadStore(storePath);
            const before = store.bookmarks.length;
            const deduped = dedupeStore(store);
            const removed = before - deduped.bookmarks.length;

            if (removed === 0) {
              console.log("No duplicates found. Store is already clean.");
              return;
            }

            if (argv["dry-run"]) {
              console.log(
                `[dry-run] Would remove ${removed} duplicate bookmark(s).`
              );
              return;
            }

            saveStore(storePath, deduped);
            console.log(`Removed ${removed} duplicate bookmark(s).`);
          }
        )
        .demandCommand(1, "Specify a dedupe subcommand: list, merge, or auto"),
    () => {}
  );
}
