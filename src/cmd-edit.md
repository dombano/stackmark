# `edit` command

Edit an existing bookmark's URL, title, or tags by its ID.

## Usage

```
stackmark edit <id> [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--url <url>` | Replace the bookmark URL |
| `--title <title>` | Replace the bookmark title |
| `--tags <tags>` | Replace tags (comma-separated) |

## Examples

```bash
# Update the title
stackmark edit abc123 --title "Better Title"

# Update the URL
stackmark edit abc123 --url https://new-url.com

# Update tags
stackmark edit abc123 --tags typescript,tools,cli

# Update multiple fields at once
stackmark edit abc123 --title "My Tool" --tags dev,productivity
```

## Notes

- The `updatedAt` timestamp is automatically set on every edit.
- Tags are normalized (lowercased, trimmed, deduplicated).
- The bookmark `id` is unchanged after editing.
