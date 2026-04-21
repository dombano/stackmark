import { describe, it, expect } from 'vitest';
import { setReminder, removeReminder, getDueReminders, listReminders, formatReminder } from './cmd-remind';
import { Store } from './types';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', tags: [], createdAt: new Date().toISOString() },
      { id: 'b2', url: 'https://vitest.dev', title: 'Vitest', tags: ['test'], createdAt: new Date().toISOString() },
    ],
  } as any;
}

describe('setReminder', () => {
  it('adds a reminder to the store', () => {
    const store = makeStore();
    const future = new Date(Date.now() + 60_000);
    const updated = setReminder(store, 'a1', future, 'check this');
    const reminders = (updated as any).reminders;
    expect(reminders).toHaveLength(1);
    expect(reminders[0].bookmarkId).toBe('a1');
    expect(reminders[0].note).toBe('check this');
  });

  it('replaces existing reminder for same bookmark', () => {
    let store = makeStore();
    const d1 = new Date(Date.now() + 1000);
    const d2 = new Date(Date.now() + 9000);
    store = setReminder(store, 'a1', d1);
    store = setReminder(store, 'a1', d2, 'updated');
    expect((store as any).reminders).toHaveLength(1);
    expect((store as any).reminders[0].note).toBe('updated');
  });

  it('throws if bookmark not found', () => {
    const store = makeStore();
    expect(() => setReminder(store, 'missing', new Date())).toThrow('Bookmark not found');
  });
});

describe('removeReminder', () => {
  it('removes an existing reminder', () => {
    let store = makeStore();
    store = setReminder(store, 'a1', new Date());
    store = removeReminder(store, 'a1');
    expect((store as any).reminders).toHaveLength(0);
  });
});

describe('getDueReminders', () => {
  it('returns only past/present reminders', () => {
    let store = makeStore();
    const past = new Date(Date.now() - 1000);
    const future = new Date(Date.now() + 60_000);
    store = setReminder(store, 'a1', past);
    store = setReminder(store, 'b2', future);
    const due = getDueReminders(store);
    expect(due).toHaveLength(1);
    expect(due[0].bookmark.id).toBe('a1');
  });
});

describe('listReminders', () => {
  it('returns all reminders sorted by date', () => {
    let store = makeStore();
    store = setReminder(store, 'b2', new Date(Date.now() + 2000));
    store = setReminder(store, 'a1', new Date(Date.now() + 1000));
    const list = listReminders(store);
    expect(list[0].bookmark.id).toBe('a1');
  });
});

describe('formatReminder', () => {
  it('includes url and note', () => {
    const store = makeStore();
    const bm = store.bookmarks[0];
    const reminder = { bookmarkId: 'a1', remindAt: new Date().toISOString(), note: 'review' };
    const out = formatReminder(bm, reminder);
    expect(out).toContain('https://example.com');
    expect(out).toContain('review');
  });
});
