import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export interface StackmarkConfig {
  storePath: string;
  defaultExportFormat: string;
  maxResults: number;
}

const DEFAULT_CONFIG: StackmarkConfig = {
  storePath: path.join(os.homedir(), '.stackmark', 'bookmarks.json'),
  defaultExportFormat: 'json',
  maxResults: 20,
};

export function getConfigPath(): string {
  return path.join(os.homedir(), '.stackmark', 'config.json');
}

export function loadConfig(): StackmarkConfig {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Partial<StackmarkConfig>): void {
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const current = loadConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(configPath, JSON.stringify(updated, null, 2), 'utf-8');
}

export function resolveStorePath(override?: string): string {
  if (override) return path.resolve(override);
  return loadConfig().storePath;
}

/**
 * Resets the config file to default values by deleting the existing config.
 * Returns the default config that is now in effect.
 */
export function resetConfig(): StackmarkConfig {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
  return { ...DEFAULT_CONFIG };
}
