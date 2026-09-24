import type { Section } from '../types'

export const theObjectTax: Section = {
  id: 'the-object-tax',
  title: 'The JVM object tax',
  scene: 'tun-object-tax',
  focus: 'gc',
  slide: `## The JVM object tax

\`"abc"\` is three bytes of information. As a Java \`String\` it costs roughly **48**.

| | |
|---|---|
| Object header | ~16 bytes |
| Pointer to the char array | 8 bytes |
| The array, with *its* header | ~16 + padding |
| **Your actual data** | **3 bytes** |

### Multiply by a billion rows
16× overhead, and every value is a **separate object on the heap**.

### The second cost is worse
The garbage collector has to trace live objects. Its work scales with **how many** there are, not how big they are.

A billion tiny objects is close to the worst input a generational GC can be handed — and in bad cases a third of your runtime is pause, not progress.

> Storing data *as objects* is the problem. Tungsten's answer is to stop.`,
  narration:
    "To understand why DataFrames beat hand-written RDD code, start with a cost that's invisible until you measure it. Take the string a-b-c. That's three bytes of information. Stored as a Java String object, it costs roughly forty-eight. Where does that go? About sixteen bytes of object header, which every JVM object carries — a class pointer and a mark word. Eight bytes for a reference to the underlying character array. Then the array itself, which has its own sixteen-byte header, plus padding to align to eight bytes. And somewhere in there, three bytes of actual data. So about a sixteen-fold overhead. Now multiply by a billion rows, and by however many columns each row has. You're spending most of your memory on bookkeeping. But here's the part that actually kills jobs, and it's not the size. It's the garbage collector. The JVM's collector works by tracing live objects — walking references to find out what's still reachable. Its cost scales with the number of objects, not the total bytes. A billion tiny objects is very close to the worst possible input for a generational collector. And when GC becomes the bottleneck, you don't get a gradual slowdown, you get pauses: moments where all your application threads stop entirely while the collector works. In bad cases a third of your runtime is pause rather than progress, and you can see it directly in the GC Time column of the Spark UI. So the diagnosis is: storing your data as JVM objects is the problem. Tungsten's answer is simply to stop doing that.",
}
