import type { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import {
  createSnapshot,
  saveSnapshot,
  listSnapshots,
  restoreSnapshot,
  deleteSnapshot,
  formatSnapshot,
} from './cmd-snapshot';
import { readFileSync, writeFileSync } from 'fs';

function loadStore(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeStore(path: string, store: object) {
  writeFileSync(path, JSON.stringify(store, null, 2));
}

export function registerSnapshotCommand(program: Command): void {
  const snap = program.command('snapshot').description('Manage store snapshots');

  snap
    .command('save <label>')
    .description('Save a snapshot of current bookmarks')
    .action((label: string) => {
      const cfg = loadConfig();
      const storePath = resolveStorePath(cfg);
      const store = loadStore(storePath);
      const snapshot = createSnapshot(store, label);
      const updated = saveSnapshot(store, snapshot);
      writeStore(storePath, updated);
      console.log(`Snapshot saved: ${formatSnapshot(snapshot)}`);
    });

  snap
    .command('list')
    .description('List all snapshots')
    .action(() => {
      const cfg = loadConfig();
      const store = loadStore(resolveStorePath(cfg));
      const snaps = listSnapshots(store);
      if (snaps.length === 0) {
        console.log('No snapshots found.');
      } else {
        snaps.forEach(s => console.log(formatSnapshot(s)));
      }
    });

  snap
    .command('restore <id>')
    .description('Restore bookmarks from a snapshot')
    .action((id: string) => {
      const cfg = loadConfig();
      const storePath = resolveStorePath(cfg);
      const store = loadStore(storePath);
      const restored = restoreSnapshot(store, id);
      if (!restored) {
        console.error(`Snapshot "${id}" not found.`);
        process.exit(1);
      }
      writeStore(storePath, restored);
      console.log(`Restored ${restored.bookmarks.length} bookmarks from snapshot "${id}".`);
    });

  snap
    .command('delete <id>')
    .description('Delete a snapshot by id')
    .action((id: string) => {
      const cfg = loadConfig();
      const storePath = resolveStorePath(cfg);
      const store = loadStore(storePath);
      const updated = deleteSnapshot(store, id);
      writeStore(storePath, updated);
      console.log(`Snapshot "${id}" deleted.`);
    });
}
