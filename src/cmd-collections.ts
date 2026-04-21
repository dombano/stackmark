import { BookmarkStore, Bookmark } from './types';

export interface Collection {
  name: string;
  description?: string;
  bookmarkIds: string[];
  createdAt: string;
  updatedAt: string;
}

export function createCollection(store: BookmarkStore, name: string, description?: string): BookmarkStore {
  const collections: Record<string, Collection> = (store as any).collections ?? {};
  if (collections[name]) {
    throw new Error(`Collection "${name}" already exists`);
  }
  collections[name] = {
    name,
    description,
    bookmarkIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return { ...store, collections } as any;
}

export function deleteCollection(store: BookmarkStore, name: string): BookmarkStore {
  const collections: Record<string, Collection> = { ...((store as any).collections ?? {}) };
  if (!collections[name]) {
    throw new Error(`Collection "${name}" not found`);
  }
  delete collections[name];
  return { ...store, collections } as any;
}

export function addToCollection(store: BookmarkStore, collectionName: string, bookmarkId: string): BookmarkStore {
  const collections: Record<string, Collection> = JSON.parse(JSON.stringify((store as any).collections ?? {}));
  if (!collections[collectionName]) {
    throw new Error(`Collection "${collectionName}" not found`);
  }
  if (!store.bookmarks.find((b) => b.id === bookmarkId)) {
    throw new Error(`Bookmark "${bookmarkId}" not found`);
  }
  if (!collections[collectionName].bookmarkIds.includes(bookmarkId)) {
    collections[collectionName].bookmarkIds.push(bookmarkId);
    collections[collectionName].updatedAt = new Date().toISOString();
  }
  return { ...store, collections } as any;
}

export function removeFromCollection(store: BookmarkStore, collectionName: string, bookmarkId: string): BookmarkStore {
  const collections: Record<string, Collection> = JSON.parse(JSON.stringify((store as any).collections ?? {}));
  if (!collections[collectionName]) {
    throw new Error(`Collection "${collectionName}" not found`);
  }
  collections[collectionName].bookmarkIds = collections[collectionName].bookmarkIds.filter((id) => id !== bookmarkId);
  collections[collectionName].updatedAt = new Date().toISOString();
  return { ...store, collections } as any;
}

export function listCollections(store: BookmarkStore): Collection[] {
  const collections: Record<string, Collection> = (store as any).collections ?? {};
  return Object.values(collections).sort((a, b) => a.name.localeCompare(b.name));
}

export function getCollectionBookmarks(store: BookmarkStore, collectionName: string): Bookmark[] {
  const collections: Record<string, Collection> = (store as any).collections ?? {};
  const col = collections[collectionName];
  if (!col) throw new Error(`Collection "${collectionName}" not found`);
  return col.bookmarkIds
    .map((id) => store.bookmarks.find((b) => b.id === id))
    .filter((b): b is Bookmark => b !== undefined);
}
