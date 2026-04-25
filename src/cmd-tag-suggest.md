# `tag-suggest` Command

Suggest relevant tags for a bookmark based on its URL, title, and the tags already in your store.

## Usage

```
stackmark tag-suggest <id-or-url> [options]
```

## Arguments

| Argument     | Description                                      |
|--------------|--------------------------------------------------|
| `id-or-url`  | Bookmark ID or a raw URL to get suggestions for  |

## Options

| Flag              | Default | Description                              |
|-------------------|---------|------------------------------------------|
| `-n, --limit <n>` | `5`     | Maximum number of tag suggestions        |
| `--plain`         | false   | Output tags as a space-separated list    |

## Examples

### Suggest tags for an existing bookmark

```
stackmark tag-suggest abc123
```

Output:
```
Bookmark: https://github.com/rust-lang/rust
Suggested tags:
  • programming
  • async
  • open-source
```

### Suggest tags for a raw URL (before adding)

```
stackmark tag-suggest https://crates.io/crates/tokio
```

### Pipe suggestions into `tag add`

```
TAGS=$(stackmark tag-suggest abc123 --plain)
stackmark tag add abc123 $TAGS
```

## How It Works

Suggestions are ranked by:
1. Whether the tag text appears in the URL or title
2. Fuzzy similarity between the tag and words in the URL/title
3. How frequently the tag is used across your bookmarks (popular tags rank higher)

Already-applied tags are excluded from suggestions.
