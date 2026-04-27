import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { resolveStorePath } from './config';
import {
  isValidStatus,
  setStatus,
  removeStatus,
  getStatus,
  filterByStatus,
  countByStatus,
  formatStatusSummary,
  StatusValue,
} from './cmd-status';
import { BookmarkStore } from './types';

function loadStore(storePath: string): BookmarkStore {
  try {
    return JSON.parse(readFileSync(storePath, 'utf-8'));
  } catch {
    return { bookmarks: [] };
  }
}

function writeStore(storePath: string, store: BookmarkStore): void {
  writeFileSync(storePath, JSON.stringify(store, null, 2));
}

export function registerStatusCommand(program: Command): void {
  const status = program.command('status').description('Manage read status of bookmarks');

  status
    .command('set <id> <status>')
    .description('Set status on a bookmark (unread|reading|done|archived)')
    .action((id: string, s: string) => {
      if (!isValidStatus(s)) {
        console.error(`Invalid status "${s}". Valid: unread, reading, done, archived`);
        process.exit(1);
      }
      const path = resolveStorePath();
      const store = loadStore(path);
      writeStore(path, setStatus(store, id, s as StatusValue));
      console.log(`Status of ${id} set to "${s}".`);
    });

  status
    .command('get <id>')
    .description('Get status of a bookmark')
    .action((id: string) => {
      const store = loadStore(resolveStorePath());
      const s = getStatus(store, id);
      console.log(s ? `Status: ${s}` : 'No status set.');
    });

  status
    .command('remove <id>')
    .description('Remove status from a bookmark')
    .action((id: string) => {
      const path = resolveStorePath();
      const store = loadStore(path);
      writeStore(path, removeStatus(store, id));
      console.log(`Status removed from ${id}.`);
    });

  status
    .command('list <status>')
    .description('List bookmarks with a given status')
    .action((s: string) => {
      if (!isValidStatus(s)) {
        console.error(`Invalid status "${s}".`);
        process.exit(1);
      }
      const store = loadStore(resolveStorePath());
      const results = filterByStatus(store, s as StatusValue);
      if (results.length === 0) {
        console.log('No bookmarks found.');
      } else {
        results.forEach((b) => console.log(`[${b.id}] ${b.title} — ${b.url}`));
      }
    });

  status
    .command('summary')
    .description('Show count of bookmarks per status')
    .action(() => {
      const store = loadStore(resolveStorePath());
      console.log(formatStatusSummary(countByStatus(store)));
    });
}
