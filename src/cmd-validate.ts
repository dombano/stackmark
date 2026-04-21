import { BookmarkStore, Bookmark } from "./types";

export interface ValidationResult {
  id: string;
  url: string;
  issues: string[];
}

export interface ValidationSummary {
  total: number;
  valid: number;
  invalid: number;
  results: ValidationResult[];
}

const URL_REGEX = /^https?:\/\/.+/i;

export function validateUrl(url: string): boolean {
  return URL_REGEX.test(url.trim());
}

export function validateBookmark(bookmark: Bookmark): ValidationResult {
  const issues: string[] = [];

  if (!bookmark.url || bookmark.url.trim() === "") {
    issues.push("URL is empty");
  } else if (!validateUrl(bookmark.url)) {
    issues.push(`URL does not start with http:// or https://: ${bookmark.url}`);
  }

  if (!bookmark.title || bookmark.title.trim() === "") {
    issues.push("Title is empty");
  }

  if (bookmark.tags) {
    const emptyTags = bookmark.tags.filter((t) => t.trim() === "");
    if (emptyTags.length > 0) {
      issues.push(`Contains ${emptyTags.length} empty tag(s)`);
    }
  }

  return { id: bookmark.id, url: bookmark.url ?? "", issues };
}

export function validateStore(store: BookmarkStore): ValidationSummary {
  const results: ValidationResult[] = [];

  for (const bookmark of store.bookmarks) {
    const result = validateBookmark(bookmark);
    if (result.issues.length > 0) {
      results.push(result);
    }
  }

  return {
    total: store.bookmarks.length,
    valid: store.bookmarks.length - results.length,
    invalid: results.length,
    results,
  };
}

export function formatValidationSummary(summary: ValidationSummary): string {
  const lines: string[] = [];
  lines.push(
    `Validated ${summary.total} bookmark(s): ${summary.valid} valid, ${summary.invalid} invalid.`
  );

  if (summary.results.length === 0) {
    lines.push("All bookmarks are valid.");
  } else {
    for (const r of summary.results) {
      lines.push(`\n[${r.id}] ${r.url}`);
      for (const issue of r.issues) {
        lines.push(`  - ${issue}`);
      }
    }
  }

  return lines.join("\n");
}
