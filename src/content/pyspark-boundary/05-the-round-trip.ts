import type { Section } from '../types'

export const theRoundTrip: Section = {
  id: 'the-round-trip',
  title: 'The round trip, per row',
  scene: 'pyb-round-trip',
  focus: 'ratio',
  slide: `## The round trip

What happens to **one row** when a plain Python UDF touches it:

1. **Read in the JVM** — an \`UnsafeRow\`, compact bytes
2. **Serialise** — pickle it into Python's format
3. **Write to a socket** — a real OS pipe, with syscalls
4. **Deserialise** — build a Python object
5. **Your function runs** ← *the only step you wanted*
6. **All of it, backwards** — pickle, socket, unpickle

Then again for the next row. A million times per partition.

### The ratio that explains everything
**Five steps of transport around one step of work.**

And step 5 is usually trivial — an addition, a string method. You're paying for a process boundary to perform a single arithmetic operation, per row.

> Typical cost: **10–100×** slower than the same logic as a built-in. Not a constant factor to shrug at.`,
  narration:
    "Let's trace exactly what happens to one row, because the sequence is the whole explanation. The row starts in the JVM as an UnsafeRow — compact binary, laid out contiguously, the format we want everything to stay in. Step one, it's read. Step two, it's serialised: converted from that binary layout into Python's pickle format, which means allocating and encoding. Step three, it's written to a socket. That's a real operating system pipe, with real system calls. Step four, on the other side, Python deserialises it and constructs an actual Python object — which, if you remember the object-overhead problem, is exactly the expensive representation Spark worked so hard to avoid. Step five, your function runs. Step six, all of that happens again in reverse: the result gets pickled, written back through the socket, read by the JVM, and converted back into a binary row. Now count. Five of those six steps are transport. One is work. And here's what makes it worse: step five is almost always trivial. Add one. Strip a string. Compare to a threshold. You are paying for a full process-boundary crossing, twice, with two serialisations and two deserialisations, in order to perform a single arithmetic operation. Then you do it again for the next row, a million times per partition. The measured cost is typically ten to a hundred times slower than the same logic expressed as a built-in function, depending on how trivial your function is — and the more trivial it is, the worse the ratio, because the overhead is fixed and the work approaches zero.",
}
