# `stackmark merge` — Merge Bookmarks

Combine two or more bookmarks into one, unifying their tags and notes.

## Usage

```
stackmark merge <targetId> <sourceId...>
```

## Arguments

| Argument    | Description                                      |
|-------------|--------------------------------------------------|
| `targetId`  | The bookmark to keep (merge destination)         |
| `sourceId`  | One or more bookmark IDs to merge into the target|

## Behavior

- The **target** bookmark is updated in place.
- All **source** bookmarks are deleted after the merge.
- **Tags** from all sources are combined and deduplicated.
- **Notes** from all sources are joined with ` | ` as a separator. Empty notes are skipped.
- The `updatedAt` timestamp on the target is refreshed.

## Examples

Merge bookmark `b2` into `a1`:

```
stackmark merge a1 b2
```

Merge multiple bookmarks into one:

```
stackmark merge a1 b2 c3 d4
```

## Output

```
Merged 2 bookmark(s) into a1.
Tags: dev, web, tools, ref
Notes: first note | second note
```

## Notes

- A bookmark cannot be merged into itself.
- All IDs must exist in the store; otherwise an error is thrown.
- Use `stackmark list` to find bookmark IDs before merging.
