import { fetchPreview, formatPreview, PreviewData } from "./cmd-preview";
import { Bookmark } from "./types";

const makeBookmark = (overrides: Partial<Bookmark> = {}): Bookmark => ({
  id: "bm1",
  url: "https://example.com",
  title: "Example",
  tags: ["test"],
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("formatPreview", () => {
  it("includes url and reachable status", () => {
    const bm = makeBookmark();
    const data: PreviewData = { reachable: true, statusCode: 200 };
    const out = formatPreview(bm, data);
    expect(out).toContain("https://example.com");
    expect(out).toContain("yes");
    expect(out).toContain("200");
  });

  it("shows unreachable when fetch fails", () => {
    const bm = makeBookmark();
    const data: PreviewData = { reachable: false };
    const out = formatPreview(bm, data);
    expect(out).toContain("no");
    expect(out).not.toContain("Status");
  });

  it("includes page title and description when present", () => {
    const bm = makeBookmark();
    const data: PreviewData = {
      reachable: true,
      statusCode: 200,
      title: "My Page",
      description: "A great page",
    };
    const out = formatPreview(bm, data);
    expect(out).toContain("My Page");
    expect(out).toContain("A great page");
  });

  it("includes tags from bookmark", () => {
    const bm = makeBookmark({ tags: ["dev", "ts"] });
    const data: PreviewData = { reachable: true, statusCode: 200 };
    const out = formatPreview(bm, data);
    expect(out).toContain("dev, ts");
  });

  it("includes notes when present", () => {
    const bm = makeBookmark({ notes: "Important resource" });
    const data: PreviewData = { reachable: true };
    const out = formatPreview(bm, data);
    expect(out).toContain("Important resource");
  });
});

describe("fetchPreview", () => {
  it("returns reachable false on network error", async () => {
    const result = await fetchPreview("http://localhost:0/nonexistent", 500);
    expect(result.reachable).toBe(false);
  });
});
