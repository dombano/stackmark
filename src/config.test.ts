import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

vi.mock('fs');

import { loadConfig, saveConfig, resolveStorePath, getConfigPath } from './config';

const defaultStorePath = path.join(os.homedir(), '.stackmark', 'bookmarks.json');

describe('loadConfig', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns defaults when config file does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const config = loadConfig();
    expect(config.storePath).toBe(defaultStorePath);
    expect(config.maxResults).toBe(20);
    expect(config.defaultExportFormat).toBe('json');
  });

  it('merges saved config with defaults', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ maxResults: 50 }));
    const config = loadConfig();
    expect(config.maxResults).toBe(50);
    expect(config.storePath).toBe(defaultStorePath);
  });

  it('returns defaults on parse error', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('not json');
    const config = loadConfig();
    expect(config.maxResults).toBe(20);
  });
});

describe('resolveStorePath', () => {
  it('returns absolute path of override if provided', () => {
    const result = resolveStorePath('/tmp/custom.json');
    expect(result).toBe('/tmp/custom.json');
  });

  it('returns config store path when no override', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const result = resolveStorePath();
    expect(result).toBe(defaultStorePath);
  });
});
