import type { Section } from '../types'

export const localModeSection: Section = {
  id: 'local-mode',
  title: 'Local mode is not a toy',
  scene: 'topology-local-mode',
  focus: 'differs',
  slide: `## Local mode is not a toy

\`local[4]\` runs the **same three roles inside one JVM**: the driver and the executors are threads in the same process, and the cluster manager is skipped entirely.

\`local[*]\` uses every core you have. \`local[4]\` gives you four task slots.

### What is genuinely the same
- The **same optimizer** — identical plans, identical \`explain()\` output
- **Real shuffles**, to real local disk, with real spilling
- The same API, the same failure semantics inside a task

That's why local mode is a real test: the code path is the code path.

### What it can never show you
| | |
|---|---|
| **Network cost** | a shuffle here is a memory copy. It is free. |
| **Skew** | 4 slots hide what 400 make obvious |
| **Node failure** | there are no other nodes to lose |
| **Data locality** | everything is local, always |

> Develop here. **Never conclude *"it's fast"* here** — the one thing you're measuring is the one thing that doesn't exist on a cluster.`,
  narration:
    "Local mode deserves better than its reputation. When you run Spark with master set to local, bracket four, you get the same three roles running inside a single JVM on your laptop: the driver and the executors are threads in the same process, and the cluster manager is skipped entirely because there's nothing to allocate. Local star gives you a slot per core on your machine; local four gives you exactly four. What surprises people is how much of it is real. It's the same optimizer, producing genuinely identical plans — the output of explain on your laptop matches what you'd see on a thousand-node cluster. Shuffles are real: data is partitioned, written to your local disk, read back, and it spills when it doesn't fit. The API is identical and the failure semantics inside a task are identical. That's why local mode is a legitimate place to develop and to test: the code path is the code path, not a simulation of it. But be equally clear about what it can never show you, because this is where people get hurt. Network cost, first and foremost. On a cluster, a shuffle crosses the wire. Locally it's a memory copy between threads — it is essentially free. So a job that's shuffle-bound on a cluster looks perfectly healthy on your laptop. Skew, second: four slots hide an imbalance that four hundred make glaring. Node failure, third: there are no other nodes to lose. And data locality is meaningless, because everything is local. So develop here by all means. Just never conclude that something is fast here, because the single thing you're measuring is the single thing that doesn't exist on a real cluster.",
}
