# `label` Command

Labels are free-form color-neutral markers you can attach to bookmarks to create flexible organizational layers on top of tags.

## Usage

```
stackmark label add <id> <label>
stackmark label remove <id> <label>
stackmark label list
stackmark label filter <label>
stackmark label rename <old> <new>
```

## Subcommands

### `add`

Attach a label to a bookmark by its ID.

```
stackmark label add a1b2c3 reading
```

Labels are stored in lowercase. Duplicates are silently ignored.

### `remove`

Detach a label from a bookmark.

```
stackmark label remove a1b2c3 reading
```

### `list`

P in use across the store, sorted alphabetically.

```
stackmark label list
# office
# personal
# reading
```

### `filter`

List all bookmarks that carry a specific label.

```
stackmark label filter reading
```

### `rename`

Rename a label everywhere it appears in the store.

```
stackmark label rename reading toread
# Renamed label 'reading' → 'toread' on 3 bookmark(s)
```

## Notes

- Labels are stored on each bookmark under the `labels` array field.
- Labels complement tags: use tags for topics, labels for workflow state (e.g. `toread`, `done`, `shared`).
