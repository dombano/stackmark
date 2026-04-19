import { loadStore, saveStore } from './storage';
import { listAllTags, countByTag, renameTag, removeTag } from './tags';
import { formatTagList } from './format';

export async function cmdTags(args: {
  list?: boolean;
  count?: boolean;
  rename?: [string, string];
  remove?: string;
}): Promise<void> {
  const store = await loadStore();

  if (args.rename) {
    const [oldTag, newTag] = args.rename;
    const updated = renameTag(store, oldTag, newTag);
    await saveStore(updated);
    console.log(`Renamed tag "${oldTag}" to "${newTag}"`);
    return;
  }

  if (args.remove) {
    const updated = removeTag(store, args.remove);
    await saveStore(updated);
    console.log(`Removed tag "${args.remove}" from all bookmarks`);
    return;
  }

  if (args.count) {
    const counts = countByTag(store);
    if (Object.keys(counts).length === 0) {
      console.log('No tags found.');
      return;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    for (const [tag, n] of sorted) {
      console.log(`  ${tag}: ${n}`);
    }
    return;
  }

  // default: list
  const tags = listAllTags(store);
  if (tags.length === 0) {
    console.log('No tags found.');
    return;
  }
  console.log(formatTagList(tags));
}
