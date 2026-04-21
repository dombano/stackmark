# `alias` Command

Manage short aliases for bookmarks so you can reference or open them by a memorable name instead of a generated ID.

## Usage

```
stackmark alias <id> <alias>      Set an alias for a bookmark
stackmark alias remove <id>       Remove the alias from a bookmark
stackmark alias list              List all defined aliases (default)
```

## Examples

```bash
# Assign the alias "gh" to a bookmark
stackmark alias abc123 gh

# Open a bookmark by alias (works with cmd-open)
stackmark open gh

# Remove an alias
stackmark alias remove abc123

# List all aliases
stackmark alias list
```

## Notes

- Aliases must be **unique** across all bookmarks.
- An alias can be any non-empty string (no spaces recommended).
- Aliases are stored as an optional `alias` field on the bookmark object in the JSON store.
- The `open`, `copy`, and `search` commands will resolve aliases transparently.

## Output Format

```
alias                -> id        url
gh                   -> abc123    https://github.com
myblog              -> def456    https://myblog.dev
```
