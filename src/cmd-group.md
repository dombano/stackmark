# `stackmark group` — Manage Bookmark Groups

Groups let you organise bookmarks into named collections beyond tags.

## Subcommands

### Create a group

```bash
stackmark group create --name work
```

### Delete a group

```bash
stackmark group delete --name work
```

### Add a bookmark to a group

```bash
stackmark group add --name work --id <bookmark-id>
```

### Remove a bookmark from a group

```bash
stackmark group remove --name work --id <bookmark-id>
```

### List all groups

```bash
stackmark group list
```

Output:
```
work
personal
reading
```

### Show bookmarks in a group

```bash
stackmark group show --name work
```

### Rename a group

```bash
stackmark group rename --name work --new-name office
```

## Notes

- Group names are case-sensitive.
- A bookmark can belong to multiple groups.
- Deleting a group does **not** delete its bookmarks.
- Group membership is stored alongside bookmarks in the store file.
