import { cmdAdd } from './cmd-add';
import * as storage from './storage';

const makeStore = () => ({ bookmarks: [] });

beforeEach(() => {
  jest.spyOn(storage, 'loadStore').mockResolvedValue(makeStore() as any);
  jest.spyOn(storage, 'saveStore').mockResolvedValue(undefined);
});

afterEach(() => jest.restoreAllMocks());

describe('cmdAdd', () => {
  it('adds a bookmark and returns formatted message', async () => {
    const result = await cmdAdd('https://example.com', 'Example', { tags: ['web'] });
    expect(result).toContain('Added:');
    expect(result).toContain('Example');
    expect(storage.saveStore).toHaveBeenCalled();
  });

  it('throws on invalid URL', async () => {
    await expect(cmdAdd('not-a-url', 'Bad')).rejects.toThrow('Invalid URL');
  });

  it('throws on empty title', async () => {
    await expect(cmdAdd('https://example.com', '   ')).rejects.toThrow('Title must not be empty');
  });

  it('normalizes tags', async () => {
    const spy = jest.spyOn(storage, 'addBookmark');
    await cmdAdd('https://example.com', 'Example', { tags: ['WEB', ' Dev '] });
    const call = (spy as jest.Mock).mock.calls[0][1];
    expect(call.tags).toEqual(['web', 'dev']);
  });

  it('uses empty description when not provided', async () => {
    const spy = jest.spyOn(storage, 'addBookmark');
    await cmdAdd('https://example.com', 'Example');
    const call = (spy as jest.Mock).mock.calls[0][1];
    expect(call.description).toBe('');
  });
});
