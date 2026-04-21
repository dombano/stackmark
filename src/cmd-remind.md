# `stackmark remind` — Bookmark Reminders

Schedule a reminder for any saved bookmark. When a reminder is due, it will appear when running `stackmark remind check`.

## Commands

### Set a reminder

```bash
stackmark remind set <id> --date "2024-12-31" [--note "Review this"]
```

Schedules a reminder for the bookmark with the given `id`. The `--date` flag accepts any date string parseable by JavaScript's `Date` constructor.

**Options:**
- `--date` *(required)* — When to be reminded (ISO string or natural date)
- `--note` — Optional message to show with the reminder

### List all reminders

```bash
stackmark remind list
```

Displays all scheduled reminders sorted by due date.

**Example output:**
```
[12/31/2024, 9:00:00 AM] https://example.com (Example Site) — Review this
[1/5/2025, 3:00:00 PM] https://vitest.dev (Vitest)
```

### Check due reminders

```bash
stackmark remind check
```

Shows all reminders that are currently due (past or present). Useful to run on shell startup.

### Remove a reminder

```bash
stackmark remind remove <id>
```

Cancels the scheduled reminder for the given bookmark `id`.

## Storage

Reminders are stored alongside the bookmark store under the `reminders` key. Each entry contains:
- `bookmarkId` — the target bookmark
- `remindAt` — ISO 8601 timestamp
- `note` — optional message

## Tips

- Add `stackmark remind check` to your shell profile (`.bashrc` / `.zshrc`) to see due reminders on every new terminal session.
- Reminders are not automatically deleted after they fire — use `remind remove` to clean them up.
