import { BookmarkStore, Bookmark } from './types';

export function setComment(store: BookmarkStore, id: string, comment: string): Bookmark {
  const bm = store.bookmarks.find(b => b.id === id);
  if (!bm) throw new Error(`Bookmark not found: ${id}`);
  (bm as any).comment = comment.trim();
  return bm;
}

export function removeComment(store: BookmarkStore, id: string): Bookmark {
  const bm = store.bookmarks.find(b => b.id === id);
  if (!bm) throw new Error(`Bookmark not found: ${id}`);
  delete (bm as any).comment;
  return bm;
}

export function getComment(bm: Bookmark): string | undefined {
  return (bm as any).comment as string | undefined;
}

export function listWithComments(store: BookmarkStore): Bookmark[] {
  return store.bookmarks.filter(b => typeof (b as any).comment === 'string' && (b as any).comment.length > 0);
}

export function formatComment(bm: Bookmark): string {
  const comment = getComment(bm);
  if (!comment) return `${bm.url}  (no comment)`;
  return `${bm.url}\n  💬 ${comment}`;
}

export function formatCommentList(bookmarks: Bookmark[]): string {
  if (bookmarks.length === 0) return 'No bookmarks with comments.';
  return bookmarks.map(formatComment).join('\n');
}
