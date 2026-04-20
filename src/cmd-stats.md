# `stats` Command

Displays an overview of your bookmark collection.

## Usage

```
stackmark stats
```

## Output

Prints a summary to stdout including:

- **Total bookmarks** — total number of saved bookmarks
- **Tagged / Untagged** — how many have at least one tag vs none
- **Unique tags** — number of distinct tags across all bookmarks
- **Top tags** — up to 5 most-used tags with their bookmark counts
- **Oldest / Newest** — creation dates of the earliest and latest bookmarks

## Example

```
📚 Total bookmarks : 42
🏷️  Tagged          : 38
🔖 Untagged        : 4
🗂️  Unique tags     : 15

Top tags:
  web                  12
  rust                  8
  tools                 6
  reference             5
  typescript            4

📅 Oldest : 2021-04-12
📅 Newest : 2024-11-30
```

## Implementation

- `computeStats(store)` — pure function, takes a `Store` and returns a `StatsResult`
- `formatStats(stats)` — formats a `StatsResult` into a human-readable string
- `cmdStats()` — loads the store from the configured path and prints formatted stats

## Related Commands

- `stackmark tags list` — full list of all tags with counts
- `stackmark search` — search bookmarks with fuzzy matching
