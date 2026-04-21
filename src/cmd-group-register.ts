import type { Argv } from 'yargs';
import { loadStore, saveStore } from './storage';
import {
  createGroup,
  deleteGroup,
  addToGroup,
  removeFromGroup,
  listGroups,
  getGroupBookmarks,
  renameGroup,
} from './cmd-group';
import { formatBookmarkList } from './format';

export function registerGroupCommand(yargs: Argv): Argv {
  return yargs.command(
    'group <action>',
    'Manage bookmark groups',
    (y) =>
      y
        .positional('action', {
          describe: 'Action: create | delete | add | remove | list | show | rename',
          type: 'string',
        })
        .option('name', { alias: 'n', type: 'string', describe: 'Group name' })
        .option('id', { type: 'string', describe: 'Bookmark ID' })
        .option('new-name', { type: 'string', describe: 'New group name for rename' }),
    async (argv) => {
      const store = await loadStore();
      const { action, name, id } = argv as { action: string; name?: string; id?: string };

      switch (action) {
        case 'create':
          if (!name) throw new Error('--name required');
          await saveStore(createGroup(store, name));
          console.log(`Group "${name}" created.`);
          break;
        case 'delete':
          if (!name) throw new Error('--name required');
          await saveStore(deleteGroup(store, name));
          console.log(`Group "${name}" deleted.`);
          break;
        case 'add':
          if (!name || !id) throw new Error('--name and --id required');
          await saveStore(addToGroup(store, name, id));
          console.log(`Bookmark ${id} added to group "${name}".`);
          break;
        case 'remove':
          if (!name || !id) throw new Error('--name and --id required');
          await saveStore(removeFromGroup(store, name, id));
          console.log(`Bookmark ${id} removed from group "${name}".`);
          break;
        case 'list':
          listGroups(store).forEach((g) => console.log(g));
          break;
        case 'show':
          if (!name) throw new Error('--name required');
          console.log(formatBookmarkList(getGroupBookmarks(store, name)));
          break;
        case 'rename': {
          const newName = (argv as Record<string, unknown>)['new-name'] as string | undefined;
          if (!name || !newName) throw new Error('--name and --new-name required');
          await saveStore(renameGroup(store, name, newName));
          console.log(`Group "${name}" renamed to "${newName}".`);
          break;
        }
        default:
          console.error(`Unknown action: ${action}`);
      }
    }
  );
}
