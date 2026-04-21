import { BookmarkStore, Bookmark } from './types';
import { saveStore } from './storage';

export interface BookmarkTemplate {
  id: string;
  name: string;
  tags: string[];
  urlPattern?: string;
  description?: string;
  createdAt: string;
}

export function createTemplate(
  store: BookmarkStore,
  name: string,
  tags: string[],
  urlPattern?: string,
  description?: string
): BookmarkTemplate {
  if (!store.templates) store.templates = [];
  const existing = store.templates.find((t) => t.name === name);
  if (existing) throw new Error(`Template "${name}" already exists`);

  const template: BookmarkTemplate = {
    id: `tpl_${Date.now()}`,
    name,
    tags,
    urlPattern,
    description,
    createdAt: new Date().toISOString(),
  };
  store.templates.push(template);
  return template;
}

export function deleteTemplate(store: BookmarkStore, name: string): boolean {
  if (!store.templates) return false;
  const idx = store.templates.findIndex((t) => t.name === name);
  if (idx === -1) return false;
  store.templates.splice(idx, 1);
  return true;
}

export function listTemplates(store: BookmarkStore): BookmarkTemplate[] {
  return store.templates ?? [];
}

export function applyTemplate(
  store: BookmarkStore,
  templateName: string,
  url: string,
  overrideTags: string[] = []
): Partial<Bookmark> {
  const tpl = (store.templates ?? []).find((t) => t.name === templateName);
  if (!tpl) throw new Error(`Template "${templateName}" not found`);

  const tags = overrideTags.length > 0 ? overrideTags : tpl.tags;
  return { url, tags, notes: tpl.description };
}

export function getTemplate(
  store: BookmarkStore,
  name: string
): BookmarkTemplate | undefined {
  return (store.templates ?? []).find((t) => t.name === name);
}
