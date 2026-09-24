import type { Section } from '../types'

export const failureModes: Section = {
  id: 'failure-modes',
  title: 'Executor dies vs driver dies',
  scene: 'topology-failure-modes',
  focus: 'driver-dies',
  slide: `## Executor dies vs driver dies

The asymmetry is the most useful thing in this course.

### An executor dies — survivable by design
1. Its **heartbeat stops**; the driver marks it lost
2. Its tasks are **re-run** elsewhere — lineage records how
3. Its **cached partitions are gone**, and get *recomputed*, not restored

Your job gets slower. It does not fail. At scale, this happens constantly and you never notice.

### The driver dies — the application is over
Nothing else holds the plan. Every executor is torn down. **No failover exists.**

### What that should change about how you build
| | |
|---|---|
| **No work on the driver** | no \`collect()\` of a big result, no heavy single-node compute |
| **Retry at the job level** | the driver can't recover itself — your scheduler restarts it |
| **Make writes idempotent** | a retried job must be safe to run twice |

> Executors are cattle. The driver is not.`,
  narration:
    "Let's finish with what happens when things break, because the asymmetry here is the most useful thing to carry away from this course. When an executor dies — and at any real scale they die constantly, from hardware faults, memory pressure, or spot reclamation — the driver notices its heartbeat has stopped and marks it lost. Any tasks that executor was running get re-run somewhere else. And because lineage records how each partition was computed, Spark knows exactly how to rebuild anything that was lost. The one thing worth flagging is cached data: if that executor was holding cached partitions, they're gone, and they get recomputed rather than restored. There's no replica. So the practical effect is that your job gets slower and carries on. It doesn't fail. This is Spark working as designed, and on a large cluster it's happening in the background of most jobs without anyone noticing. Now the driver. If the driver dies, the application is over. Full stop. Nothing else holds the plan, nothing else knows what's been done and what hasn't, and every executor is torn down with it. There is no failover, no standby, no checkpoint you can resume from at this level. Three things should follow from that when you build. First, don't put work on the driver — no collect of a large result, no heavy single-node computation that happens to be convenient. The driver is a coordinator and the more you ask of it, the more likely it dies. Second, retry at the job level, not inside the application, because the driver can't recover itself; your scheduler has to restart it. And third, that means your writes must be idempotent, because a retried job will run some work twice. Executors are cattle. The driver is not.",
}
