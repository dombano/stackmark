import type { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import {
  createCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection,
  listCollections,
  getCollectionBookmarks,
} from './cmd-collections';
import { formatBookmarkList } from './format';

function loadStore(storePath: string) {
  const fs = require('fs');
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
}

function writeStore(storePath: string, store: any) {
  const fs = require('fs');
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
}

export function registerCollectionCommand(program: Command) {
  const col = program.command('collection').description('Manage bookmark collections');

  col
    .command('create <name>')
    .description('Create a new collection')
    .option('-d, --description <desc>', 'Collection description')
    .action((name: string, opts: { description?: string }) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const updated = createCollection(store, name, opts.description);
      writeStore(storePath, updated);
      console.log(`Collection "${name}" created.`);
    });

  col
    .command('delete <name>')
    .description('Delete a collection')
    .action((name: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const updated = deleteCollection(store, name);
      writeStore(storePath, updated);
      console.log(`Collection "${name}" deleted.`);
    });

  col
    .command('add <collection> <bookmarkId>')
    .description('Add a bookmark to a collection')
    .action((collection: string, bookmarkId: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const updated = addToCollection(store, collection, bookmarkId);
      writeStore(storePath, updated);
      console.log(`Bookmark added to "${collection}".`);
    });

  col
    .command('remove <collection> <bookmarkId>')
    .description('Remove a bookmark from a collection')
    .action((collection: string, bookmarkId: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const updated = removeFromCollection(store, collection, bookmarkId);
      writeStore(storePath, updated);
      console.log(`Bookmark removed from "${collection}".`);
    });

  col
    .command('list')
    .description('List all collections')
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const cols = listCollections(store);
      if (cols.length === 0) {
        console.log('No collections found.');
        return;
      }
      cols.forEach((c) => {
        const count = c.bookmarkIds.length;
        const desc = c.description ? ` — ${c.description}` : '';
        console.log(`  ${c.name}${desc} (${count} bookmark${count !== 1 ? 's' : ''})`);
      });
    });

  col
    .command('show <name>')
    .description('Show bookmarks in a collection')
    .action((name: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const bookmarks = getCollectionBookmarks(store, name);
      if (bookmarks.length === 0) {
        console.log(`Collection "${name}" is empty.`);
        return;
      }
      console.log(formatBookmarkList(bookmarks));
    });
}
