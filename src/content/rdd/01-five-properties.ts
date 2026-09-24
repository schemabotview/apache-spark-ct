import type { Section } from '../types'

export const fiveProperties: Section = {
  id: 'five-properties',
  title: 'An RDD is five properties',
  scene: 'rdd-five-properties',
  focus: 'claim',
  slide: `## An RDD is five properties

Smaller than its reputation. **A description of how to produce data — not the data.**

### Three every RDD must have
| | |
|---|---|
| **A list of partitions** | the pieces it splits into |
| **A compute function** | how to produce *one* partition |
| **Its dependencies** | which parent RDDs it was built from |

### Two that are optional
- **A partitioner** — how keys map to partitions, if it's keyed
- **Preferred locations** — where each partition would rather run

Both are hints to the scheduler. They change *where* work is placed, never *what* it computes.

### That's the entire abstraction
No rows are stored. Nothing is materialised. An RDD holds a **recipe** and a **shape**.

Every famous Spark behaviour — laziness, fault tolerance, the shuffle, data locality — falls out of one of those five.`,
  narration:
    "Resilient Distributed Dataset. The name is intimidating and the idea is small, so let's take it apart. An RDD is five properties. Three are mandatory. First, a list of partitions — the pieces this collection splits into. Second, a compute function that says how to produce one partition, given its parents. Third, a list of dependencies: which parent RDDs this one was built from. Two more are optional. A partitioner, which says how keys map to partitions, and only exists if the data is keyed. And preferred locations, which say where each partition would rather be computed. Both of those are hints to the scheduler — they change where work gets placed, never what it computes. And that is genuinely the whole abstraction. Notice what isn't in the list: the data. An RDD doesn't store rows. Nothing is materialised when you create one. What it holds is a recipe — how to make each piece — and a shape — how many pieces there are. That's why you can define an RDD over a dataset far larger than your cluster's memory, and nothing happens. The reason this list is worth memorising is that every famous Spark behaviour falls out of one of the five. Laziness comes from the compute function not having been called. Fault tolerance comes from dependencies. The shuffle comes from what happens when the partitioner has to change. Data locality comes from preferred locations. For the rest of this course we're going to walk that list, and each one will explain a thing you've probably already run into.",
}
