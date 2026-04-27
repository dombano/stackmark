import { Command } from 'commander';
import { loadConfig, resolveStorePath } from './config';
import { setExpiry, removeExpiry, listExpiring, listExpired, purgeExpired, formatExpiryInfo } from './cmd-expire';
import fs from 'fs';

function loadStore(storePath: string) {
  if (!fs.existsSync(storePath)) return { bookmarks: [] };
  return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
}

function writeStore(storePath: string, store: object) {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

export function registerExpireCommand(program: Command): void {
  const expire = program.command('expire').description('Manage bookmark expiry dates');

  expire
    .command('set <id> <date>')
    .description('Set expiry date for a bookmark (YYYY-MM-DD)')
    .action((id: string, date: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        console.error('Invalid date format. Use YYYY-MM-DD.');
        process.exit(1);
      }
      setExpiry(store, id, parsed);
      writeStore(storePath, store);
      console.log(`Expiry set to ${date} for bookmark ${id}.`);
    });

  expire
    .command('remove <id>')
    .description('Remove expiry date from a bookmark')
    .action((id: string) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      removeExpiry(store, id);
      writeStore(storePath, store);
      console.log(`Expiry removed from bookmark ${id}.`);
    });

  expire
    .command('list')
    .description('List bookmarks expiring soon')
    .option('-d, --days <n>', 'Days window', '30')
    .action((opts) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const days = parseInt(opts.days, 10);
      const results = listExpiring(store, days);
      if (results.length === 0) {
        console.log(`No bookmarks expiring within ${days} days.`);
        return;
      }
      results.forEach((e) => console.log(formatExpiryInfo(e)));
    });

  expire
    .command('expired')
    .description('List all expired bookmarks')
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const results = listExpired(store);
      if (results.length === 0) { console.log('No expired bookmarks.'); return; }
      results.forEach((e) => console.log(formatExpiryInfo(e)));
    });

  expire
    .command('purge')
    .description('Remove all expired bookmarks from the store')
    .action(() => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);
      const store = loadStore(storePath);
      const { removed } = purgeExpired(store);
      writeStore(storePath, store);
      console.log(`Purged ${removed} expired bookmark(s).`);
    });
}
