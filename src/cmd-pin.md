# `pin` Command

Pin or unpin bookmarks so they always appear at the top of listings.

## Usage

```bash
stackmark pin <url>           # Pin a bookmark
stackmark pin --unpin <url>   # Unpin a bookmark
stackmark pin --list          # List all pinned bookmarks
```

## Options

| Flag       | Description                        |
|------------|------------------------------------|
| `--unpin`  | Remove the pin from a bookmark     |
| `--list`   | Show all currently pinned bookmarks|

## Examples

```bash
# Pin a bookmark
stackmark pin https://docs.example.com
# → Pinned: [Example Docs] https://docs.example.com (docs, reference)

# Unpin a bookmark
stackmark pin --unpin https://docs.example.com
# → Unpinned: [Example Docs] https://docs.example.com (docs, reference)

# List pinned bookmarks
stackmark pin --list
# Pinned bookmarks (2):
#   [Example Docs] https://docs.example.com (docs, reference)
#   [GitHub] https://github.com (dev, tools)
```

## Notes

- Pinned bookmarks are stored with a `pinned: true` field in the JSON store.
- The `list` command respects pinned status and sorts pinned items to the top.
- Pinning a bookmark that is already pinned is a no-op.
