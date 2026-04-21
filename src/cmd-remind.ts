import { Bookmark, Store } from './types';

export interface Reminder {
  bookmarkId: string;
  remindAt: string; // ISO date string
  note?: string;
}

export function setReminder(
  store: Store,
  id: string,
  remindAt: Date,
  note?: string
): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);

  const reminders: Reminder[] = (store as any).reminders ?? [];
  const filtered = reminders.filter((r) => r.bookmarkId !== id);
  const updated: Reminder = { bookmarkId: id, remindAt: remindAt.toISOString(), note };

  return { ...store, reminders: [...filtered, updated] } as any;
}

export function removeReminder(store: Store, id: string): Store {
  const reminders: Reminder[] = (store as any).reminders ?? [];
  return { ...store, reminders: reminders.filter((r) => r.bookmarkId !== id) } as any;
}

export function getDueReminders(store: Store, now: Date = new Date()): Array<{ bookmark: Bookmark; reminder: Reminder }> {
  const reminders: Reminder[] = (store as any).reminders ?? [];
  return reminders
    .filter((r) => new Date(r.remindAt) <= now)
    .map((r) => {
      const bookmark = store.bookmarks.find((b) => b.id === r.bookmarkId)!;
      return { bookmark, reminder: r };
    })
    .filter((entry) => entry.bookmark != null);
}

export function listReminders(store: Store): Array<{ bookmark: Bookmark; reminder: Reminder }> {
  const reminders: Reminder[] = (store as any).reminders ?? [];
  return reminders
    .map((r) => {
      const bookmark = store.bookmarks.find((b) => b.id === r.bookmarkId)!;
      return { bookmark, reminder: r };
    })
    .filter((entry) => entry.bookmark != null)
    .sort((a, b) => a.reminder.remindAt.localeCompare(b.reminder.remindAt));
}

export function formatReminder(bookmark: Bookmark, reminder: Reminder): string {
  const date = new Date(reminder.remindAt).toLocaleString();
  const note = reminder.note ? ` — ${reminder.note}` : '';
  return `[${date}] ${bookmark.url}${bookmark.title ? ` (${bookmark.title})` : ''}${note}`;
}
