import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cmdSearch, cmdList } from './cmd-search';
import * as storage from './storage';

const mockStore = {
  bookmarks: [
    { id: '1', url: 'https://example.com', title: 'Example', tags: ['web'], createdAt: '' },
    { id: '2', url: 'https://typescript.org', title: 'TypeScript', tags: ['dev', 'ts'], createdAt: '' },
    { id: '3', url: 'https://nodejs.org', title: 'Node.js', tags: ['dev', 'js'], createdAt: '' },
  ],
};

beforeEach(() => {
  vi.spyOn(storage, 'loadStore').mockResolvedValue(mockStore as any);
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('cmdSearch', () => {
  it('prints results for a matching query', async () => {
    await cmdSearch('typescript');
    expect(console.log).toHaveBeenCalled();
  });

  it('prints no bookmarks message when nothing matches', async () => {
    await cmdSearch('zzznomatch');
    expect(console.log).toHaveBeenCalledWith('No bookmarks found.');
  });

  it('filters by tags when provided', async () => {
    await cmdSearch('', { tags: ['dev'] });
    const calls = (console.log as any).mock.calls.flat().join(' ');
    expect(calls).toContain('TypeScript');
  });

  it('respects limit option', async () => {
    await cmdSearch('', { limit: 1 });
    expect(console.log).toHaveBeenCalled();
  });
});

describe('cmdList', () => {
  it('lists all bookmarks up to limit', async () => {
    await cmdList({ limit: 10 });
    expect(storage.loadStore).toHaveBeenCalled();
  });
});
