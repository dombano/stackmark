import { loadStore, saveStore } from "./storage";
import { findBookmark } from "./storage";
import { resolveStorePath } from "./config";

export async function cmdNoteSet(
  query: string,
  note: string,
  opts: { config?: string } = {}
): Promise<void> {
  const storePath = resolveStorePath(opts.config);
  const store = loadStore(storePath);
  const bookmark = findBookmark(store, query);

  if (!bookmark) {
    console.error(`No bookmark found matching: ${query}`);
    process.exit(1);
  }

  bookmark.note = note.trim();
  saveStore(storePath, store);
  console.log(`Note set for: ${bookmark.url}`);
}

export async function cmdNoteGet(
  query: string,
  opts: { config?: string } = {}
): Promise<void> {
  const storePath = resolveStorePath(opts.config);
  const store = loadStore(storePath);
  const bookmark = findBookmark(store, query);

  if (!bookmark) {
    console.error(`No bookmark found matching: ${query}`);
    process.exit(1);
  }

  if (!bookmark.note) {
    console.log(`(no note)`);
  } else {
    console.log(bookmark.note);
  }
}

export async function cmdNoteClear(
  query: string,
  opts: { config?: string } = {}
): Promise<void> {
  const storePath = resolveStorePath(opts.config);
  const store = loadStore(storePath);
  const bookmark = findBookmark(store, query);

  if (!bookmark) {
    console.error(`No bookmark found matching: ${query}`);
    process.exit(1);
  }

  delete bookmark.note;
  saveStore(storePath, store);
  console.log(`Note cleared for: ${bookmark.url}`);
}
