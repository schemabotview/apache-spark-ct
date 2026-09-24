import type { Section } from '../types'

export const threeProcesses: Section = {
  id: 'three-processes',
  title: 'Three kinds of process, one division of labour',
  scene: 'topology-three-processes',
  focus: 'driver',
  slide: `## Three kinds of process

A running Spark application is **three** things, and the division between them is strict.

### Driver — one per application
Your program runs here. It holds the plan, cuts it into stages, and decides which executor runs which task. **It does no data work.**

### Cluster manager — owns the machines
Grants containers. Knows nothing about your query, your stages or your tasks.

### Executors — JVMs that do the work
Run tasks, hold cached partitions, report back. **They decide nothing.**

### The sentence worth keeping
**The driver decides and never works. The executors work and never decide.**

Almost every confusing Spark failure is one of those two processes being asked to do the other's job.`,
  narration:
    "Let's establish what's actually running when a Spark job runs, because almost everything confusing about Spark becomes clearer once you can name the processes. There are three kinds, and the division of labour between them is strict. First, the driver. There's exactly one per application, and it's where your program runs — your main method, your notebook cell, your Python script. The driver holds the plan, cuts it into stages, and decides which executor runs which task. What it does not do is touch your data. It's a coordinator. Second, the cluster manager. This owns the physical machines and hands out resources. And here's the key thing about it: it knows nothing whatsoever about Spark. It doesn't know what a stage is, or a task, or a DataFrame. It knows that some application asked for eight cores and sixteen gigabytes, and it either has those or it doesn't. Third, the executors. These are JVM processes, usually one per worker node, and they're where the work actually happens. They run tasks, hold cached partitions in memory, and report their status back to the driver. What they don't do is decide anything. An executor never chooses what to work on; it's told. So the sentence worth carrying out of this section is: the driver decides and never works, the executors work and never decide. Hold on to that, because a surprising number of Spark problems — out of memory errors, jobs that hang, clusters sitting idle — are one of those two processes being asked to do the other one's job.",
}
