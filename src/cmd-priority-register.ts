import { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import { readFileSync, writeFileSync } from 'fs';
import { Store } from './types';
import {
  isValidPriority,
  setPriority,
  removePriority,
  filterByPriority,
  sortByPriority,
  formatPriorityList,
  Priority,
} from './cmd-priority';

function loadStore(storePath: string): Store {
  try {
    return JSON.parse(readFileSync(storePath, 'utf-8'));
  } catch {
    return { bookmarks: [] };
  }
}

function writeStore(storePath: string, store: Store): void {
  writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
}

export function registerPriorityCommand(program: Command): void {
  const priority = program
    .command('priority')
    .description('Manage bookmark priorities (low, medium, high)');

  priority
    .command('set <id> <level>')
    .description('Set priority level for a bookmark')
    .action((id: string, level: string) => {
      if (!isValidPriority(level)) {
        console.error(`Invalid priority "${level}". Use: low, medium, high`);
        process.exit(1);
      }
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = setPriority(store, id, level as Priority);
      if (!result) {
        console.error(`Bookmark "${id}" not found.`);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Priority set to "${level}" for bookmark ${id}.`);
    });

  priority
    .command('remove <id>')
    .description('Remove priority from a bookmark')
    .action((id: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = removePriority(store, id);
      if (!result) {
        console.error(`Bookmark "${id}" not found.`);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Priority removed from bookmark ${id}.`);
    });

  priority
    .command('list [level]')
    .description('List bookmarks by priority, optionally filtered by level')
    .action((level?: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      let bookmarks = level && isValidPriority(level)
        ? filterByPriority(store, level as Priority)
        : sortByPriority(store.bookmarks);
      console.log(formatPriorityList(bookmarks));
    });
}
