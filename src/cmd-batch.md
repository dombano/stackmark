# cmd-batch

Apply an operation to multiple bookmarks at once by providing a list of IDs.

## Functions

### `applyBatchOperation(store, ids, op)`

Applies a `BatchOperation` to every bookmark whose `id` appears in `ids`.

**Supported operations:**

| `type`       | Extra field  | Description                          |
|--------------|--------------|--------------------------------------|
| `add-tag`    | `tag: string`| Append a tag (no duplicates)         |
| `remove-tag` | `tag: string`| Remove a tag if present              |
| `delete`     | —            | Remove the bookmark from the store   |
| `set-label`  | `label: string` | Set a custom label on the bookmark |

Returns a `BatchResult`:

```ts
interface BatchResult {
  affected: number; // bookmarks successfully modified
  skipped: number;  // ids not found in the store
  ids: string[];    // ids of affected bookmarks
}
```

### `formatBatchResult(result, op)`

Returns a human-readable summary string of the batch operation.

## Example

```ts
import { applyBatchOperation, formatBatchResult } from "./cmd-batch";

const result = applyBatchOperation(store, ["abc", "def"], {
  type: "add-tag",
  tag: "archived",
});

console.log(formatBatchResult(result, { type: "add-tag", tag: "archived" }));
// Batch operation: add tag "archived"
//   Affected : 2
//   Skipped  : 0
//   IDs      : abc, def
```
