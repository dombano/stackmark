import { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import { readFileSync, writeFileSync } from 'fs';
import { BookmarkStore } from './types';
import { setComment, removeComment, listWithComments, formatCommentList } from './cmd-comment';

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

export function registerCommentCommand(program: Command): void {
  const comment = program
    .command('comment')
    .description('Manage inline comments on bookmarks');

  comment
    .command('set <id> <text>')
    .description('Set a comment on a bookmark')
    .action((id: string, text: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      try {
        const bm = setComment(store, id, text);
        writeStore(storePath, store);
        console.log(`Comment set on ${bm.url}`);
      } catch (err: any) {
        console.error(err.message);
        process.exit(1);
      }
    });

  comment
    .command('remove <id>')
    .description('Remove the comment from a bookmark')
    .action((id: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      try {
        const bm = removeComment(store, id);
        writeStore(storePath, store);
        console.log(`Comment removed from ${bm.url}`);
      } catch (err: any) {
        console.error(err.message);
        process.exit(1);
      }
    });

  comment
    .command('list')
    .description('List all bookmarks that have comments')
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const results = listWithComments(store);
      console.log(formatCommentList(results));
    });
}
