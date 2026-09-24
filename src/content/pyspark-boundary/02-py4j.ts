import type { Section } from '../types'

export const py4j: Section = {
  id: 'py4j',
  title: 'Py4J: how the driver talks to the JVM',
  scene: 'pyb-py4j',
  focus: 'scale',
  slide: `## Py4J

The driver is **also** two processes: your Python script, and a JVM beside it holding the real plan.

\`\`\`
your script  ←  Py4J socket  →  driver JVM
\`\`\`

Py4J lets Python hold **handles to Java objects** and call methods on them. When you write \`df.filter(...)\`, the Python \`DataFrame\` is a thin wrapper holding a reference to a Java object, and \`filter\` sends a message asking that object to make a new one.

### Why this costs nothing
**One message per API call you write — not per row.**

A hundred-line PySpark script is a few hundred messages. Even if each took a millisecond, that's under a second, once, for the whole job.

| | |
|---|---|
| Messages | ≈ the lines you wrote |
| Scope | **driver-side only** — Py4J never touches an executor |

> This is the boundary crossing that doesn't matter. The one that does is on the executors.`,
  narration:
    "Let's start with the boundary that doesn't cost you anything, because knowing why it's free makes the expensive one clearer. The driver is also two processes. Your Python script runs in a Python interpreter. Next to it, in the same machine, is a JVM that holds the actual Spark plan. They're connected by something called Py4J, which is a library that lets Python hold handles to Java objects and call methods on them over a socket. So when you write df dot filter, what's actually happening is this. Your Python DataFrame object is a thin wrapper — it holds a reference to a Java object living in that driver JVM. Calling filter sends a small message across the socket saying: take that object, apply this filter, give me back a handle to the result. The Python object you get is another thin wrapper around another Java object. Now, why is this free? Because there's one message per API call you write, not per row of data. You might write a hundred lines of PySpark. That's a few hundred messages, total, for the entire job. Even if each one took a full millisecond, you'd have spent under a second, once, at planning time. Meanwhile your data — billions of rows — never comes anywhere near this. It sits in the executors, in the JVM, untouched by any of this conversation. So Py4J is a driver-side mechanism, it never touches an executor, and it is not the reason anything is slow. Hold that distinction, because the boundary that costs you is a different one, on the executors, and it works completely differently.",
}
