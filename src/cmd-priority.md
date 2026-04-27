# `stackmark priority`

Assign priority levels to bookmarks to surface what matters most.

## Subcommands

### `priority set <id> <level>`

Set a priority level for a bookmark. Valid levels: `low`, `medium`, `high`.

```bash
stackmark priority set abc123 high
# Priority set to "high" for bookmark abc123.
```

### `priority remove <id>`

Remove the priority from a bookmark.

```bash
stackmark priority remove abc123
# Priority removed from bookmark abc123.
```

### `priority list [level]`

List all bookmarks sorted by priority (high → medium → low → none).
Optionally filter by a specific level.

```bash
stackmark priority list
# [HIGH] My Docs (abc123)
# [MEDIUM] Blog Post (def456)
# [LOW] Reference (ghi789)

stackmark priority list high
# [HIGH] My Docs (abc123)
```

## Priority Levels

| Level    | Description                        |
|----------|------------------------------------|
| `high`   | Must-read / critical resource      |
| `medium` | Important but not urgent           |
| `low`    | Nice to have / low urgency         |

## Notes

- Priority is stored as metadata on each bookmark.
- Bookmarks without a priority appear last in sorted output.
- Use alongside `--tag` filters in search for refined results.
