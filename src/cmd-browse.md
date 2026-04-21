# `browse` Command

Browse your bookmarks interactively from the terminal with support for tag filtering, fuzzy search, and pagination.

## Usage

```
stackmark browse [options]
```

## Options

| Option | Description | Default |
|---|---|---|
| `-t, --tag <tag>` | Filter results by tag | — |
| `-q, --query <query>` | Fuzzy search across titles and URLs | — |
| `-p, --page <number>` | Page number to display | `1` |
| `-s, --page-size <number>` | Number of results per page | `10` |

## Examples

### Browse all bookmarks
```
stackmark browse
```

### Browse page 2
```
stackmark browse --page 2
```

### Filter by tag
```
stackmark browse --tag dev
```

### Search with fuzzy query
```
stackmark browse --query "typescript tutorial"
```

### Combine tag filter and search
```
stackmark browse --tag news --query "open source"
```

### Adjust page size
```
stackmark browse --page-size 5 --page 3
```

## Output

Displays a header with the current page, total pages, and total bookmark count, followed by a formatted list of matching bookmarks.

```
Page 1/3 — 25 bookmark(s) total
[1] https://example.com — Example Title [dev, tutorial]
...
```

If no bookmarks match, displays:
```
No bookmarks found.
```
