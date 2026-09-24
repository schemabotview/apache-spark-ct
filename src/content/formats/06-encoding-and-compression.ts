import type { Section } from '../types'

export const encodingCompression: Section = {
  id: 'encoding-and-compression',
  title: 'Encoding and compression are not the same thing',
  scene: 'fmt-encoding',
  focus: 'encodings',
  slide: `## Encoding ≠ compression

Two steps, and the first does more work.

| | |
|---|---|
| **Encoding** | a smarter *representation* — type-aware |
| **Compression** | generic squeezing, applied after |

### The encodings that do the real work
Each exploits a property a **column** has and a row never does:

- **Dictionary** — \`"United States"\` → \`0\`, stored once
- **Run-length** — \`0,0,0,0,0\` → \`(0 × 5)\`
- **Delta** — store differences; timestamps love this

A low-cardinality string column can shrink 50× **before any compressor runs.** Columnar doesn't use a better compressor — it gives one better *input*.

### Then a codec on top
\`snappy\` (default, fast, splittable) · \`zstd\` (smaller, worth testing) · \`gzip\` (slowest to read)`,
  narration:
    "People talk about Parquet compression as one thing. It's two, and the first one does most of the work. Encoding comes first, and it's type-aware — it understands what kind of data it's looking at and picks a smarter representation. Dictionary encoding is the classic: if your country column has two hundred distinct values across a billion rows, store the two hundred strings once in a dictionary and then store a small integer per row. The string United States, which is thirteen bytes, becomes a single number. Run-length encoding: if a column has the same value repeated, store the value and a count instead of the repetitions. Delta encoding: for sorted or near-sorted numbers like timestamps, store the differences between consecutive values, which are tiny, instead of the values, which are large. A low-cardinality string column can shrink by fifty times before any compressor has run. Then compression happens on top, and it's generic — snappy or zstd or gzip, squeezing bytes without understanding them at all. And this is the honest answer to why columnar formats compress so much better than row formats. It's not that they use a better compressor; they use the same compressors. It's that they hand the compressor much better input. All the destination values sitting next to each other are enormously more redundant than a row of a destination, a timestamp, a user id and a price. On codecs: snappy is the default, and the reason is that it's fast to decompress and splittable. Gzip compresses smaller but decompresses slowly, and you decompress far more often than you write. Zstd sits between them and is usually worth testing.",
}
