import { Command } from "commander";
import { loadConfig, resolveStorePath } from "./config";
import { findBookmark } from "./storage";
import { fetchPreview, formatPreview } from "./cmd-preview";
import fs from "fs";

function loadStore(storePath: string) {
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, "utf-8"));
}

export function registerPreviewCommand(program: Command): void {
  program
    .command("preview <query>")
    .description("Fetch and display a live preview of a bookmark's URL")
    .option("--timeout <ms>", "request timeout in milliseconds", "5000")
    .option("--json", "output raw preview data as JSON")
    .action(async (query: string, opts: { timeout: string; json?: boolean }) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const bookmark = findBookmark(store, query);
      if (!bookmark) {
        console.error(`No bookmark found for: ${query}`);
        process.exit(1);
      }
      const timeoutMs = parseInt(opts.timeout, 10);
      const data = await fetchPreview(bookmark.url, timeoutMs);
      if (opts.json) {
        console.log(JSON.stringify({ bookmark, preview: data }, null, 2));
      } else {
        console.log(formatPreview(bookmark, data));
      }
    });
}
