import type { Command } from 'commander';
import fs from 'fs';
import { resolveStorePath } from './config';
import { suggestTags, formatSuggestions } from './cmd-tag-suggest';
import { findBookmark } from './storage';
import { BookmarkStore } from './types';

function loadStore(storePath: string): BookmarkStore {
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
}

export function registerTagSuggestCommand(program: Command): void {
  program
    .command('tag-suggest <id-or-url>')
    .description('Suggest tags for a bookmark based on existing tags in your store')
    .option('-n, --limit <number>', 'Maximum number of suggestions', '5')
    .option('--plain', 'Output plain tag list (space-separated)')
    .action((idOrUrl: string, opts: { limit: string; plain?: boolean }) => {
      const storePath = resolveStorePath();
      const store = loadStore(storePath);

      const bookmark = findBookmark(store, idOrUrl);
      if (!bookmark) {
        // Treat as a raw URL for preview suggestions
        const tags = suggestTags({ url: idOrUrl, title: '', tags: [] }, store, parseInt(opts.limit, 10));
        if (opts.plain) {
          console.log(tags.join(' '));
        } else {
          console.log(formatSuggestions(tags));
        }
        return;
      }

      const tags = suggestTags(bookmark, store, parseInt(opts.limit, 10));
      if (opts.plain) {
        console.log(tags.join(' '));
      } else {
        console.log(`Bookmark: ${bookmark.url}`);
        console.log(formatSuggestions(tags));
      }
    });
}
