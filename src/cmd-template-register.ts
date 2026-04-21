import type { Argv } from 'yargs';
import { loadStore, saveStore } from './storage';
import { resolveStorePath } from './config';
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  applyTemplate,
  getTemplate,
} from './cmd-template';
import { addBookmark } from './storage';
import { normalizeTags } from './tags';

export function registerTemplateCommand(yargs: Argv): Argv {
  return yargs.command(
    'template <action>',
    'Manage bookmark templates',
    (y) =>
      y
        .positional('action', {
          choices: ['create', 'delete', 'list', 'apply', 'show'] as const,
          describe: 'Action to perform',
        })
        .option('name', { type: 'string', describe: 'Template name' })
        .option('tags', { type: 'string', describe: 'Comma-separated tags' })
        .option('url-pattern', { type: 'string', describe: 'URL pattern hint' })
        .option('description', { type: 'string', alias: 'd', describe: 'Template description' })
        .option('url', { type: 'string', describe: 'URL to apply template to' }),
    async (argv) => {
      const storePath = resolveStorePath();
      const store = loadStore(storePath);
      const { action, name, tags, urlPattern, description, url } = argv as any;

      if (action === 'create') {
        if (!name) return console.error('--name is required');
        const parsedTags = normalizeTags((tags ?? '').split(',').filter(Boolean));
        const tpl = createTemplate(store, name, parsedTags, urlPattern, description);
        saveStore(storePath, store);
        console.log(`Template "${tpl.name}" created.`);
      } else if (action === 'delete') {
        if (!name) return console.error('--name is required');
        const ok = deleteTemplate(store, name);
        if (ok) { saveStore(storePath, store); console.log(`Template "${name}" deleted.`); }
        else console.error(`Template "${name}" not found.`);
      } else if (action === 'list') {
        const list = listTemplates(store);
        if (!list.length) return console.log('No templates saved.');
        list.forEach((t) => console.log(`${t.name}  [${t.tags.join(', ')}]${t.description ? '  — ' + t.description : ''}`));
      } else if (action === 'show') {
        if (!name) return console.error('--name is required');
        const tpl = getTemplate(store, name);
        if (!tpl) return console.error(`Template "${name}" not found.`);
        console.log(JSON.stringify(tpl, null, 2));
      } else if (action === 'apply') {
        if (!name) return console.error('--name is required');
        if (!url) return console.error('--url is required');
        const overrideTags = normalizeTags((tags ?? '').split(',').filter(Boolean));
        const partial = applyTemplate(store, name, url, overrideTags);
        addBookmark(store, partial.url!, partial.tags ?? [], partial.notes);
        saveStore(storePath, store);
        console.log(`Bookmark added from template "${name}": ${url}`);
      }
    }
  );
}
