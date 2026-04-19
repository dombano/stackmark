import fs from 'fs';
import { loadStore, saveStore } from './storage';
import { exportStore, ExportFormat } from './export';
import { importFromJson, importFromCsv } from './import';

export function cmdExport(format: ExportFormat, outputPath?: string): void {
  const store = loadStore();
  const content = exportStore(store, format);
  if (outputPath) {
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Exported ${store.bookmarks.length} bookmark(s) to ${outputPath}`);
  } else {
    process.stdout.write(content);
  }
}

export function cmdImport(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const store = loadStore();
  const ext = filePath.split('.').pop()?.toLowerCase();

  let added = 0;
  let skipped = 0;
  let errors: string[] = [];

  if (ext === 'json') {
    ({ added, skipped, errors } = importFromJson(store, raw));
  } else if (ext === 'csv') {
    ({ added, skipped, errors } = importFromCsv(store, raw));
  } else {
    console.error('Unsupported file format. Use .json or .csv');
    process.exit(1);
  }

  if (errors.length > 0) {
    errors.forEach((e) => console.warn('Warning:', e));
  }

  saveStore(store);
  console.log(`Import complete: ${added} added, ${skipped} skipped.`);
}
