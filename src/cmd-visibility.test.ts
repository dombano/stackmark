import {
  isValidVisibility,
  setVisibility,
  removeVisibility,
  getVisibility,
  filterByVisibility,
  formatVisibilitySummary,
} from "./cmd-visibility";
import { BookmarkStore } from "./types";

function makeStore(): BookmarkStore {
  return {
    bookmarks: [
      { id: "1", url: "https://public.com", title: "Public", tags: [], createdAt: "2024-01-01", visibility: "public" } as any,
      { id: "2", url: "https://private.com", title: "Private", tags: [], createdAt: "2024-01-02", visibility: "private" } as any,
      { id: "3", url: "https://unlisted.com", title: "Unlisted", tags: [], createdAt: "2024-01-03", visibility: "unlisted" } as any,
      { id: "4", url: "https://none.com", title: "No Visibility", tags: [], createdAt: "2024-01-04" },
    ],
  };
}

test("isValidVisibility accepts valid levels", () => {
  expect(isValidVisibility("public")).toBe(true);
  expect(isValidVisibility("private")).toBe(true);
  expect(isValidVisibility("unlisted")).toBe(true);
});

test("isValidVisibility rejects invalid levels", () => {
  expect(isValidVisibility("secret")).toBe(false);
  expect(isValidVisibility("")).toBe(false);
  expect(isValidVisibility("hidden")).toBe(false);
});

test("setVisibility updates bookmark", () => {
  const store = makeStore();
  const bm = setVisibility(store, "https://none.com", "public");
  expect(bm).toBeDefined();
  expect((bm as any).visibility).toBe("public");
});

test("setVisibility returns undefined for missing bookmark", () => {
  const store = makeStore();
  const result = setVisibility(store, "https://missing.com", "public");
  expect(result).toBeUndefined();
});

test("removeVisibility clears the field", () => {
  const store = makeStore();
  const ok = removeVisibility(store, "https://public.com");
  expect(ok).toBe(true);
  expect((store.bookmarks[0] as any).visibility).toBeUndefined();
});

test("removeVisibility returns false for missing bookmark", () => {
  const store = makeStore();
  expect(removeVisibility(store, "https://missing.com")).toBe(false);
});

test("getVisibility returns correct level", () => {
  const store = makeStore();
  expect(getVisibility(store, "https://private.com")).toBe("private");
});

test("getVisibility returns null when not set", () => {
  const store = makeStore();
  expect(getVisibility(store, "https://none.com")).toBeNull();
});

test("getVisibility returns undefined for missing bookmark", () => {
  const store = makeStore();
  expect(getVisibility(store, "https://missing.com")).toBeUndefined();
});

test("filterByVisibility returns matching bookmarks", () => {
  const store = makeStore();
  const results = filterByVisibility(store, "private");
  expect(results).toHaveLength(1);
  expect(results[0].url).toBe("https://private.com");
});

test("filterByVisibility returns empty array when none match", () => {
  const store = makeStore();
  const results = filterByVisibility(store, "unlisted");
  expect(results).toHaveLength(1);
  expect(results[0].url).toBe("https://unlisted.com");
});

test("formatVisibilitySummary counts all levels", () => {
  const store = makeStore();
  const summary = formatVisibilitySummary(store);
  expect(summary).toContain("public:   1");
  expect(summary).toContain("private:  1");
  expect(summary).toContain("unlisted: 1");
  expect(summary).toContain("none:     1");
});
