export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  createdAt: string;
  notes?: string;
}

export interface BookmarkStore {
  bookmarks: Bookmark[];
}

export type ExportFormat = 'json' | 'csv' | 'markdown';

export interface SearchOptions {
  query?: string;
  tags?: string[];
  limit?: number;
}

export interface AddOptions {
  url: string;
  title: string;
  tags?: string[];
  notes?: string;
}
