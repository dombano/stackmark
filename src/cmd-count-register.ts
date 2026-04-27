import { Command } from 'commander';
import * as fs from 'fs';
import { BookmarkStore } from './types';
import { resolveStorePath } from './config';
import { cmdCount } from './cmd-count';

function loadStore(storePath: string): BookmarkStore {
  if (!fs.existsSync(storePath)) {
    return { bookmarks: [] };
  }
  return JSON.parse(fs.readFileSync(storePath, 'utf-8')) as BookmarkStore;
}

export function registerCountCommand(program: Command): void {
  program
    .command('count')
    .description('Show bookmark counts broken down by tag, pin, and archive status')
    .option('-v, --verbose', 'Show per-tag breakdown')
    .option('--json', 'Output as JSON')
    .action((opts: { verbose?: boolean; json?: boolean }) => {
      const storePath = resolveStorePath();
      const store = loadStore(storePath);
      const output = cmdCount(store, {
        verbose: opts.verbose,
        json: opts.json,
      });
      console.log(output);
    });
}
