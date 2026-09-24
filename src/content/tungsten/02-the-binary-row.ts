import type { Section } from '../types'

export const theBinaryRow: Section = {
  id: 'the-binary-row',
  title: 'UnsafeRow: one row, one block of bytes',
  scene: 'tun-binary-row',
  focus: 'row',
  slide: `## UnsafeRow

One row, one **contiguous block of bytes**. No object headers, no pointers between fields, nothing inside for the GC to trace.

| Region | Holds |
|---|---|
| **Null bit set** | one bit per field |
| **Fixed-width region** | 8 bytes per field, always |
| **Variable-length tail** | strings and arrays |

### How a variable-length field fits in a fixed 8 bytes
It doesn't store the string. It stores an **offset and a length**, packed into the slot — a pointer into the row's own tail.

So every field is at a **known position**, whatever its type.

### What the layout buys
- **A fraction of the size** — no headers, no padding, no pointers
- **Invisible to the GC** — one object per row, not one per field
- **Field \`n\` without decoding** — read at a computed byte offset

> That last one matters more than it sounds: Spark can compare two rows' join keys without ever turning either into an object.`,
  narration:
    "Tungsten's answer is a format called UnsafeRow, and it's worth understanding because a lot follows from it. A row is stored as one contiguous block of bytes. Not a collection of objects with references between them — one block. The layout has three regions. First a null bit set: one bit per field, saying whether it's null. Then a fixed-width region, with exactly eight bytes per field regardless of type. Then a variable-length tail where strings and arrays actually live. Now, the obvious question: how does a variable-length string fit in a fixed eight-byte slot? It doesn't. The slot doesn't hold the string — it holds an offset and a length, packed together, pointing into the row's own tail. So the slot is fixed-width and the data isn't. Which means every field lives at a position you can compute arithmetically, whatever its type. Three things follow. The size collapses — no headers, no padding, no pointer per field. The garbage collector sees one object per row rather than one per field, so its tracing work drops by a factor of the column count. And you can read field number five by computing an offset and reading bytes, without decoding anything else in the row. That third point does more work than it appears to. When Spark compares two rows' join keys, or sorts by a column, or hashes a key, it operates directly on bytes. It never constructs a Java object for either row. Whole operations happen without materialising anything the GC would care about. That's the shift: your data stops being objects and becomes memory that Spark manages deliberately.",
}
