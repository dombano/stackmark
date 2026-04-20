import type { Command } from "commander";
import { cmdCopy, type CopyField } from "./cmd-copy";

export function registerCopyCommand(program: Command): void {
  program
    .command("copy <query>")
    .description("Copy a bookmark field to the clipboard")
    .option(
      "-f, --field <field>",
      "Field to copy: url | title | all",
      "url"
    )
    .option("--store <path>", "Path to bookmark store file")
    .action(async (query: string, opts: { field?: string; store?: string }) => {
      const validFields: CopyField[] = ["url", "title", "all"];
      const field = opts.field as CopyField;

      if (opts.field && !validFields.includes(field)) {
        console.error(
          `Invalid field "${opts.field}". Choose from: ${validFields.join(", ")}`
        );
        process.exit(1);
      }

      await cmdCopy(query, {
        field,
        storePath: opts.store,
      });
    });
}
