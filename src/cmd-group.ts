import { Store, Bookmark } from './types';

export function createGroup(store: Store, name: string): Store {
  const groups = store.groups ?? {};
  if (groups[name]) {
    throw new Error(`Group "${name}" already exists`);
  }
  return { ...store, groups: { ...groups, [name]: [] } };
}

export function deleteGroup(store: Store, name: string): Store {
  const groups = { ...(store.groups ?? {}) };
  if (!groups[name]) {
    throw new Error(`Group "${name}" not found`);
  }
  delete groups[name];
  return { ...store, groups };
}

export function addToGroup(store: Store, name: string, bookmarkId: string): Store {
  const groups = store.groups ?? {};
  if (!groups[name]) {
    throw new Error(`Group "${name}" not found`);
  }
  if (groups[name].includes(bookmarkId)) {
    return store;
  }
  return { ...store, groups: { ...groups, [name]: [...groups[name], bookmarkId] } };
}

export function removeFromGroup(store: Store, name: string, bookmarkId: string): Store {
  const groups = store.groups ?? {};
  if (!groups[name]) {
    throw new Error(`Group "${name}" not found`);
  }
  return {
    ...store,
    groups: { ...groups, [name]: groups[name].filter((id) => id !== bookmarkId) },
  };
}

export function listGroups(store: Store): string[] {
  return Object.keys(store.groups ?? {});
}

export function getGroupBookmarks(store: Store, name: string): Bookmark[] {
  const groups = store.groups ?? {};
  if (!groups[name]) {
    throw new Error(`Group "${name}" not found`);
  }
  const ids = groups[name];
  return store.bookmarks.filter((b) => ids.includes(b.id));
}

export function renameGroup(store: Store, oldName: string, newName: string): Store {
  const groups = { ...(store.groups ?? {}) };
  if (!groups[oldName]) {
    throw new Error(`Group "${oldName}" not found`);
  }
  if (groups[newName]) {
    throw new Error(`Group "${newName}" already exists`);
  }
  groups[newName] = groups[oldName];
  delete groups[oldName];
  return { ...store, groups };
}
