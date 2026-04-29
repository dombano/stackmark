import { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import { cmdRename } from './cmd-rename';
import fs from 'fs';

function loadStore(storePath: string) {
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
}

function writeStore(storePath: string, store: object) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
}

export function registerRenameCommand(program: Command): void {
  program
    .command('rename <id> <title>')
    .description('Rename a bookmark by id or alias')
    .option('-q, --quiet', 'Output only the new title')
    .action((id: string, title: string, opts: { quiet?: boolean }) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      try {
        const result = cmdRename(store, id, title, { quiet: opts.quiet });
        writeStore(storePath, store);
        console.log(result);
      } catch (err: unknown) {
        console.error((err as Error).message);
        process.exit(1);
      }
    });
}
