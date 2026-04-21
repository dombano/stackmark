# `stackmark backup` — Manage Store Backups

The `backup` command lets you create, list, restore, and prune backup snapshots of your bookmark store.

## Usage

```
stackmark backup <action> [options]
```

### Actions

| Action    | Description                                 |
|-----------|---------------------------------------------|
| `create`  | Create a new backup of the current store    |
| `list`    | List all existing backup files              |
| `restore` | Restore the store from a specific backup    |
| `prune`   | Delete old backups, keeping the N most recent |

## Options

| Flag       | Type     | Default | Description                                      |
|------------|----------|---------|--------------------------------------------------|
| `--label`  | string   | —       | Optional label appended to the backup filename   |
| `--file`   | string   | —       | Path to backup file (required for `restore`)     |
| `--keep`   | number   | `5`     | Number of backups to keep (used with `prune`)    |

## Examples

```bash
# Create a backup before a bulk import
stackmark backup create --label pre-import

# List all backups
stackmark backup list

# Restore a specific backup
stackmark backup restore --file ~/bookmarks.backup_pre-import_2024-01-15T12-00-00-000Z.json

# Keep only the 3 most recent backups
stackmark backup prune --keep 3
```

## Backup File Naming

Backup files are stored alongside the main store file and follow this pattern:

```
bookmarks.backup[_label]_<ISO-timestamp>.json
```

For example: `bookmarks.backup_pre-import_2024-01-15T12-00-00-000Z.json`
