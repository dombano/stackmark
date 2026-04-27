import { setExpiry, removeExpiry, getExpiry, listExpiring, listExpired, purgeExpired, formatExpiryInfo } from './cmd-expire';
import { Store } from './types';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', tags: [], createdAt: Date.now(), meta: {} },
      { id: 'b2', url: 'https://foo.dev', tags: [], createdAt: Date.now(), meta: {} },
      { id: 'c3', url: 'https://bar.io', tags: [], createdAt: Date.now(), meta: {} },
    ],
  };
}

describe('setExpiry', () => {
  it('sets expiresAt on the bookmark', () => {
    const store = makeStore();
    const date = new Date(Date.now() + 86400000 * 10);
    setExpiry(store, 'a1', date);
    expect(store.bookmarks[0].meta?.expiresAt).toBe(date.getTime());
  });

  it('throws if bookmark not found', () => {
    expect(() => setExpiry(makeStore(), 'zzz', new Date())).toThrow('Bookmark not found');
  });
});

describe('removeExpiry', () => {
  it('removes expiresAt from bookmark', () => {
    const store = makeStore();
    const date = new Date(Date.now() + 86400000 * 5);
    setExpiry(store, 'a1', date);
    removeExpiry(store, 'a1');
    expect(store.bookmarks[0].meta?.expiresAt).toBeUndefined();
  });
});

describe('getExpiry', () => {
  it('returns null when no expiry set', () => {
    const bm = makeStore().bookmarks[0];
    expect(getExpiry(bm)).toBeNull();
  });

  it('returns expiry info with correct daysRemaining', () => {
    const bm = makeStore().bookmarks[0];
    const future = Date.now() + 86400000 * 7;
    bm.meta = { expiresAt: future };
    const info = getExpiry(bm)!;
    expect(info.isExpired).toBe(false);
    expect(info.daysRemaining).toBe(7);
  });

  it('marks as expired when in the past', () => {
    const bm = makeStore().bookmarks[0];
    bm.meta = { expiresAt: Date.now() - 1000 };
    const info = getExpiry(bm)!;
    expect(info.isExpired).toBe(true);
  });
});

describe('listExpiring', () => {
  it('returns bookmarks expiring within given days', () => {
    const store = makeStore();
    setExpiry(store, 'a1', new Date(Date.now() + 86400000 * 5));
    setExpiry(store, 'b2', new Date(Date.now() + 86400000 * 60));
    const result = listExpiring(store, 30);
    expect(result).toHaveLength(1);
    expect(result[0].bookmarkId).toBe('a1');
  });
});

describe('listExpired', () => {
  it('returns only expired bookmarks', () => {
    const store = makeStore();
    setExpiry(store, 'a1', new Date(Date.now() - 1000));
    setExpiry(store, 'b2', new Date(Date.now() + 86400000));
    const result = listExpired(store);
    expect(result).toHaveLength(1);
    expect(result[0].bookmarkId).toBe('a1');
  });
});

describe('purgeExpired', () => {
  it('removes expired bookmarks and returns count', () => {
    const store = makeStore();
    setExpiry(store, 'a1', new Date(Date.now() - 1000));
    const { removed } = purgeExpired(store);
    expect(removed).toBe(1);
    expect(store.bookmarks.find((b) => b.id === 'a1')).toBeUndefined();
  });
});

describe('formatExpiryInfo', () => {
  it('formats expired entry', () => {
    const store = makeStore();
    setExpiry(store, 'a1', new Date(Date.now() - 1000));
    const info = getExpiry(store.bookmarks[0])!;
    expect(formatExpiryInfo(info)).toContain('[EXPIRED');
  });

  it('formats upcoming expiry', () => {
    const store = makeStore();
    setExpiry(store, 'a1', new Date(Date.now() + 86400000 * 3));
    const info = getExpiry(store.bookmarks[0])!;
    expect(formatExpiryInfo(info)).toContain('expires');
    expect(formatExpiryInfo(info)).toContain('3d');
  });
});
