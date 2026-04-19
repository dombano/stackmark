import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
  notes?: string;
}

export interface BookmarkStore {
  bookmarks: Bookmark[];
}

const DATA_DIR = path.join(os.homedir(), '.stackmark');
const DATA_FILE = path.join(DATA_DIR, 'bookmarks.json');

export async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function loadStore(): Promise<BookmarkStore> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as BookmarkStore;
  } catch {
    return { bookmarks: [] };
  }
}

export async function saveStore(store: BookmarkStore): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export function addBookmark(store: BookmarkStore, bookmark: Bookmark): BookmarkStore {
  return { ...store, bookmarks: [...store.bookmarks, bookmark] };
}

export function removeBookmark(store: BookmarkStore, id: string): BookmarkStore {
  return { ...store, bookmarks: store.bookmarks.filter(b => b.id !== id) };
}

export function findBookmark(store: BookmarkStore, id: string): Bookmark | undefined {
  return store.bookmarks.find(b => b.id === id);
}
