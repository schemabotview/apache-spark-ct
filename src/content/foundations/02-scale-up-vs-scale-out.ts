import type { Section } from '../types'

export const scaleUpVsScaleOut: Section = {
  id: 'scale-up-vs-scale-out',
  title: 'Scale up versus scale out',
  scene: 'scale-up-vs-out',
  focus: 'scale-out',
  slide: `## Scale up or scale out

Two ways to add capacity, each with a different **cost**.

### Scale up: a bigger machine
- More cores, memory and disk; the **code stays the same**
- Stops at the **largest machine** you can buy or rent

### Scale out: more machines
- Capacity grows by **adding nodes**
- Pays for **network transfer** and **coordination**

### The arithmetic
At an assumed 2 GB/s per machine, scanning 70 TB takes **~10 hours** on one machine and **~12 minutes** on fifty — before any overhead.`,
  narration:
    "There are two ways to give a workload more capacity. Scaling up means a bigger machine: more cores, more memory, faster disks. Its great virtue is that nothing about the program changes. There is no network in the middle, and no partial failures to reason about. Its limit is a hard ceiling, the largest machine anyone will sell or rent you. Scaling out means adding machines instead, and that has no fixed ceiling. You can keep adding nodes as the data grows. Let's put numbers on it. Assume each machine can read about two gigabytes per second. Scanning the retailer's seventy terabytes of history then takes around thirty five thousand seconds, which is nearly ten hours, on one machine. Spread across fifty machines, the same scan is roughly twelve minutes. But notice the qualifier: before any overhead. Here is the common misconception. Scaling out is not automatically faster. The machines must agree on who reads what, results have to travel over the network, and somebody has to notice and recover when one node fails. For a small job, that coordination can cost more than the work itself. Scale out when the work is large enough to pay for the coordination it brings.",
}
