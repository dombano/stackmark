import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Command } from 'commander';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { registerTagSuggestCommand } from './cmd-tag-suggest-register';
import { BookmarkStore } from './types';

function makeTempStore(): { storePath: string; cleanup: () => void } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stackmark-suggest-'));
  const storePath = path.join(dir, 'bookmarks.json');
  const store: BookmarkStore = {
    bookmarks: [
      { id: 'abc1', url: 'https://github.com/rust-lang/rust', title: 'Rust', tags: ['rust', 'programming'], createdAt: '' },
      { id: 'abc2', url: 'https://nodejs.org', title: 'Node.js', tags: ['nodejs', 'javascript'], createdAt: '' },
    ],
  };
  fs.writeFileSync(storePath, JSON.stringify(store));
  return { storePath, cleanup: () => fs.rmSync(dir, { recursive: true }) };
}

describe('registerTagSuggestCommand', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.STACKMARK_STORE;
  });

  afterEach(() => {
    if (originalEnv !== undefined) process.env.STACKMARK_STORE = originalEnv;
    else delete process.env.STACKMARK_STORE;
  });

  it('registers the tag-suggest command', () => {
    const program = new Command();
    registerTagSuggestCommand(program);
    const cmd = program.commands.find(c => c.name() === 'tag-suggest');
    expect(cmd).toBeDefined();
  });

  it('outputs suggestions for a raw URL', () => {
    const { storePath, cleanup } = makeTempStore();
    process.env.STACKMARK_STORE = storePath;
    const program = new Command();
    program.exitOverride();
    registerTagSuggestCommand(program);

    const logs: string[] = [];
    const spy = vi.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')));

    program.parse(['node', 'stackmark', 'tag-suggest', 'https://github.com/rust-lang/cargo', '--plain']);
    spy.mockRestore();
    cleanup();

    expect(logs.join(' ')).toMatch(/rust|programming/);
  });

  it('outputs formatted suggestions for a known bookmark by id', () => {
    const { storePath, cleanup } = makeTempStore();
    process.env.STACKMARK_STORE = storePath;
    const program = new Command();
    program.exitOverride();
    registerTagSuggestCommand(program);

    const logs: string[] = [];
    const spy = vi.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')));

    program.parse(['node', 'stackmark', 'tag-suggest', 'abc2']);
    spy.mockRestore();
    cleanup();

    const output = logs.join('\n');
    expect(output).toContain('Bookmark:');
  });
});
