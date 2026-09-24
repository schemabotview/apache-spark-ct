import type { Section } from '../types'

export const clusterManagerSection: Section = {
  id: 'the-cluster-manager',
  title: 'Granting resources is not scheduling tasks',
  scene: 'topology-cluster-manager',
  focus: 'split',
  slide: `## Granting resources ≠ scheduling tasks

These sound like one job. They're two, solved by different software, and confusing them causes real mistakes.

| | Says |
|---|---|
| **Cluster manager** | "you may have 8 cores and 32 GB on that box" |
| **Spark driver** | "task 14 goes in slot 3, *now*" |

The cluster manager has **never heard of a task.**

### The four
- **Standalone** — ships with Spark. Simple, single-tenant. Fine for a dedicated cluster.
- **YARN** — the Hadoop estate. Still enormous in on-prem enterprise.
- **Kubernetes** — where new deployments go.
- **Mesos** — **deprecated.** If a tutorial starts here, it's from before 2021.

### Why the separation is worth having
Spark doesn't care which one it's on — the same application runs unchanged. And many applications share one cluster without seeing each other, because the manager is the thing arbitrating between them.`,
  narration:
    "There's a distinction here that sounds pedantic and turns out to matter: granting resources and scheduling tasks are two different jobs, done by two different pieces of software. The cluster manager owns the physical machines. Its job is to say: this application may have eight cores and thirty-two gigabytes of memory on that box over there. That's it. It has never heard of a task. It doesn't know what a stage is. It couldn't tell you what your query does. The Spark driver does the other job. Given the executors the cluster manager granted, it decides that task fourteen goes into slot three on executor two, right now, because that's where the data happens to be. Fine-grained, Spark-aware, and completely invisible to the cluster manager. There are four cluster managers, and you should know which is which. Standalone ships with Spark itself — simple, single-tenant, and perfectly reasonable for a cluster dedicated to one team. YARN comes from Hadoop and is still enormous in on-premises enterprise, so you will meet it. Kubernetes is where essentially all new deployments go, and it's the one to learn if you're choosing today. And Mesos is deprecated — if you find a tutorial that starts with Mesos, it predates 2021, which is a useful signal about the rest of its advice. The payoff of keeping these separate is twofold. Spark doesn't care which manager it's running on, so the same application runs unchanged on all of them. And many applications can share one cluster without seeing each other, because the manager is the thing arbitrating between them.",
}
