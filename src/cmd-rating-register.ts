import type { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import { readFileSync, writeFileSync } from 'fs';
import { BookmarkStore } from './types';
import {
  setRating, removeRating, filterByMinRating,
  sortByRating, formatRating, averageRating
} from './cmd-rating';

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

export function registerRatingCommand(program: Command): void {
  const rating = program.command('rating').description('Manage bookmark ratings (1–5 stars)');

  rating
    .command('set <id> <stars>')
    .description('Set a star rating (1–5) for a bookmark')
    .action((id: string, stars: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const bm = setRating(store, id, parseInt(stars, 10));
      writeStore(storePath, store);
      console.log(`Rated: [${id}] ${bm.title ?? bm.url}`);
      console.log(formatRating(bm));
    });

  rating
    .command('remove <id>')
    .description('Remove the rating from a bookmark')
    .action((id: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      removeRating(store, id);
      writeStore(storePath, store);
      console.log(`Rating removed from bookmark: ${id}`);
    });

  rating
    .command('list')
    .description('List bookmarks sorted by rating')
    .option('--min <stars>', 'Filter by minimum rating', '1')
    .action((opts: { min: string }) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const min = parseInt(opts.min, 10);
      const filtered = filterByMinRating(store, min);
      const sorted = sortByRating(filtered);
      if (sorted.length === 0) {
        console.log('No rated bookmarks found.');
        return;
      }
      for (const bm of sorted) {
        console.log(`${formatRating(bm)}  [${bm.id}] ${bm.title ?? bm.url}`);
      }
      const avg = averageRating(store);
      if (avg !== null) console.log(`\nAverage rating: ${avg}/5`);
    });
}
