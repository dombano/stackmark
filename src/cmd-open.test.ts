import { cmdOpen } from './cmd-open';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { loadConfig, resolveStorePath } from './config';

jest.mock('./config');

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockResolveStorePath = resolveStorePath as jest.MockedFunction<typeof resolveStorePath>;

function makeTempStore(bookmarks: object[]): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stackmark-'));
  const p = path.join(dir, 'store.json');
  fs.writeFileSync(p, JSON.stringify({ bookmarks }));
  return p;
}

beforeEach(() => {
  mockLoadConfig.mockReturnValue({ storePath: '/tmp/store.json' } as any);
});

test('returns error when store does not exist', () => {
  mockResolveStorePath.mockReturnValue('/nonexistent/store.json');
  const result = cmdOpen('anything');
  expect(result.opened).toBeNull();
  expect(result.error).toMatch(/No bookmark store/);
});

test('opens bookmark by exact url match (dry run)', () => {
  const storePath = makeTempStore([
    { id: '1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '' }
  ]);
  mockResolveStorePath.mockReturnValue(storePath);
  const result = cmdOpen('https://example.com', { dry: true });
  expect(result.opened).toBe('https://example.com');
  expect(result.error).toBeUndefined();
});

test('opens bookmark by fuzzy title match (dry run)', () => {
  const storePath = makeTempStore([
    { id: '2', url: 'https://github.com', title: 'GitHub', tags: ['dev'], createdAt: '' }
  ]);
  mockResolveStorePath.mockReturnValue(storePath);
  const result = cmdOpen('github', { dry: true });
  expect(result.opened).toBe('https://github.com');
});

test('returns error when no match found', () => {
  const storePath = makeTempStore([
    { id: '3', url: 'https://rust-lang.org', title: 'Rust', tags: [], createdAt: '' }
  ]);
  mockResolveStorePath.mockReturnValue(storePath);
  const result = cmdOpen('zzznomatch', { dry: true });
  expect(result.opened).toBeNull();
  expect(result.error).toMatch(/No bookmark found/);
});
