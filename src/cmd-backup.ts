import * as fs from "fs";
import * as path from "path";
import { loadStore, saveStore } from "./storage";
import { resolveStorePath } from "./config";

export function getBackupPath(storePath: string, label?: string): string {
  const dir = path.dirname(storePath);
  const base = path.basename(storePath, ".json");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const suffix = label ? `_${label}` : "";
  return path.join(dir, `${base}.backup${suffix}_${timestamp}.json`);
}

export function createBackup(storePath: string, label?: string): string {
  if (!fs.existsSync(storePath)) {
    throw new Error(`Store file not found: ${storePath}`);
  }
  const backupPath = getBackupPath(storePath, label);
  fs.copyFileSync(storePath, backupPath);
  return backupPath;
}

export function listBackups(storePath: string): string[] {
  const dir = path.dirname(storePath);
  const base = path.basename(storePath, ".json");
  const entries = fs.readdirSync(dir);
  return entries
    .filter((f) => f.startsWith(`${base}.backup`) && f.endsWith(".json"))
    .map((f) => path.join(dir, f))
    .sort();
}

export function restoreBackup(backupPath: string, storePath: string): void {
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }
  fs.copyFileSync(backupPath, storePath);
}

export function pruneBackups(storePath: string, keep: number): string[] {
  const backups = listBackups(storePath);
  const toDelete = backups.slice(0, Math.max(0, backups.length - keep));
  for (const f of toDelete) {
    fs.unlinkSync(f);
  }
  return toDelete;
}
