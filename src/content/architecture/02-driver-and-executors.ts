import type { Section } from '../types'

export const driverAndExecutors: Section = {
  id: 'driver-and-executors',
  title: 'Driver, executors and the cluster manager',
  scene: 'driver-executors',
  focus: 'driver-process',
  slide: `## Driver, executors, cluster manager

One **application** is one driver plus its own executors.

### Who does what
- **Driver:** runs your program, plans the work, **schedules tasks**
- **SparkSession:** the entry point; it holds the **SparkContext**
- **Cluster manager:** **allocates** resources — standalone, YARN or Kubernetes
- **Executors:** processes that **run tasks** and keep cached data

### In \`local[4]\`
Driver and executor share **one JVM**, and the 4 threads are the task slots.

### The misconception
The driver does not process the data. It sends tasks out and receives **only the results you ask for** — so a large \`collect()\` can overwhelm it.`,
  narration:
    "When the application starts, three roles appear. The driver is the process running your program. It holds the Spark session, the entry point you call, and behind it the Spark context, which connects to the cluster. The driver turns your code into a plan, breaks the plan into tasks, and schedules those tasks. The cluster manager is a separate service whose only job is allocating resources. In Spark four that is Spark's own standalone manager, YARN, or Kubernetes. Once resources are granted, Spark starts executors on the worker machines. Executors are processes that run tasks and can keep cached data in memory, and each application gets its own executors for its whole lifetime. They are not shared with other applications, which means two applications can only share data through external storage. In our local four setup, all of this collapses into a single JVM: the driver and one executor live together, and the four threads are the task slots. Now the misconception. Because your code runs in the driver, it is tempting to think the driver processes the data. It does not. The data stays on the executors, and the driver receives only what you ask for: a count, a small sample, or the confirmation that a write finished. That is why calling collect on a large result is dangerous. It pulls every row back into one process.",
}
