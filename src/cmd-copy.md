# `stackmark copy` — Copy Bookmark to Clipboard

Copy a bookmark's URL, title, or full details to the system clipboard.

## Usage

```
stackmark copy <query> [options]
```

## Arguments

| Argument | Description                              |
|----------|------------------------------------------|
| `query`  | Bookmark ID or title/URL substring match |

## Options

| Flag            | Description                                    | Default |
|-----------------|------------------------------------------------|---------|
| `--field <f>`   | Field to copy: `url`, `title`, or `all`        | `url`   |
| `--store <path>`| Path to bookmark store file                    | config  |

## Examples

```bash
# Copy the URL of a bookmark matching "github"
stackmark copy github

# Copy the title instead
stackmark copy github --field title

# Copy full bookmark details (url + title + tags)
stackmark copy github --field all
```

## Notes

- If multiple bookmarks match the query, the best match is selected.
- Uses the system clipboard via the `clipboardy` package.
- Falls back to the URL if a bookmark has no title when `--field title` is used.
