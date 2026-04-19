import fs from 'fs';
import path from 'path';
import os from 'os';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
}

export interface Store {
  bookmarks: Bookmark[];
}

const DATA_DIR = path.join(os.homedir(), '.stackmark');
const DATA_FILE = path.join(DATA_DIR, 'bookmarks.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadStore(): Store {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return { bookmarks: [] };
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Store;
}

export function saveStore(store: Store): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
  const store = loadStore();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.bookmarks.push(newBookmark);
  saveStore(store);
  return newBookmark;
}

export function removeBookmark(id: string): boolean {
  const store = loadStore();
  const index = store.bookmarks.findIndex((b) => b.id === id);
  if (index === -1) return false;
  store.bookmarks.splice(index, 1);
  saveStore(store);
  return true;
}

export function listBookmarks(): Bookmark[] {
  return loadStore().bookmarks;
}
