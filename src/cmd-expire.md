# `stackmark expire` — Bookmark Expiry Management

Assign expiry dates to bookmarks and automatically clean up stale entries.

## Commands

### `stackmark expire set <id> <date>`

Set an expiry date on a bookmark. Date must be in `YYYY-MM-DD` format.

```bash
stackmark expire set abc123 2025-12-31
# Expiry set to 2025-12-31 for bookmark abc123.
```

### `stackmark expire remove <id>`

Remove the expiry date from a bookmark.

```bash
stackmark expire remove abc123
# Expiry removed from bookmark abc123.
```

### `stackmark expire list [--days <n>]`

List bookmarks expiring within the next N days (default: 30).

```bash
stackmark expire list --days 7
# [expires 2025-01-10 (5d)] https://example.com
```

### `stackmark expire expired`

List all bookmarks whose expiry date has already passed.

```bash
stackmark expire expired
# [EXPIRED 2024-11-01] https://old-resource.dev
```

### `stackmark expire purge`

Permanently remove all expired bookmarks from the store.

```bash
stackmark expire purge
# Purged 3 expired bookmark(s).
```

## Notes

- Expiry data is stored in the bookmark's `meta.expiresAt` field as a Unix timestamp.
- Bookmarks without an expiry date are unaffected by `list`, `expired`, and `purge`.
- Use `purge` in scripts or cron jobs to keep your store clean automatically.

## Example Workflow

```bash
# Add a bookmark and set it to expire in 30 days
stackmark add https://temp-resource.io --tags temp
stackmark expire set <id> 2025-02-01

# Review what's coming up
stackmark expire list --days 14

# Clean up
stackmark expire purge
```
