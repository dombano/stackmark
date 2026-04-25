# cmd-colorize

Assign color labels to bookmarks for quick visual grouping and filtering.

## Usage

```
stackmark color set <id> <color>
stackmark color clear <id>
stackmark color list [--color <color>]
```

## Available Colors

`red`, `green`, `blue`, `yellow`, `magenta`, `cyan`, `white`, `none`

## Commands

### `color set <id> <color>`

Assign a color label to a bookmark by its ID.

```
stackmark color set abc123 red
```

### `color clear <id>`

Remove the color label from a bookmark.

```
stackmark color clear abc123
```

### `color list`

List all bookmarks that have a color assigned. Optionally filter by a specific color.

```
stackmark color list
stackmark color list --color green
```

## Output Example

```
🔴 [red]   https://example.com — Example Site
🟢 [green] https://github.com — GitHub
🟡 [yellow] https://news.ycombinator.com
```

## Notes

- Colors are stored in the bookmark's `meta.color` field.
- Setting color to `none` is equivalent to clearing it.
- Colors are purely cosmetic and do not affect search or sorting.
