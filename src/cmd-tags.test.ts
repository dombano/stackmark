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

/** Helper to capture all console.log output during an async operation. */
async function captureLog(fn: () => Promise<void>): Promise<string> {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await fn();
  const output = spy.mock.calls.map(c => c[0]).join('\n');
  spy.mockRestore();
  return output;
}

let store: BookmarkStore;

beforeEach(() => {
  store = makeStore();
  jest.spyOn(storage, 'loadStore').mockResolvedValue(store);
  jest.spyOn(storage, 'saveStore').mockResolvedValue();
});

afterEach(() => jest.restoreAllMocks());

test('list tags prints tag list', async () => {
  const output = await captureLog(() => cmdTags({ list: true }));
  expect(output).toContain('ts');
  expect(output).toContain('dev');
});

test('count tags shows counts', async () => {
  const output = await captureLog(() => cmdTags({ count: true }));
  expect(output).toContain('ts: 2');
  expect(output).toContain('dev: 2');
});

test('rename tag saves updated store', async () => {
  await captureLog(() => cmdTags({ rename: ['ts', 'typescript'] }));
  expect(storage.saveStore).toHaveBeenCalled();
  const saved = (storage.saveStore as jest.Mock).mock.calls[0][0] as BookmarkStore;
  const allTags = saved.bookmarks.flatMap(b => b.tags);
  expect(allTags).not.toContain('ts');
  expect(allTags).toContain('typescript');
});

test('remove tag saves updated store', async () => {
  await captureLog(() => cmdTags({ remove: 'dev' }));
  expect(storage.saveStore).toHaveBeenCalled();
  const saved = (storage.saveStore as jest.Mock).mock.calls[0][0] as BookmarkStore;
  const allTags = saved.bookmarks.flatMap(b => b.tags);
  expect(allTags).not.toContain('dev');
});
