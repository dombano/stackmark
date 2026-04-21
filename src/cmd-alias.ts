import { loadStore, saveStore } from "./storage";
import { resolveStorePath } from "./config";
import type { Bookmark, Store } from "./types";

export function setAlias(store: Store, id: string, alias: string): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark with id "${id}" not found.`);
  const conflict = store.bookmarks.find((b) => b.alias === alias && b.id !== id);
  if (conflict) throw new Error(`Alias "${alias}" is already used by bookmark "${conflict.id}".`);
  const updated = store.bookmarks.map((b) =>
    b.id === id ? { ...b, alias } : b
  );
  return { ...store, bookmarks: updated };
}

export function removeAlias(store: Store, id: string): Store {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark with id "${id}" not found.`);
  const updated = store.bookmarks.map((b) => {
    if (b.id !== id) return b;
    const { alias: _alias, ...rest } = b as Bookmark & { alias?: string };
    return rest as Bookmark;
  });
  return { ...store, bookmarks: updated };
}

export function findByAlias(store: Store, alias: string): Bookmark | undefined {
  return (store.bookmarks as Array<Bookmark & { alias?: string }>).find(
    (b) => b.alias === alias
  );
}

export function listAliases(store: Store): Array<{ id: string; alias: string; url: string }> {
  return (store.bookmarks as Array<Bookmark & { alias?: string }>)
    .filter((b) => b.alias)
    .map((b) => ({ id: b.id, alias: b.alias!, url: b.url }));
}

export async function cmdAlias(args: string[]): Promise<void> {
  const storePath = await resolveStorePath();
  const store = await loadStore(storePath);

  if (args[0] === "list" || args.length === 0) {
    const aliases = listAliases(store);
    if (aliases.length === 0) {
      console.log("No aliases defined.");
    } else {
      aliases.forEach(({ alias, id, url }) =>
        console.log(`${alias.padEnd(20)} -> ${id}  ${url}`)
      );
    }
    return;
  }

  if (args[0] === "remove" && args[1]) {
    const updated = removeAlias(store, args[1]);
    await saveStore(storePath, updated);
    console.log(`Alias removed from bookmark "${args[1]}".`);
    return;
  }

  if (args.length >= 2) {
    const [id, alias] = args;
    const updated = setAlias(store, id, alias);
    await saveStore(storePath, updated);
    console.log(`Alias "${alias}" set for bookmark "${id}".`);
    return;
  }

  console.error("Usage: stackmark alias <id> <alias> | alias remove <id> | alias list");
  process.exit(1);
}
