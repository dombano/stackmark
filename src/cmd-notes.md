# `stackmark note` — Bookmark Notes

Attach, view, and remove freeform notes on any bookmark.

## Usage

```
stackmark note set <query> <note>
stackmark note get <query>
stackmark note clear <query>
```

## Subcommands

### `note set <query> <note>`

Attaches a note to the first bookmark matching `<query>` (matched against URL, title, or alias).

```bash
stackmark note set "github.com" "Main repo — check PRs daily"
```

### `note get <query>`

Prints the note for the matched bookmark. Prints `(no note)` if none is set.

```bash
stackmark note get "github.com"
# Main repo — check PRs daily
```

### `note clear <query>`

Removes the note from the matched bookmark.

```bash
stackmark note clear "github.com"
# Note cleared for: https://github.com
```

## Options

| Flag | Description |
|------|-------------|
| `--config <path>` | Use a custom config file path |

## Notes

- Notes are stored inline in the bookmark store alongside tags and metadata.
- Notes are included in `export` output (JSON, CSV, Markdown).
- Notes are **not** used in fuzzy search by default; use `--include-notes` in a future release.
