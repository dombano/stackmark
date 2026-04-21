import type { Command } from "commander";
import { loadStore } from "./storage";
import { resolveStorePath } from "./config";
import { cmdShare, ShareFormat } from "./cmd-share";

export function registerShareCommand(program: Command): void {
  program
    .command("share <query>")
    .description("Output a bookmark in a shareable format")
    .option("-f, --format <format>", "Output format: url, markdown, text, json", "url")
    .option("-s, --store <path>", "Path to store file")
    .action((query: string, options: { format: string; store?: string }) => {
      const storePath = resolveStorePath(options.store);
      const store = loadStore(storePath);
      const format = ["url", "markdown", "text", "json"].includes(options.format)
        ? (options.format as ShareFormat)
        : "url";
      cmdShare(store, query, format);
    });
}
