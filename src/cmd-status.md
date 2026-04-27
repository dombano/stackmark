# `status` Command

Track the read/review status of your bookmarks.

## Statuses

| Value      | Meaning                        |
|------------|--------------------------------|
| `unread`   | Not yet visited                |
| `reading`  | Currently being reviewed       |
| `done`     | Finished reading               |
| `archived` | No longer relevant, kept for reference |

## Usage

```bash
# Set a status
stackmark status set <id> <status>

# Get the current status of a bookmark
stackmark status get <id>

# Remove the status field entirely
stackmark status remove <id>

# List all bookmarks with a given status
stackmark status list <status>

# Show a summary count per status
stackmark status summary
```

## Examples

```bash
# Mark a bookmark as currently being read
stackmark status set abc123 reading

# See all unread bookmarks
stackmark status list unread

# Check how many bookmarks are in each state
stackmark status summary
# unread: 5  reading: 2  done: 14  archived: 3
```

## Notes

- Status is stored as a field on each bookmark in the JSON store.
- Bookmarks without a status field are not included in `list` results but are counted as 0 in `summary`.
- Use `archived` status as a soft-archive distinct from the `archive` command's hard-archive behaviour.
