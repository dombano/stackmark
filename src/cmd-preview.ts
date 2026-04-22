import fetch from "node-fetch";
import { Bookmark } from "./types";

export interface PreviewData {
  title?: string;
  description?: string;
  statusCode?: number;
  reachable: boolean;
  contentType?: string;
}

export async function fetchPreview(url: string, timeoutMs = 5000): Promise<PreviewData> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: "GET", signal: controller.signal });
    clearTimeout(timer);
    const contentType = res.headers.get("content-type") ?? undefined;
    const isHtml = contentType?.includes("text/html");
    let title: string | undefined;
    let description: string | undefined;
    if (isHtml) {
      const body = await res.text();
      const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) title = titleMatch[1].trim();
      const descMatch = body.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      if (descMatch) description = descMatch[1].trim();
    }
    return { reachable: true, statusCode: res.status, contentType, title, description };
  } catch {
    return { reachable: false };
  }
}

export function formatPreview(bookmark: Bookmark, data: PreviewData): string {
  const lines: string[] = [];
  lines.push(`URL:         ${bookmark.url}`);
  lines.push(`Reachable:   ${data.reachable ? "yes" : "no"}`);
  if (data.statusCode !== undefined) lines.push(`Status:      ${data.statusCode}`);
  if (data.contentType) lines.push(`Content-Type: ${data.contentType}`);
  if (data.title) lines.push(`Page Title:  ${data.title}`);
  if (data.description) lines.push(`Description: ${data.description}`);
  if (bookmark.tags.length) lines.push(`Tags:        ${bookmark.tags.join(", ")}`);
  if (bookmark.notes) lines.push(`Notes:       ${bookmark.notes}`);
  return lines.join("\n");
}
