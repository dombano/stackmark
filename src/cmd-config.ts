import { loadConfig, saveConfig, StackmarkConfig } from './config';

export function cmdConfigGet(key: keyof StackmarkConfig): void {
  const config = loadConfig();
  if (!(key in config)) {
    console.error(`Unknown config key: ${key}`);
    return;
  }
  console.log(`${key} = ${config[key]}`);
}

export function cmdConfigSet(key: keyof StackmarkConfig, value: string): void {
  const config = loadConfig();
  if (!(key in config)) {
    console.error(`Unknown config key: ${key}`);
    return;
  }
  const typed: Partial<StackmarkConfig> = {};
  if (key === 'maxResults') {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      console.error('maxResults must be a positive integer');
      return;
    }
    typed[key] = num;
  } else {
    (typed as Record<string, string>)[key] = value;
  }
  saveConfig(typed);
  console.log(`Set ${key} = ${value}`);
}

export function cmdConfigList(): void {
  const config = loadConfig();
  for (const [k, v] of Object.entries(config)) {
    console.log(`${k} = ${v}`);
  }
}
