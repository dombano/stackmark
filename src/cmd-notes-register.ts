import type { Command } from "commander";
import { cmdNoteSet, cmdNoteGet, cmdNoteClear } from "./cmd-notes";

export function registerNotesCommand(program: Command): void {
  const note = program
    .command("note")
    .description("Manage notes attached to bookmarks");

  note
    .command("set <query> <note>")
    .description("Set a note on a bookmark matched by URL, title, or alias")
    .option("--config <path>", "Path to config file")
    .action(async (query: string, noteText: string, opts: { config?: string }) => {
      await cmdNoteSet(query, noteText, opts);
    });

  note
    .command("get <query>")
    .description("Show the note for a bookmark")
    .option("--config <path>", "Path to config file")
    .action(async (query: string, opts: { config?: string }) => {
      await cmdNoteGet(query, opts);
    });

  note
    .command("clear <query>")
    .description("Remove the note from a bookmark")
    .option("--config <path>", "Path to config file")
    .action(async (query: string, opts: { config?: string }) => {
      await cmdNoteClear(query, opts);
    });
}
