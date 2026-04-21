import { execSync } from "child_process";
import { loadStore } from "./storage";
import { resolveStorePath } from "./config";
import { findByAlias } from "./cmd-alias";
import type { Store } from "./types";

export function detectOpener(): string {
  const platform = process.platform;
  if (platform === "darwin") return "open";
  if (platform === "win32") return "start";
  // Linux: prefer xdg-open
  try {
    execSync("which xdg-open", { stdio: "ignore" });
    return "xdg-open";
  } catch {
    // fallback
    return "xdg-open";
  }
}

export function resolveBookmarkTarget(store: Store, query: string) {
  // Try alias first
  const byAlias = findByAlias(store, query);
  if (byAlias) return byAlias;
  // Then by id prefix
  const byId = store.bookmarks.find(
    (b) => b.id === query || b.id.startsWith(query)
  );
  return byId ?? null;
}

export async function cmdOpen(args: string[]): Promise<void> {
  if (!args[0]) {
    console.error("Usage: stackmark open <id|alias>");
    process.exit(1);
  }

  const storePath = await resolveStorePath();
  const store = await loadStore(storePath);
  const query = args[0];

  const bookmark = resolveBookmarkTarget(store, query);
  if (!bookmark) {
    console.error(`No bookmark found for "${query}".`);
    process.exit(1);
  }

  const opener = detectOpener();
  try {
    execSync(`${opener} "${bookmark.url}"`, { stdio: "ignore" });
    console.log(`Opened: ${bookmark.url}`);
  } catch (err) {
    console.error(`Failed to open URL: ${bookmark.url}`);
    process.exit(1);
  }
}
