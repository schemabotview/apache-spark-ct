import type { Section } from '../types'

export const theDriver: Section = {
  id: 'the-driver',
  title: 'The driver, and the two ways people kill it',
  scene: 'topology-driver',
  focus: 'kills',
  slide: `## The driver

Your \`main()\` runs here. Every transformation you write builds a plan **in this one process**, on one machine, with one heap.

### What only the driver does
- Builds the plan — logical, then physical
- Cuts it into stages at every shuffle
- Assigns tasks to free slots, preferring slots near the data
- **Collects results** — and this is where it gets dangerous

### One process, no backup
There is no standby driver. **Driver dies → the whole application dies**, executors torn down with it.

### The two ways people kill their own driver
| | |
|---|---|
| \`df.collect()\` | every row from every executor, into one heap |
| A forced \`broadcast()\` | the table is gathered *at the driver* before being sent out |

Both are the same mistake: pulling distributed data into a process that was never sized for it.

> \`df.show(20)\` and \`df.limit(1000).collect()\` are safe. \`df.collect()\` on a billion rows is an outage.`,
  narration:
    "Let's look closer at the driver, because it's the process most likely to ruin your day. Your main method runs here. When you write a chain of transformations — read this, filter that, group by the other — none of that executes. What happens is that a plan gets built up, in memory, in this one process, on one machine, with one JVM heap. The driver then does three things nothing else does. It compiles that plan from a logical form to a physical one. It cuts it into stages, breaking at every shuffle. And it assigns individual tasks to free slots on executors, preferring slots on machines that already hold the relevant data. Then there's a fourth thing it does, and this is the dangerous one: it collects results. Now, the critical architectural fact. There is no standby driver. No failover, no replica. If the driver process dies — out of memory, someone closes a laptop, a node is reclaimed — the entire application dies with it, and every executor gets torn down. That asymmetry is why the driver deserves respect. So here are the two ways people reliably kill their own driver, and they're the same mistake wearing different clothes. The first is calling collect on a large DataFrame. Collect means: take every row, from every executor, send it over the network, and materialise it in the driver's heap. On a billion rows that's not slow, it's fatal. The second is forcing a broadcast join on a table that isn't small — because a broadcast is gathered at the driver first, and only then sent out to the executors. Both are pulling distributed data into a single process that was never sized to hold it. Show and limit are safe. Collect, on anything real, is an outage.",
}
