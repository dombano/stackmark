# `stackmark share`

Output a bookmark in a shareable format — useful for pasting into chats, docs, or scripts.

## Usage

```
stackmark share <query> [options]
```

`<query>` can be a bookmark ID, alias, or URL.

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `-f, --format <format>` | Output format: `url`, `markdown`, `text`, `json` | `url` |
| `-s, --store <path>` | Path to a custom store file | system default |

## Formats

### `url`
Outputs only the raw URL.
```
https://example.com
```

### `markdown`
Outputs a Markdown hyperlink with optional tag hashtags.
```
[Example Site](https://example.com) (#web #demo)
```

### `text`
Outputs a human-readable multi-line summary.
```
URL: https://example.com
Title: Example Site
Tags: web, demo
Notes: A demo bookmark
```

### `json`
Outputs a JSON object with `url`, `title`, `tags`, and `notes`.
```json
{
  "url": "https://example.com",
  "title": "Example Site",
  "tags": ["web", "demo"],
  "notes": "A demo bookmark"
}
```

## Examples

```bash
# Copy URL to clipboard
stackmark share myalias | pbcopy

# Get markdown link
stackmark share abc123 --format markdown

# Export as JSON snippet
stackmark share https://example.com --format json
```
