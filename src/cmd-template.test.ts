import { describe, it, expect, beforeEach } from 'vitest';
import { BookmarkStore } from './types';
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  applyTemplate,
  getTemplate,
} from './cmd-template';

function makeStore(): BookmarkStore {
  return { bookmarks: [], templates: [] } as unknown as BookmarkStore;
}

describe('createTemplate', () => {
  it('creates a new template', () => {
    const store = makeStore();
    const tpl = createTemplate(store, 'work', ['work', 'ref'], 'https://*.example.com');
    expect(tpl.name).toBe('work');
    expect(tpl.tags).toEqual(['work', 'ref']);
    expect(store.templates).toHaveLength(1);
  });

  it('throws if template name already exists', () => {
    const store = makeStore();
    createTemplate(store, 'dev', ['dev']);
    expect(() => createTemplate(store, 'dev', ['other'])).toThrow(
      'Template "dev" already exists'
    );
  });
});

describe('deleteTemplate', () => {
  it('removes an existing template', () => {
    const store = makeStore();
    createTemplate(store, 'news', ['news']);
    const result = deleteTemplate(store, 'news');
    expect(result).toBe(true);
    expect(store.templates).toHaveLength(0);
  });

  it('returns false when template not found', () => {
    const store = makeStore();
    expect(deleteTemplate(store, 'ghost')).toBe(false);
  });
});

describe('listTemplates', () => {
  it('returns all templates', () => {
    const store = makeStore();
    createTemplate(store, 'a', ['a']);
    createTemplate(store, 'b', ['b']);
    expect(listTemplates(store)).toHaveLength(2);
  });

  it('returns empty array when none exist', () => {
    const store = makeStore();
    expect(listTemplates(store)).toEqual([]);
  });
});

describe('applyTemplate', () => {
  it('applies template tags to a url', () => {
    const store = makeStore();
    createTemplate(store, 'blog', ['blog', 'reading'], undefined, 'A blog post');
    const partial = applyTemplate(store, 'blog', 'https://example.com/post');
    expect(partial.url).toBe('https://example.com/post');
    expect(partial.tags).toEqual(['blog', 'reading']);
    expect(partial.notes).toBe('A blog post');
  });

  it('overrides tags when provided', () => {
    const store = makeStore();
    createTemplate(store, 'ref', ['ref']);
    const partial = applyTemplate(store, 'ref', 'https://docs.io', ['docs', 'api']);
    expect(partial.tags).toEqual(['docs', 'api']);
  });

  it('throws if template not found', () => {
    const store = makeStore();
    expect(() => applyTemplate(store, 'missing', 'https://x.com')).toThrow(
      'Template "missing" not found'
    );
  });
});

describe('getTemplate', () => {
  it('finds a template by name', () => {
    const store = makeStore();
    createTemplate(store, 'video', ['video']);
    expect(getTemplate(store, 'video')?.name).toBe('video');
  });

  it('returns undefined for unknown name', () => {
    const store = makeStore();
    expect(getTemplate(store, 'nope')).toBeUndefined();
  });
});
