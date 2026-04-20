import { loadConfig, resolveStorePath } from './config';
import { findBookmark } from './storage';
import { searchBookmarks } from './search';
import { execSync } from 'child_process';
import * as fs from 'fs';

function detectOpener(): string {
  const platform = process.platform;
  if (platform === 'darwin') return 'open';
  if (platform === 'win32') return 'start';
  return 'xdg-open';
}

export function cmdOpen(
  query: string,
  opts: { browser?: string; dry?: boolean } = {}
): { opened: string | null; error?: string } {
  const config = loadConfig();
  const storePath = resolveStorePath(config);

  if (!fs.existsSync(storePath)) {
    return { opened: null, error: 'No bookmark store found.' };
  }

  const raw = fs.readFileSync(storePath, 'utf-8');
  const store = JSON.parse(raw);

  // Try exact id/url match first
  let bookmark = findBookmark(store, query);

  // Fall back to fuzzy search
  if (!bookmark) {
    const results = searchBookmarks(store.bookmarks ?? [], query);
    if (results.length > 0) {
      bookmark = results[0];
    }
  }

  if (!bookmark) {
    return { opened: null, error: `No bookmark found matching: ${query}` };
  }

  const opener = opts.browser ?? detectOpener();
  const url = bookmark.url;

  if (opts.dry) {
    return { opened: url };
  }

  try {
    execSync(`${opener} "${url}"`, { stdio: 'ignore' });
    return { opened: url };
  } catch (e) {
    return { opened: null, error: `Failed to open URL: ${url}` };
  }
}
