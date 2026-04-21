# `stackmark watch` — Live Store Monitor

The `watch` command lets you monitor your bookmark store in real time from the terminal.

## Subcommands

### `watch summary`

Print a one-shot summary of the current store state.

```bash
stackmark watch summary
stackmark watch summary --json
```

Output includes:
- Total number of bookmarks
- Number of pinned bookmarks
- Top 5 tags by frequency
- Most recently added bookmark

### `watch live`

Poll the store file and re-print the summary whenever it changes.

```bash
stackmark watch live
stackmark watch live --interval 2000
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `--interval <ms>` | `1000` | Polling interval in milliseconds |

Press **Ctrl+C** to stop watching.

## Example Output

```
Bookmark Store Summary
──────────────────────
Total bookmarks : 42
Pinned          : 5

Top tags:
  tools    (12)
  dev      (9)
  reading  (7)
  news     (5)
  oss      (4)

Latest: "Hacker News"  https://news.ycombinator.com
```

## Notes

- `watch live` uses file-system polling (stat mtime) and does not require OS-level inotify support.
- The `--interval` flag accepts any positive integer value in milliseconds.
