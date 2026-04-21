# `stackmark recent` — Show Recently Added Bookmarks

Display the most recently added bookmarks, optionally filtered by tags.

## Usage

```
stackmark recent [options]
```

## Options

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--count <n>` | `-n` | Number of bookmarks to show | `10` |
| `--tags <tags>` | `-t` | Filter by one or more tags (comma-separated) | — |
| `--plain` | `-p` | Plain output (no colors or formatting) | `false` |

## Examples

### Show the 10 most recent bookmarks

```
stackmark recent
```

### Show the 5 most recent bookmarks

```
stackmark recent --count 5
```

### Show recent bookmarks tagged `dev`

```
stackmark recent --tags dev
```

### Combine filters

```
stackmark recent -n 3 -t dev,web
```

## Notes

- Bookmarks are sorted by `createdAt` timestamp in descending order.
- If a bookmark has no `createdAt` value it will appear last.
- Tag filtering is case-insensitive and requires **all** specified tags to match.
