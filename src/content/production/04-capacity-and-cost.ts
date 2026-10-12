import type { Section } from '../types'

export const capacityAndCost: Section = {
  id: 'capacity-and-cost',
  title: 'Plan resources, capacity, and cost',
  scene: 'capacity-plan',
  focus: 'cost-table',
  slide: `## Capacity and cost

**Objective:** turn the workload's numbers into a request and a cost.

### Sizing one executor
- 4 cores, 16 GB heap, plus overhead: **max(384 MB, 10%)** → ≈ **17.6 GB** per container
- Python workers live in that overhead unless \`spark.executor.pyspark.memory\` is set
- 50 executors: **200 slots**, ~880 GB, **8 waves** a day

### Worked: the year backfill
- 70 TB at 2 GB/s per machine: 1 machine ≈ 10 h, 25 ≈ 24 min, 50 ≈ 12 min
- Each is ≈ **10 machine-hours** — ideal scaling costs the same
- Overhead, skew and shuffles make more machines cost **more**, never less

### The misconception
"More executors make it cheaper because it finishes sooner." The **deadline** sets the machine count; cost tracks machine-hours.`,
  narration:
    "Capacity planning turns the workload's numbers into a resource request before the first run. Start with one executor. Four cores and sixteen gigabytes of heap is a common shape. On YARN and Kubernetes, Spark adds memory overhead for everything outside the heap, by default ten percent, with a minimum of three hundred and eighty four megabytes. So each container asks for about seventeen point six gigabytes. Note that PySpark's Python workers live in that overhead unless you set PySpark memory explicitly, which is a common reason Python jobs are killed for exceeding their container. Fifty such executors give two hundred task slots and request about eight hundred and eighty gigabytes. The daily run's sixteen hundred input tasks then take eight waves. Now cost, using the course's fixed numbers. Scanning a year of events, seventy terabytes, at two gigabytes per second per machine, takes about ten hours on one machine, twenty four minutes on twenty five, and twelve minutes on fifty. Multiply machines by hours, and every option costs about ten machine hours. With ideal scaling, adding machines buys time, not savings. In reality, start-up, skewed tasks and shuffles add overhead that grows with the number of machines, so more machines cost somewhat more. The misconception to drop is that more executors are cheaper because the job finishes sooner. The deadline decides how many machines you need. Cost follows machine hours, and the cheapest plan is the smallest cluster that reliably meets the deadline, confirmed by measured runs like those in Chapter 6.",
}
