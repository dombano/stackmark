# `stackmark rename`

Rename an existing bookmark's title by its ID or alias.

## Usage

```
stackmark rename <id> <new title>
```

## Arguments

| Argument   | Description                          |
|------------|--------------------------------------|
| `id`       | Bookmark ID or alias to rename       |
| `new title`| The new title to assign              |

## Options

| Flag          | Description                          |
|---------------|--------------------------------------|
| `-q, --quiet` | Output only the new title on success |

## Examples

```bash
# Rename by ID
stackmark rename abc123 "My Updated Title"
# Renamed: "Old Title" → "My Updated Title"

# Rename using an alias
stackmark rename myalias "Better Name"

# Quiet mode (useful in scripts)
stackmark rename abc123 "Script Title" --quiet
# Script Title
```

## Notes

- The title must not be empty or whitespace-only.
- The `updatedAt` timestamp is refreshed on every rename.
- Aliases are resolved before renaming; the ID stored in the bookmark is unchanged.
