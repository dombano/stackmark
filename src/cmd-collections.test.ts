import {
  createCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection,
  listCollections,
  getCollectionBookmarks,
} from './cmd-collections';
import { BookmarkStore } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: 'abc123', url: 'https://example.com', title: 'Example', tags: [], createdAt: '2024-01-01T00:00:00Z' },
      { id: 'def456', url: 'https://test.org', title: 'Test', tags: [], createdAt: '2024-01-02T00:00:00Z' },
    ],
  } as any;
}

test('createCollection adds a new collection', () => {
  const store = makeStore();
  const updated = createCollection(store, 'work', 'Work bookmarks');
  const cols = listCollections(updated);
  expect(cols).toHaveLength(1);
  expect(cols[0].name).toBe('work');
  expect(cols[0].description).toBe('Work bookmarks');
  expect(cols[0].bookmarkIds).toEqual([]);
});

test('createCollection throws if name already exists', () => {
  let store = makeStore();
  store = createCollection(store, 'work');
  expect(() => createCollection(store, 'work')).toThrow('already exists');
});

test('deleteCollection removes the collection', () => {
  let store = makeStore();
  store = createCollection(store, 'work');
  store = deleteCollection(store, 'work');
  expect(listCollections(store)).toHaveLength(0);
});

test('deleteCollection throws if not found', () => {
  const store = makeStore();
  expect(() => deleteCollection(store, 'missing')).toThrow('not found');
});

test('addToCollection adds bookmark id', () => {
  let store = makeStore();
  store = createCollection(store, 'work');
  store = addToCollection(store, 'work', 'abc123');
  const cols = listCollections(store);
  expect(cols[0].bookmarkIds).toContain('abc123');
});

test('addToCollection does not duplicate', () => {
  let store = makeStore();
  store = createCollection(store, 'work');
  store = addToCollection(store, 'work', 'abc123');
  store = addToCollection(store, 'work', 'abc123');
  expect(listCollections(store)[0].bookmarkIds).toHaveLength(1);
});

test('removeFromCollection removes bookmark id', () => {
  let store = makeStore();
  store = createCollection(store, 'work');
  store = addToCollection(store, 'work', 'abc123');
  store = removeFromCollection(store, 'work', 'abc123');
  expect(listCollections(store)[0].bookmarkIds).toHaveLength(0);
});

test('getCollectionBookmarks returns full bookmark objects', () => {
  let store = makeStore();
  store = createCollection(store, 'work');
  store = addToCollection(store, 'work', 'abc123');
  const bookmarks = getCollectionBookmarks(store, 'work');
  expect(bookmarks).toHaveLength(1);
  expect(bookmarks[0].url).toBe('https://example.com');
});
