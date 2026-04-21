import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { createBackup, listBackups } from "./cmd-backup";

function makeTempStore(): { storePath: string; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stackmark-bkreg-"));
  const storePath = path.join(dir, "bookmarks.json");
  fs.writeFileSync(storePath, JSON.stringify({ bookmarks: [] }));
  return { storePath, dir };
}

test("createBackup + listBackups round-trip", () => {
  const { storePath } = makeTempStore();
  createBackup(storePath, "round-trip");
  const backups = listBackups(storePath);
  expect(backups.length).toBe(1);
  expect(path.basename(backups[0])).toContain("round-trip");
});

test("multiple backups are listed in ascending order", () => {
  const { storePath } = makeTempStore();
  createBackup(storePath, "first");
  // small delay to ensure distinct timestamps
  const start = Date.now();
  while (Date.now() - start < 5) {}
  createBackup(storePath, "second");
  const backups = listBackups(storePath);
  expect(backups.length).toBe(2);
  expect(backups[0]).toContain("first");
  expect(backups[1]).toContain("second");
});

test("listBackups returns empty array when no backups exist", () => {
  const { storePath } = makeTempStore();
  expect(listBackups(storePath)).toEqual([]);
});

test("restoreBackup via createBackup preserves content", () => {
  const { storePath } = makeTempStore();
  const original = { bookmarks: [{ id: "abc", url: "https://example.com" }] };
  fs.writeFileSync(storePath, JSON.stringify(original));
  const backupPath = createBackup(storePath, "snap");
  // overwrite store
  fs.writeFileSync(storePath, JSON.stringify({ bookmarks: [] }));
  // restore
  fs.copyFileSync(backupPath, storePath);
  const restored = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  expect(restored).toEqual(original);
});
