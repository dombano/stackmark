import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
  createBackup,
  listBackups,
  restoreBackup,
  pruneBackups,
  getBackupPath,
} from "./cmd-backup";

function makeTempStore(): { storePath: string; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stackmark-backup-"));
  const storePath = path.join(dir, "bookmarks.json");
  fs.writeFileSync(storePath, JSON.stringify({ bookmarks: [] }));
  return { storePath, dir };
}

afterEach(() => {
  jest.restoreAllMocks();
});

test("getBackupPath includes timestamp and optional label", () => {
  const p = getBackupPath("/data/bookmarks.json", "pre-import");
  expect(p).toContain("bookmarks.backup_pre-import_");
  expect(p).toEndWith(".json");
});

test("createBackup copies store to backup path", () => {
  const { storePath } = makeTempStore();
  const backupPath = createBackup(storePath, "test");
  expect(fs.existsSync(backupPath)).toBe(true);
  const content = fs.readFileSync(backupPath, "utf-8");
  expect(JSON.parse(content)).toEqual({ bookmarks: [] });
});

test("createBackup throws if store missing", () => {
  expect(() => createBackup("/nonexistent/store.json")).toThrow(
    "Store file not found"
  );
});

test("listBackups returns sorted backup files", () => {
  const { storePath } = makeTempStore();
  createBackup(storePath, "a");
  createBackup(storePath, "b");
  const backups = listBackups(storePath);
  expect(backups.length).toBe(2);
  expect(backups[0] < backups[1]).toBe(true);
});

test("restoreBackup overwrites store with backup content", () => {
  const { storePath } = makeTempStore();
  const backupPath = createBackup(storePath);
  fs.writeFileSync(storePath, JSON.stringify({ bookmarks: [{ id: "x" }] }));
  restoreBackup(backupPath, storePath);
  const restored = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  expect(restored).toEqual({ bookmarks: [] });
});

test("pruneBackups removes oldest files beyond keep count", () => {
  const { storePath } = makeTempStore();
  createBackup(storePath, "1");
  createBackup(storePath, "2");
  createBackup(storePath, "3");
  const deleted = pruneBackups(storePath, 2);
  expect(deleted.length).toBe(1);
  expect(listBackups(storePath).length).toBe(2);
});

test("pruneBackups keeps all if keep >= count", () => {
  const { storePath } = makeTempStore();
  createBackup(storePath);
  createBackup(storePath);
  const deleted = pruneBackups(storePath, 5);
  expect(deleted.length).toBe(0);
});
