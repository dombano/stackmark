import { BookmarkStore, Bookmark } from "./types";

export type ColorName = "red" | "green" | "blue" | "yellow" | "magenta" | "cyan" | "white" | "none";

const VALID_COLORS: ColorName[] = ["red", "green", "blue", "yellow", "magenta", "cyan", "white", "none"];

export function isValidColor(color: string): color is ColorName {
  return VALID_COLORS.includes(color as ColorName);
}

export function setColor(store: BookmarkStore, id: string, color: ColorName): BookmarkStore {
  const bookmark = store.bookmarks.find((b) => b.id === id);
  if (!bookmark) throw new Error(`Bookmark not found: ${id}`);

  const updated: Bookmark = {
    ...bookmark,
    meta: {
      ...((bookmark as any).meta ?? {}),
      color: color === "none" ? undefined : color,
    },
  };

  return {
    ...store,
    bookmarks: store.bookmarks.map((b) => (b.id === id ? updated : b)),
  };
}

export function getColor(bookmark: Bookmark): ColorName | undefined {
  return (bookmark as any).meta?.color as ColorName | undefined;
}

export function filterByColor(store: BookmarkStore, color: ColorName): Bookmark[] {
  return store.bookmarks.filter((b) => getColor(b) === color);
}

export function clearColor(store: BookmarkStore, id: string): BookmarkStore {
  return setColor(store, id, "none");
}

export function formatColorLabel(color: ColorName): string {
  const icons: Record<ColorName, string> = {
    red: "🔴",
    green: "🟢",
    blue: "🔵",
    yellow: "🟡",
    magenta: "🟣",
    cyan: "🩵",
    white: "⚪",
    none: "  ",
  };
  return icons[color] ?? "  ";
}

export function listColoredBookmarks(store: BookmarkStore): string {
  const colored = store.bookmarks.filter((b) => {
    const c = getColor(b);
    return c !== undefined && c !== "none";
  });

  if (colored.length === 0) return "No colored bookmarks found.";

  return colored
    .map((b) => {
      const color = getColor(b) ?? "none";
      return `${formatColorLabel(color)} [${color}] ${b.url}${ (b as any).title ? " — " + (b as any).title : ""}`;
    })
    .join("\n");
}
