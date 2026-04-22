# `stackmark preview`

Fetch and display a live preview of a saved bookmark's URL directly from the terminal.

## Usage

```
stackmark preview <query> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `query`  | URL, title, alias, or ID of the bookmark to preview |

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--timeout <ms>` | `5000` | HTTP request timeout in milliseconds |
| `--json` | — | Output raw preview data as JSON |

## Output Fields

- **URL** — the stored bookmark URL
- **Reachable** — whether the URL responded successfully
- **Status** — HTTP status code (e.g. 200, 404)
- **Content-Type** — MIME type returned by the server
- **Page Title** — `<title>` tag extracted from HTML responses
- **Description** — `<meta name="description">` content if present
- **Tags** — tags associated with the bookmark
- **Notes** — any saved notes

## Examples

```bash
# Preview a bookmark by title keyword
stackmark preview typescript

# Preview with a longer timeout
stackmark preview github --timeout 10000

# Get raw JSON output
stackmark preview typescript --json
```

## Notes

- Only HTML pages will have title/description extracted.
- If the URL is unreachable (network error or timeout), `Reachable: no` is shown with no status code.
- Use `--json` to pipe preview data into other tools.
