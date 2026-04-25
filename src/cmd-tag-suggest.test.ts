import { describe, it, expect } from 'vitest';
import { suggestTags, formatSuggestions } from './cmd-tag-suggest';
import { BookmarkStore } from './types';

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: '1', url: 'https://github.com/rust-lang/rust', title: 'Rust Language', tags: ['rust', 'programming'], createdAt: '' },
      { id: '2', url: 'https://github.com/microsoft/typescript', title: 'TypeScript', tags: ['typescript', 'programming'], createdAt: '' },
      { id: '3', url: 'https://docs.rs/tokio', title: 'Tokio Async Runtime', tags: ['rust', 'async'], createdAt: '' },
      { id: '4', url: 'https://nodejs.org', title: 'Node.js', tags: ['nodejs', 'javascript'], createdAt: '' },
    ],
  };
}

describe('suggestTags', () => {
  it('suggests tags based on URL content', () => {
    const store = makeStore();
    const tags = suggestTags({ url: 'https://github.com/denoland/deno', title: 'Deno Runtime', tags: [] }, store);
    expect(tags).toContain('programming');
  });

  it('suggests rust tag for rust-related bookmark', () => {
    const store = makeStore();
    const tags = suggestTags({ url: 'https://crates.io/crates/serde', title: 'serde rust crate', tags: [] }, store);
    expect(tags).toContain('rust');
  });

  it('excludes already-applied tags', () => {
    const store = makeStore();
    const tags = suggestTags({ url: 'https://github.com/rust-lang/cargo', title: 'Cargo Rust', tags: ['rust'] }, store);
    expect(tags).not.toContain('rust');
  });

  it('respects the limit parameter', () => {
    const store = makeStore();
    const tags = suggestTags({ url: 'https://example.com', title: 'example', tags: [] }, store, 2);
    expect(tags.length).toBeLessThanOrEqual(2);
  });

  it('returns empty array when no relevant tags found', () => {
    const store = { bookmarks: [] };
    const tags = suggestTags({ url: 'https://example.com', title: '', tags: [] }, store);
    expect(tags).toEqual([]);
  });
});

describe('formatSuggestions', () => {
  it('formats a list of suggestions', () => {
    const out = formatSuggestions(['rust', 'async']);
    expect(out).toContain('rust');
    expect(out).toContain('async');
    expect(out).toContain('•');
  });

  it('returns fallback message when empty', () => {
    expect(formatSuggestions([])).toBe('No tag suggestions found.');
  });
});
