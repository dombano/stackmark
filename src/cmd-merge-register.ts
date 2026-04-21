import { Command } from "commander";
import { loadStore, saveStore } from "./storage";
import { resolveStorePath } from "./config";
import { mergeBookmarks, cmdMerge } from "./cmd-merge";

/**
 * Registers the `merge` command with the CLI program.
 *
 * The merge command combines two bookmarks into one, preserving or merging
 * their tags, notes, and metadata based on provided options.
 *
 * Usage:
 *   stackmark merge <id1> <id2> [options]
 *
 * Examples:
 *   stackmark merge abc123 def456
 *   stackmark merge abc123 def456 --keep abc123
 *   stackmark merge abc123 def456 --merge-tags
 */
export function registerMergeCommand(program: Command): void {
  program
    .command("merge <id1> <id2>")
    .description("Merge two bookmarks into one")
    .option(
      "--keep <id>",
      "Which bookmark to keep as the base (defaults to id1)"
    )
    .option(
      "--merge-tags",
      "Combine tags from both bookmarks (default: keep base tags)",
      false
    )
    .option(
      "--merge-notes",
      "Append notes from the discarded bookmark (default: keep base notes)",
      false
    )
    .option("-v, --verbose", "Show details about the merged result", false)
    .action(
      async (
        id1: string,
        id2: string,
        opts: {
          keep?: string;
          mergeTags: boolean;
          mergeNotes: boolean;
          verbose: boolean;
        }
      ) => {
        const storePath = resolveStorePath();
        const store = loadStore(storePath);

        const result = cmdMerge(store, id1, id2, {
          keepId: opts.keep,
          mergeTags: opts.mergeTags,
          mergeNotes: opts.mergeNotes,
        });

        if (!result.ok) {
          console.error(`Error: ${result.error}`);
          process.exit(1);
        }

        saveStore(storePath, result.store);

        if (opts.verbose) {
          const { merged, removed } = result;
          console.log(`Merged bookmark saved:`);
          console.log(`  ID   : ${merged.id}`);
          console.log(`  URL  : ${merged.url}`);
          console.log(`  Title: ${merged.title ?? "(none)"}`);
          console.log(`  Tags : ${merged.tags.join(", ") || "(none)"}`);
          if (merged.notes) {
            console.log(`  Notes: ${merged.notes}`);
          }
          console.log(`Removed bookmark: ${removed.id} (${removed.url})`);
        } else {
          console.log(
            `Merged ${id1} and ${id2} → kept ${result.merged.id}, removed ${result.removed.id}`
          );
        }
      }
    );
}
