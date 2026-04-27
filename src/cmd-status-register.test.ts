import { describe, it, expect, beforeEach } from 'vitest';
import { Command } from 'commander';
import { writeFileSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { registerStatusCommand } from './cmd-status-register';
import { BookmarkStore } from './types';

function makeTempStore(): { path: string; write: (s: BookmarkStore) => void; read: () => BookmarkStore } {
  const dir = mkdtempSync(join(tmpdir(), 'stackmark-status-'));
  const path = join(dir, 'store.json');
  const write = (s: BookmarkStore) => writeFileSync(path, JSON.stringify(s, null, 2));
  const read = (): BookmarkStore => JSON.parse(require('fs').readFileSync(path, 'utf-8'));
  return { path, write, read };
}

function makeProgram(storePath: string): Command {
  const program = new Command();
  program.configureOutput({ writeErr: () => {} });
  // Patch resolveStorePath by overriding env
  process.env.STACKMARK_STORE = storePath;
  registerStatusCommand(program);
  return program;
}

describe('registerStatusCommand', () => {
  let store: ReturnType<typeof makeTempStore>;

  beforeEach(() => {
    store = makeTempStore();
    store.write({
      bookmarks: [
        { id: 'x1', url: 'https://x.com', title: 'X', tags: [], createdAt: '' },
      ],
    });
  });

  it('set: writes status to store', async () => {
    const program = makeProgram(store.path);
    await program.parseAsync(['node', 'cli', 'status', 'set', 'x1', 'reading']);
    const updated = store.read();
    expect((updated.bookmarks[0] as any).status).toBe('reading');
  });

  it('remove: clears status from store', async () => {
    store.write({
      bookmarks: [
        { id: 'x1', url: 'https://x.com', title: 'X', tags: [], createdAt: '', status: 'done' } as any,
      ],
    });
    const program = makeProgram(store.path);
    await program.parseAsync(['node', 'cli', 'status', 'remove', 'x1']);
    const updated = store.read();
    expect((updated.bookmarks[0] as any).status).toBeUndefined();
  });

  it('list: filters bookmarks by status', async () => {
    store.write({
      bookmarks: [
        { id: 'x1', url: 'https://x.com', title: 'X', tags: [], createdAt: '', status: 'done' } as any,
        { id: 'x2', url: 'https://y.com', title: 'Y', tags: [], createdAt: '', status: 'reading' } as any,
      ],
    });
    const logs: string[] = [];
    const program = makeProgram(store.path);
    const orig = console.log;
    console.log = (msg: string) => logs.push(msg);
    await program.parseAsync(['node', 'cli', 'status', 'list', 'done']);
    console.log = orig;
    expect(logs.some((l) => l.includes('x1'))).toBe(true);
    expect(logs.some((l) => l.includes('x2'))).toBe(false);
  });

  it('summary: outputs counts', async () => {
    const logs: string[] = [];
    const program = makeProgram(store.path);
    const orig = console.log;
    console.log = (msg: string) => logs.push(msg);
    await program.parseAsync(['node', 'cli', 'status', 'summary']);
    console.log = orig;
    expect(logs[0]).toContain('unread:');
  });
});
