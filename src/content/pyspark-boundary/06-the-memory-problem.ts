import type { Section } from '../types'

export const theMemoryProblem: Section = {
  id: 'the-memory-problem',
  title: 'Spark cannot manage memory it handed to Python',
  scene: 'pyb-memory',
  focus: 'fail',
  slide: `## Memory Spark can't manage

Spark sizes, tracks and **spills** the JVM heap. It can do none of those things to a Python process.

| | |
|---|---|
| **The JVM heap** | measured · spills to disk when full |
| **The Python process** | unmeasured · **cannot spill** |

Python's memory is outside every accounting Spark does.

### So the failure arrives from outside Spark
The container exceeds its limit and **the kernel kills it.**

\`\`\`
Container killed. Exit code 137.
\`\`\`

No Java exception. No stack trace. Nothing in the driver log that explains it — because from the JVM's point of view, nothing went wrong. It was shot.

### Budget for it explicitly
- \`spark.executor.memoryOverhead\` — non-heap room in the container
- \`spark.executor.pyspark.memory\` — a cap for the Python workers

> An executor running 5 tasks may run **5 Python processes**, each with its own copy of whatever your function loaded.`,
  narration:
    "There's a second cost that isn't about speed at all, and it produces the most confusing failure in PySpark. Spark is careful about JVM memory. It knows how much execution memory a task has, it tracks usage, and when a task exceeds its budget, it spills to disk and carries on — slower, but alive. That's the whole design. None of that applies to Python. Spark hands rows across a socket to a process it does not manage, does not measure, and cannot control. If your Python function builds a large list, or loads a model, or accumulates state, Spark has no visibility into any of it and no mechanism to spill it. Python just allocates, and keeps allocating. So the failure, when it comes, arrives from outside Spark entirely. The container exceeds its memory limit, and the operating system kills it — on Kubernetes you'll see OOMKilled and exit code one-three-seven. And here's what makes it so hard to debug: there is no Java exception. No stack trace. Nothing in the driver log that explains it. Because from the JVM's perspective nothing went wrong; it was shot from outside. You get an executor that vanished and a job that failed, with no error describing why. The fix is to budget for it explicitly. There's memoryOverhead, which is non-heap room inside the container, and there's a PySpark-specific memory setting that caps the Python workers. And one detail worth knowing: an executor running five tasks concurrently may be running five separate Python processes, each with its own copy of whatever your function loaded. Multiply accordingly.",
}
