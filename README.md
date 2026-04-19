# stackmark

A CLI tool to save and organize bookmarks with tags and fuzzy search from the terminal.

## Installation

```bash
npm install -g stackmark
```

## Usage

```bash
# Add a bookmark
stackmark add https://example.com --tags docs,typescript --title "Example Docs"

# List all bookmarks
stackmark list

# Search bookmarks with fuzzy search
stackmark search typescript

# Filter by tag
stackmark list --tag docs

# Remove a bookmark
stackmark remove <id>
```

### Example

```bash
$ stackmark add https://typescriptlang.org --tags typescript,docs --title "TypeScript Docs"
✔ Bookmark saved (id: a3f9)

$ stackmark search type
┌──────┬─────────────────────────────┬──────────────────┐
│ ID   │ Title                       │ Tags             │
├──────┼─────────────────────────────┼──────────────────┤
│ a3f9 │ TypeScript Docs             │ typescript, docs  │
└──────┴─────────────────────────────┴──────────────────┘
```

## Data Storage

Bookmarks are stored locally in `~/.stackmark/bookmarks.json`.

## License

MIT