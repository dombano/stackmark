# `stackmark template` — Bookmark Templates

Templates let you predefine tags and metadata for bookmarks you add frequently,
so you don't have to type the same tags every time.

## Usage

```
stackmark template <action> [options]
```

### Actions

| Action   | Description                                      |
|----------|--------------------------------------------------|
| `create` | Create a new template                            |
| `delete` | Remove a template by name                        |
| `list`   | List all saved templates                         |
| `show`   | Print full details of a template                 |
| `apply`  | Add a bookmark using a template's defaults       |

## Options

| Flag              | Description                              |
|-------------------|------------------------------------------|
| `--name`          | Template name (required for most actions)|
| `--tags`          | Comma-separated default tags             |
| `--url-pattern`   | Optional URL pattern hint (informational)|
| `--description`   | Short description stored with template   |
| `--url`           | URL to bookmark (required for `apply`)   |

## Examples

```bash
# Create a template for work articles
stackmark template create --name work --tags work,article --description "Work-related reading"

# List all templates
stackmark template list

# Apply a template when adding a bookmark
stackmark template apply --name work --url https://example.com/blog

# Apply with tag override
stackmark template apply --name work --url https://example.com/post --tags work,typescript

# Show template details
stackmark template show --name work

# Delete a template
stackmark template delete --name work
```

## Notes

- Template names must be unique.
- Tags provided with `--tags` during `apply` will **override** the template's default tags.
- Templates are stored in the same data file as your bookmarks.
