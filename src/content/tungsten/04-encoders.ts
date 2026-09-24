import type { Section } from '../types'

export const encoders: Section = {
  id: 'encoders',
  title: 'Encoders: the bridge, and its toll',
  scene: 'tun-encoders',
  focus: 'cost',
  slide: `## Encoders

The translator between a **JVM object** and an **UnsafeRow** — in both directions, as generated code.

\`\`\`
case class Flight(dest: String, cnt: Long)
   ↕  Encoder[Flight]
UnsafeRow  ← what the engine operates on
\`\`\`

For a Scala case class, the encoder is generated at **compile time** from the type. That's why \`Dataset[T]\` needs an implicit \`Encoder[T]\` in scope.

### Which is the real cost of a typed Dataset
| | |
|---|---|
| **DataFrame ops** | never leave the binary form |
| **A typed \`.map { … }\`** | decode → your code → re-encode, **per row** |

A \`Dataset\` gives you compile-time type safety and IDE completion. It costs you a round trip through objects on every typed lambda.

> \`DataFrame\` is \`Dataset[Row]\` — and \`Row\` is the one type whose "encoder" is a no-op, because it's already the binary form.`,
  narration:
    "If the engine works on binary rows, but your Scala code works on objects, something has to translate. That's an encoder. An encoder is generated code that converts a JVM object into an UnsafeRow and back again. For a Scala case class, it's generated at compile time from the type definition, which is why a typed Dataset requires an implicit Encoder in scope — that's the compiler telling you it needs to build the translation before it can proceed. Now here's the part with a real performance consequence, and it explains something that confuses people about Datasets versus DataFrames. When you write pure DataFrame operations — select, filter, groupBy on columns — your data never leaves the binary form. Spark reads bytes, compares bytes, writes bytes. No object is ever constructed. But the moment you write a typed lambda on a Dataset — a map with a function that takes a Flight and returns something — Spark has to decode the binary row into an actual Flight object, hand it to your function, take the result, and re-encode it back into binary. Per row. So a Dataset gives you genuinely valuable things: compile-time type safety, so a misspelled field is a compile error rather than a runtime one, and IDE completion. It costs you a round trip through objects on every typed operation. That's the trade, and it's worth making deliberately rather than by habit. One footnote that ties this together: a DataFrame is just a Dataset of Row. And Row is special, because its encoder is essentially a no-op — a Row already is the binary form. That's why DataFrames are the fast path.",
}
