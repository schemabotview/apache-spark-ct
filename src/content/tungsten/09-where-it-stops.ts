import type { Section } from '../types'

export const whereItStops: Section = {
  id: 'where-it-stops',
  title: 'Where codegen stops',
  scene: 'tun-where-it-stops',
  focus: 'lesson',
  slide: `## Where it stops

Codegen works by **inlining an operator's logic into a loop.** So logic it can't read, it can't inline.

### What breaks the fusion
| | |
|---|---|
| **A Python UDF** | a different process entirely |
| **A Scala UDF** | a black box, even inside the JVM |
| **Very wide rows** | the generated method exceeds the JVM's 64 KB limit |

Each becomes a wall the generated loop stops at, and the stage splits around it.

### Which reframes what a UDF costs
The cost isn't only *running your function*. It's **everything around it that can no longer be fused.**

Drop one UDF into the middle of a clean chain and you don't pay for one operator — you pay for breaking the loop that contained six.

- **Prefer a built-in.** It fuses. Yours doesn't.
- **Or a SQL expression** — still a tree Spark can read and inline.

> That last row is real: wide, generated-column DataFrames can silently fall out of codegen entirely.`,
  narration:
    "Codegen isn't universal, and knowing where it stops changes how you write. The mechanism is inlining: Spark takes an operator's logic and writes it into the body of a generated loop. Which means logic Spark cannot read, it cannot inline. Three things break the fusion. A Python user-defined function, most obviously — that's not even in the JVM, it's a separate process, and rows have to be serialised out to it and back. A Scala or Java UDF is better, since it stays in the JVM, but it's still a black box: Spark has a function reference it can call, not an expression tree it can read and rewrite into a loop body. And a third one that catches people by surprise: very wide rows. The generated method has to fit inside the JVM's sixty-four kilobyte method size limit, and a DataFrame with hundreds of generated columns can produce a method too large to compile, at which point Spark silently falls back to the interpreted path. Now here's the reframing I'd like you to take away. The cost of a UDF is not just the cost of running your function. It's the cost of everything around it that can no longer be fused. Drop one UDF into the middle of a clean chain of six operators, and you don't pay for one operator — you pay for breaking the loop that contained all six, and the rows now have to be materialised on both sides of it. So the advice is stronger than it looks. Prefer a built-in function, because it fuses and yours doesn't. If there's no built-in, a SQL expression is still a tree Spark can read. A UDF is the last resort, not the convenient default.",
}
