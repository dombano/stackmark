# Collections

Collections let you group bookmarks into named sets for easy organization and retrieval.

## Commands

### `stackmark collection create <name> [--description <desc>]`
Create a new collection with an optional description.

```
stackmark collection create work --description "Work-related resources"
```

### `stackmark collection delete <name>`
Delete a collection (bookmarks themselves are not removed).

```
stackmark collection delete work
```

### `stackmark collection add <collection> <bookmarkId>`
Add a bookmark to a collection by its ID.

```
stackmark collection add work abc123
```

### `stackmark collection remove <collection> <bookmarkId>`
Remove a bookmark from a collection.

```
stackmark collection remove work abc123
```

### `stackmark collection list`
List all collections with their bookmark counts.

```
stackmark collection list
# personal — Personal bookmarks (3 bookmarks)
# work — Work-related resources (7 bookmarks)
```

### `stackmark collection show <name>`
Display all bookmarks belonging to a collection.

```
stackmark collection show work
```

## Notes

- A bookmark can belong to multiple collections.
- Deleting a collection does not delete the bookmarks inside it.
- Bookmark IDs can be found using `stackmark list` or `stackmark search`.
