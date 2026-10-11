import type { Section } from '../types'

export const closuresAndSharedVariables: Section = {
  id: 'closures-and-shared-variables',
  title: 'Closures, broadcast variables and accumulators',
  scene: 'closures-shared-variables',
  focus: 'accumulator-var',
  slide: `## Closures, broadcasts, accumulators

The function you pass to Spark is **serialized** with the variables it uses — its **closure** — and shipped to every task.

### Worked results
- Appending to a driver list in \`foreach\`: \`len(seen)\` is still **0**
- A **broadcast** city lookup: Hull 80.0, Leeds 65.0, York 15.0
- An accumulator in a \`map\`: **6** after one action, **12** after two

### The rules
- Never mutate driver state from a task
- Broadcast read-only lookups: **one copy per executor**
- Accumulators: add in tasks, read on the driver

### The misconception
"An accumulator counts each record once." The 4.0.1 guide guarantees that only for updates **inside actions**.`,
  narration:
    "Every function you hand to Spark has to travel. Before running a task, Spark serializes the function together with the variables it refers to, its closure, and sends that bundle to the executor. Each task works on its own copy. That explains the first result. The code appends every row to a Python list on the driver, from inside foreach, and afterwards the list is still empty. Each task appended to a copy that disappeared when the task finished. On a cluster that is guaranteed. Even locally, PySpark runs your function in separate Python worker processes, so the driver's list never changes. When tasks need shared, read-only data, such as a lookup from store id to city, use a broadcast variable. Spark ships it once per executor instead of once per task, and the lookup turns the store totals into Hull eighty, Leeds sixty five and York fifteen. For counting things across tasks there are accumulators, which tasks can only add to and only the driver can read. But watch the last example. An accumulator is incremented inside a map. Before any action it reads zero. After one count it reads six, which looks right. After a second count it reads twelve, because the map ran again. The Spark four point zero point one guide is explicit: updates are applied exactly once only inside actions. Inside transformations, recomputation and retries can count the same record more than once.",
}
