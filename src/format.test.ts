import { formatBookmark, formatBookmarkList, formatBookmarkPlain, formatCount } from './format';
import { Bookmark } from './storage';

const mockBookmark: Bookmark = {
  id: 'abc123',
  url: 'https://example.com',
  title: 'Example Site',
  tags: ['web', 'test'],
  note: 'A test bookmark',
  createdAt: new Date('2024-01-15').toISOString(),
};

const minimalBookmark: Bookmark = {
  id: 'def456',
  url: 'https://minimal.io',
  title: 'Minimal',
  tags: [],
  createdAt: new Date('2024-03-01').toISOString(),
};

describe('formatBookmark', () => {
  it('includes title and url', () => {
    const result = formatBookmark(mockBookmark);
    expect(result).toContain('Example Site');
    expect(result).toContain('https://example.com');
  });

  it('includes tags when present', () => {
    const result = formatBookmark(mockBookmark);
    expect(result).toContain('web');
    expect(result).toContain('test');
  });

  it('includes note when present', () => {
    const result = formatBookmark(mockBookmark);
    expect(result).toContain('A test bookmark');
  });

  it('omits note when absent', () => {
    const result = formatBookmark(minimalBookmark);
    expect(result).not.toContain('note');
  });

  it('includes index prefix when provided', () => {
    const result = formatBookmark(mockBookmark, 0);
    expect(result).toContain('1.');
  });
});

describe('formatBookmarkList', () => {
  it('returns empty message for empty list', () => {
    const result = formatBookmarkList([]);
    expect(result).toContain('No bookmarks found');
  });

  it('formats multiple bookmarks', () => {
    const result = formatBookmarkList([mockBookmark, minimalBookmark]);
    expect(result).toContain('Example Site');
    expect(result).toContain('Minimal');
  });
});

describe('formatBookmarkPlain', () => {
  it('produces output without ANSI codes', () => {
    const result = formatBookmarkPlain(mockBookmark, 0);
    expect(result).not.toMatch(/\x1b\[/);
    expect(result).toContain('Example Site');
  });
});

describe('formatCount', () => {
  it('formats singular correctly', () => {
    expect(formatCount(1, 1)).toContain('1 bookmark');
  });

  it('formats plural correctly', () => {
    expect(formatCount(3, 10)).toContain('3');
    expect(formatCount(3, 10)).toContain('10 bookmarks');
  });
});
