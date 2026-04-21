import type { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import { readFileSync, writeFileSync } from 'fs';
import { BookmarkStore } from './types';
import {
  archiveBookmark,
  unarchiveBookmark,
  listArchived,
  purgeArchived,
  formatArchivedList,
} from './cmd-archive';

function loadStore(storePath: string): BookmarkStore {
  try {
    return JSON.parse(readFileSync(storePath, 'utf-8'));
  } catch {
    return { bookmarks: [] };
  }
}

function writeStore(storePath: string, store: BookmarkStore): void {
  writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
}

export function registerArchiveCommand(program: Command): void {
  const archive = program.command('archive').description('Archive and manage archived bookmarks');

  archive
    .command('add <id>')
    .description('Archive a bookmark by ID')
    .action((id: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = archiveBookmark(store, id);
      if (!result) {
        console.error(`Bookmark not found: ${id}`);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Archived: ${result.url}`);
    });

  archive
    .command('restore <id>')
    .description('Unarchive a bookmark by ID')
    .action((id: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const result = unarchiveBookmark(store, id);
      if (!result) {
        console.error(`Bookmark not found: ${id}`);
        process.exit(1);
      }
      writeStore(storePath, store);
      console.log(`Unarchived: ${result.url}`);
    });

  archive
    .command('list')
    .description('List all archived bookmarks')
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const archived = listArchived(store);
      console.log(formatArchivedList(archived));
    });

  archive
    .command('purge')
    .description('Permanently delete all archived bookmarks')
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const count = purgeArchived(store);
      writeStore(storePath, store);
      console.log(`Purged ${count} archived bookmark(s).`);
    });
}
