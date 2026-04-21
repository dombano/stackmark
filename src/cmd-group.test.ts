import {
  createGroup,
  deleteGroup,
  addToGroup,
  removeFromGroup,
  listGroups,
  getGroupBookmarks,
  renameGroup,
} from './cmd-group';
import { Store } from './types';

function makeStore(): Store {
  return {
    bookmarks: [
      { id: 'a1', url: 'https://example.com', title: 'Example', tags: [], createdAt: '' },
      { id: 'b2', url: 'https://test.org', title: 'Test', tags: [], createdAt: '' },
    ],
    groups: {},
  };
}

test('createGroup adds a new empty group', () => {
  const store = makeStore();
  const updated = createGroup(store, 'work');
  expect(updated.groups?.['work']).toEqual([]);
});

test('createGroup throws if group already exists', () => {
  const store = { ...makeStore(), groups: { work: [] } };
  expect(() => createGroup(store, 'work')).toThrow('already exists');
});

test('deleteGroup removes an existing group', () => {
  const store = { ...makeStore(), groups: { work: ['a1'] } };
  const updated = deleteGroup(store, 'work');
  expect(updated.groups?.['work']).toBeUndefined();
});

test('deleteGroup throws if group not found', () => {
  expect(() => deleteGroup(makeStore(), 'missing')).toThrow('not found');
});

test('addToGroup adds a bookmark id to a group', () => {
  const store = { ...makeStore(), groups: { work: [] } };
  const updated = addToGroup(store, 'work', 'a1');
  expect(updated.groups?.['work']).toContain('a1');
});

test('addToGroup is idempotent', () => {
  const store = { ...makeStore(), groups: { work: ['a1'] } };
  const updated = addToGroup(store, 'work', 'a1');
  expect(updated.groups?.['work']).toHaveLength(1);
});

test('removeFromGroup removes a bookmark id', () => {
  const store = { ...makeStore(), groups: { work: ['a1', 'b2'] } };
  const updated = removeFromGroup(store, 'work', 'a1');
  expect(updated.groups?.['work']).toEqual(['b2']);
});

test('listGroups returns all group names', () => {
  const store = { ...makeStore(), groups: { work: [], personal: [] } };
  expect(listGroups(store)).toEqual(expect.arrayContaining(['work', 'personal']));
});

test('getGroupBookmarks returns bookmarks in group', () => {
  const store = { ...makeStore(), groups: { work: ['a1'] } };
  const bms = getGroupBookmarks(store, 'work');
  expect(bms).toHaveLength(1);
  expect(bms[0].id).toBe('a1');
});

test('renameGroup renames a group', () => {
  const store = { ...makeStore(), groups: { work: ['a1'] } };
  const updated = renameGroup(store, 'work', 'office');
  expect(updated.groups?.['office']).toEqual(['a1']);
  expect(updated.groups?.['work']).toBeUndefined();
});
