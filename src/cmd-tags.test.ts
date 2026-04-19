import { cmdTags } from './cmd-tags';
import * as storage from './storage';
import { BookmarkStore } from './storage';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: '1', url: 'https://a.com', title: 'A', tags: ['ts', 'dev'], createdAt: '' },
      { id: '2', url: 'https://b.com', title: 'B', tags: ['ts', 'web'], createdAt: '' },
      { id: '3', url: 'https://c.com', title: 'C', tags: ['dev'], createdAt: '' },
    ],
  };
}

let store: BookmarkStore;

beforeEach(() => {
  store = makeStore();
  jest.spyOn(storage, 'loadStore').mockResolvedValue(store);
  jest.spyOn(storage, 'saveStore').mockResolvedValue();
});

afterEach(() => jest.restoreAllMocks());

test('list tags prints tag list', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await cmdTags({ list: true });
  expect(spy).toHaveBeenCalled();
  const output = spy.mock.calls.map(c => c[0]).join('\n');
  expect(output).toContain('ts');
  expect(output).toContain('dev');
  spy.mockRestore();
});

test('count tags shows counts', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await cmdTags({ count: true });
  const output = spy.mock.calls.map(c => c[0]).join('\n');
  expect(output).toContain('ts: 2');
  expect(output).toContain('dev: 2');
  spy.mockRestore();
});

test('rename tag saves updated store', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await cmdTags({ rename: ['ts', 'typescript'] });
  expect(storage.saveStore).toHaveBeenCalled();
  const saved = (storage.saveStore as jest.Mock).mock.calls[0][0] as BookmarkStore;
  const allTags = saved.bookmarks.flatMap(b => b.tags);
  expect(allTags).not.toContain('ts');
  expect(allTags).toContain('typescript');
  spy.mockRestore();
});

test('remove tag saves updated store', async () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await cmdTags({ remove: 'dev' });
  expect(storage.saveStore).toHaveBeenCalled();
  const saved = (storage.saveStore as jest.Mock).mock.calls[0][0] as BookmarkStore;
  const allTags = saved.bookmarks.flatMap(b => b.tags);
  expect(allTags).not.toContain('dev');
  spy.mockRestore();
});
