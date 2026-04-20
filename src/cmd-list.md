# `stackmark list`

List saved bookmarks with optional filtering, sorting, and limiting.

## Usage

```
stackmark list [options]
```

## Options

| Flag | Description | Default |
|------|-------------|----------|
| `-t, --tags <tags...>` | Filter by one or more tags | — |
| `-n, --limit <n>` | Show only the first N results | — |
| `--sort <order>` | Sort order: `newest`, `oldest`, `alpha` | `newest` |
| `--plain` | Plain text output (no color/formatting) | `false` |

## Examples

```bash
# List all bookmarks, newest first
stackmark list

# List bookmarks tagged 'typescript'
stackmark list --tags typescript

# List 5 oldest bookmarks
stackmark list --sort oldest --limit 5

# Filter by multiple tags and output plain text
stackmark list --tags rust cli --plain
```

## Output

Each bookmark is displayed with its title, URL, tags, and creation date.
A summary line shows the total count and all unique tags in the result set.

## Notes

- Tag filtering is **inclusive** (all specified tags must be present).
- Use `stackmark search <query>` for fuzzy full-text search.
