# `stackmark visibility` — Manage Bookmark Visibility

Control the visibility level of your bookmarks. Visibility levels help you organize bookmarks by their intended audience or access scope.

## Visibility Levels

| Level      | Description                                  |
|------------|----------------------------------------------|
| `public`   | Visible to anyone (e.g., when sharing)       |
| `private`  | Only for personal use, hidden from exports   |
| `unlisted` | Accessible via link but not publicly listed  |

## Commands

### `visibility set <url> <level>`

Assign a visibility level to a bookmark.

```bash
stackmark visibility set https://example.com public
stackmark visibility set https://secret.io private
```

### `visibility get <url>`

Display the current visibility level of a bookmark.

```bash
stackmark visibility get https://example.com
# public
```

### `visibility remove <url>`

Remove the visibility setting from a bookmark (resets to default).

```bash
stackmark visibility remove https://example.com
```

### `visibility list <level>`

List all bookmarks with a specific visibility level.

```bash
stackmark visibility list private
stackmark visibility list public
```

## Options

| Flag              | Description                        |
|-------------------|------------------------------------|
| `-s, --store <path>` | Path to a custom store file     |

## Examples

```bash
# Mark a bookmark as private before sharing your store
stackmark visibility set https://internal.corp private

# Review all public bookmarks
stackmark visibility list public

# Check what visibility a specific URL has
stackmark visibility get https://blog.example.com
```

## Notes

- Visibility is stored as metadata on each bookmark.
- Export commands can use visibility to filter which bookmarks are included.
- If no visibility is set, the bookmark is treated as having no visibility constraint.
