# `stackmark rating` — Star Ratings for Bookmarks

Assign 1–5 star ratings to bookmarks and browse your top-rated links.

## Commands

### `stackmark rating set <id> <stars>`

Set a rating for a bookmark by its ID.

```
stackmark rating set a1b2c3 5
# ★★★★★ (5/5)  [a1b2c3] Awesome Resource
```

**Arguments:**
- `<id>` — Bookmark ID
- `<stars>` — Integer from 1 to 5

---

### `stackmark rating remove <id>`

Remove the rating from a bookmark.

```
stackmark rating remove a1b2c3
# Rating removed from bookmark: a1b2c3
```

---

### `stackmark rating list`

List all rated bookmarks sorted by stars (highest first).

```
stackmark rating list
# ★★★★★ (5/5)  [a1b2c3] Awesome Resource
# ★★★☆☆ (3/5)  [d4e5f6] Decent Docs
#
# Average rating: 4/5
```

**Options:**
- `--min <stars>` — Only show bookmarks with at least this many stars (default: `1`)

```
stackmark rating list --min 4
```

---

## Notes

- Ratings are stored directly on the bookmark object in the store.
- Bookmarks without a rating are excluded from `rating list` output.
- The average shown is across **all** rated bookmarks, not just the filtered list.
