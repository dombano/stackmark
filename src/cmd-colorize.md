# `stackmark colorize` — Assign Colors to Bookmarks

The `colorize` command lets you assign visual color labels to bookmarks for quick identification and filtering.

## Usage

```
stackmark colorize set <url> <color>
stackmark colorize get <url>
stackmark colorize clear <url>
stackmark colorize filter <color>
stackmark colorize list
```

## Subcommands

### `set <url> <color>`

Assign a color to a bookmark by URL. Colors can be named (e.g. `red`, `blue`, `green`) or hex values (e.g. `#ff0000`).

```bash
stackmark colorize set https://example.com red
```

### `get <url>`

Retrieve the color currently assigned to a bookmark.

```bash
stackmark colorize get https://example.com
# Color: red
```

### `clear <url>`

Remove the color assignment from a bookmark.

```bash
stackmark colorize clear https://example.com
```

### `filter <color>`

List all bookmarks that have been assigned a specific color.

```bash
stackmark colorize filter red
```

### `list`

List all bookmarks that have any color assigned.

```bash
stackmark colorize list
```

## Notes

- Valid color names include: `red`, `green`, `blue`, `yellow`, `orange`, `purple`, `pink`, `cyan`, `white`, `black`.
- Hex color codes in the format `#rrggbb` are also accepted.
- Colors are stored in the bookmark's metadata and do not affect search or export behavior.
- Use `colorize list` to audit all colorized bookmarks at a glance.
