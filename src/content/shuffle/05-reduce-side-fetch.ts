import type { Section } from '../types'

export const reduceSideFetch: Section = {
  id: 'reduce-side-fetch',
  title: 'Where the memory cliff actually is',
  scene: 'shuffle-reduce-fetch',
  focus: 'spill-r',
  slide: `## Where the memory cliff actually is

The two sides of a shuffle are **not symmetric**, and the asymmetry is the whole problem.

### Compare the input of one task
| | Its input is | So it scales with |
|---|---|---|
| **Map task** | its own one partition | your file layout |
| **Reduce task** | a slice of *every* map task's output | the **width of the stage before it** |

### What a reduce task does
1. **Fetch** its slice from every writer — a few blocks in flight, not all 400
2. Hold what arrives in **execution memory** — shared with every other task on that executor
3. Doesn't fit? **Spill** sorted runs to disk, and read them back to merge
4. Only then: the actual aggregate or join

### The cliff
Not a graceful slowdown — you cross from *in memory* to *writing and re-reading disk*, and the stage goes **10× slower on one more gigabyte**. Watch \`Spill (Memory)\` / \`Spill (Disk)\`: non-zero is the signal.`,
  narration:
    "Now the other side, and this is where jobs actually die. The two halves of a shuffle look symmetric but they aren't, and the asymmetry is the whole problem. Think about what each kind of task has to read. A map task reads its own partition — one chunk of a file, whatever size your data happened to be split into. Predictable. A reduce task reads a slice of every single map task's output. Its input isn't bounded by your file layout at all; it's bounded by how wide the stage before it was. Four hundred map tasks means four hundred inbound streams into one reduce task. So here's what that task does. It starts fetching, a few blocks in flight at a time rather than all four hundred at once, and holds what arrives in execution memory — which it does not have to itself, remember, it's sharing that pool with every other task running on the same executor. As long as everything fits, this is fast. When it doesn't fit, the task spills: it writes sorted runs out to disk and then has to read them back in to merge them. And that's the cliff. It is not a graceful slowdown. You go from working in memory to writing and re-reading disk, and a stage can get ten times slower because one more gigabyte arrived than fitted. This is the single most common way a Spark job goes from fine to unusable without anyone changing the code — the data just grew. And it's visible: the Stages tab has spill in memory and spill on disk columns. If those are non-zero, this is what's happening to you. The fix is the next section.",
}
