import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { loadConfig, resolveStorePath } from "./config";
import { BookmarkStore } from "./types";
import { formatWatchSummary } from "./cmd-watch";

function loadStore(storePath: string): BookmarkStore {
  if (!fs.existsSync(storePath)) {
    return { bookmarks: [] };
  }
  return JSON.parse(fs.readFileSync(storePath, "utf-8"));
}

export function registerWatchCommand(program: Command): void {
  const watch = program.command("watch").description("Watch store file for changes and display a live summary");

  watch
    .command("summary")
    .description("Print a summary of the current bookmark store")
    .option("--json", "Output as JSON")
    .action((opts) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      if (opts.json) {
        console.log(JSON.stringify({ total: store.bookmarks.length }, null, 2));
      } else {
        console.log(formatWatchSummary(store));
      }
    });

  watch
    .command("live")
    .description("Watch the store file and re-print summary on every change")
    .option("--interval <ms>", "Polling interval in milliseconds", "1000")
    .action((opts) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const interval = parseInt(opts.interval, 10);

      console.log(`Watching ${storePath} (interval: ${interval}ms) — Ctrl+C to stop\n`);

      let lastMtime = 0;

      const tick = () => {
        try {
          const stat = fs.statSync(storePath);
          const mtime = stat.mtimeMs;
          if (mtime !== lastMtime) {
            lastMtime = mtime;
            const store = loadStore(storePath);
            console.clear();
            console.log(`[${new Date().toLocaleTimeString()}] Store updated\n`);
            console.log(formatWatchSummary(store));
          }
        } catch {
          // store file may not exist yet
        }
      };

      tick();
      setInterval(tick, interval);
    });
}
