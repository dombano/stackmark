import type { Argv } from "yargs";
import * as path from "path";
import { resolveStorePath, loadConfig } from "./config";
import {
  createBackup,
  listBackups,
  restoreBackup,
  pruneBackups,
} from "./cmd-backup";

export function registerBackupCommand(yargs: Argv): Argv {
  return yargs.command(
    "backup <action>",
    "Manage store backups",
    (y) =>
      y
        .positional("action", {
          choices: ["create", "list", "restore", "prune"] as const,
          describe: "Backup action to perform",
        })
        .option("label", {
          type: "string",
          describe: "Label for the backup (used with create)",
        })
        .option("file", {
          type: "string",
          describe: "Backup file path (used with restore)",
        })
        .option("keep", {
          type: "number",
          default: 5,
          describe: "Number of backups to keep (used with prune)",
        }),
    (argv) => {
      const config = loadConfig();
      const storePath = resolveStorePath(config);

      switch (argv.action) {
        case "create": {
          const out = createBackup(storePath, argv.label);
          console.log(`Backup created: ${out}`);
          break;
        }
        case "list": {
          const backups = listBackups(storePath);
          if (backups.length === 0) {
            console.log("No backups found.");
          } else {
            backups.forEach((b) => console.log(path.basename(b)));
          }
          break;
        }
        case "restore": {
          if (!argv.file) {
            console.error("Error: --file is required for restore");
            process.exit(1);
          }
          restoreBackup(argv.file, storePath);
          console.log(`Restored from: ${argv.file}`);
          break;
        }
        case "prune": {
          const deleted = pruneBackups(storePath, argv.keep);
          console.log(`Pruned ${deleted.length} backup(s).`);
          break;
        }
      }
    }
  );
}
