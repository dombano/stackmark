import {
  createSnapshot,
  saveSnapshot,
  listSnapshots,
  restoreSnapshot,
  deleteSnapshot,
  formatSnapshot,
} from './cmd-snapshot';
import { Store } from './types';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: '1', url: 'https://example.com', title: 'Example', tags: ['web'], createdAt: '2024-01-01T00:00:00.000Z' },
      { id: '2', url: 'https://github.com', title: 'GitHub', tags: ['dev'], createdAt: '2024-01-02T00:00:00.000Z' },
    ],
    snapshots: [],
  };
}

describe('createSnapshot', () => {
  it('creates a snapshot with given label and current bookmarks', () => {
    const store = makeStore();
    const snap = createSnapshot(store, 'my-snap');
    expect(snap.label).toBe('my-snap');
    expect(snap.bookmarks).toHaveLength(2);
    expect(snap.id).toBeTruthy();
    expect(snap.createdAt).toBeTruthy();
  });

  it('deep copies bookmarks', () => {
    const store = makeStore();
    const snap = createSnapshot(store, 'copy-test');
    snap.bookmarks[0].title = 'Modified';
    expect(store.bookmarks[0].title).toBe('Example');
  });
});

describe('saveSnapshot', () => {
  it('appends snapshot to store', () => {
    const store = makeStore();
    const snap = createSnapshot(store, 'v1');
    const updated = saveSnapshot(store, snap);
    expect(updated.snapshots).toHaveLength(1);
    expect(updated.snapshots![0].label).toBe('v1');
  });
});

describe('listSnapshots', () => {
  it('returns empty array when no snapshots', () => {
    expect(listSnapshots(makeStore())).toEqual([]);
  });

  it('returns all snapshots', () => {
    const store = makeStore();
    const snap = createSnapshot(store, 'v1');
    const updated = saveSnapshot(store, snap);
    expect(listSnapshots(updated)).toHaveLength(1);
  });
});

describe('restoreSnapshot', () => {
  it('restores bookmarks from snapshot', () => {
    let store = makeStore();
    const snap = createSnapshot(store, 'before');
    store = saveSnapshot(store, snap);
    store.bookmarks = [];
    const restored = restoreSnapshot(store, snap.id);
    expect(restored).not.toBeNull();
    expect(restored!.bookmarks).toHaveLength(2);
  });

  it('returns null for unknown id', () => {
    expect(restoreSnapshot(makeStore(), 'nope')).toBeNull();
  });
});

describe('deleteSnapshot', () => {
  it('removes snapshot by id', () => {
    let store = makeStore();
    const snap = createSnapshot(store, 'temp');
    store = saveSnapshot(store, snap);
    const updated = deleteSnapshot(store, snap.id);
    expect(updated.snapshots).toHaveLength(0);
  });
});

describe('formatSnapshot', () => {
  it('formats snapshot info', () => {
    const store = makeStore();
    const snap = createSnapshot(store, 'release');
    const out = formatSnapshot(snap);
    expect(out).toContain('release');
    expect(out).toContain('2 bookmarks');
    expect(out).toContain(snap.id);
  });
});
