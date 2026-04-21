import type { Command } from "commander";
import { loadConfig, resolveStorePath } from "./config";
import { cmdBrowse } from "./cmd-browse";
import { PAGE_SIZE } from "./cmd-browse";
import fs from "fs";

function loadStore(storePath: string) {
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, "utf-8"));
}

export function registerBrowseCommand(program: Command): void {
  program
    .command("browse")
    .description("Browse bookmarks with optional filtering and pagination")
    .option("-t, --tag <tag>", "Filter by tag")
    .option("-q, --query <query>", "Fuzzy search query")
    .option("-p, --page <number>", "Page number", "1")
    .option("-s, --page-size <number>", `Results per page (default: ${PAGE_SIZE})`, String(PAGE_SIZE))
    .action((opts) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const output = cmdBrowse(store, {
        tag: opts.tag,
        query: opts.query,
        page: parseInt(opts.page, 10),
        pageSize: parseInt(opts.pageSize, 10),
      });
      console.log(output);
    });
}
