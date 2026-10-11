import type { Section } from '../types'

export const partitioningAndLocality: Section = {
  id: 'partitioning-and-locality',
  title: 'Partitions and locality',
  scene: 'partitions-locality',
  focus: 'combine-totals',
  slide: `## Partitions and locality

A distributed dataset is split into **partitions**: independent chunks that different machines process at the same time.

### Storage and computation together
- Distributed storage keeps **blocks** of a file on many machines
- Each machine works on the partitions **it already holds**
- Moving code is cheap; **moving data is expensive**

### What crosses the network
- Each machine sends a **small partial total**, not its raw events
- Regrouping records by key means **moving records** — a cost the later chapters measure`,
  narration:
    "Once a workload is spread across machines, two ideas carry most of the weight. The first is the partition. The order events are still one logical dataset, but physically they are split into chunks, and each chunk can be processed without looking at any other. Here there are six partitions spread over three machines, so three pieces of work can run at the same moment. The second idea is locality. Distributed storage systems keep the blocks of a large file on many different machines, and the cheapest plan is to run the computation where the data already sits. Shipping a few kilobytes of program to a machine is fast. Shipping hundreds of gigabytes of events to the program is not. So in this picture, each machine sums the sales in the partitions it holds, and only those small partial totals cross the network to be combined. That is the shape to look for. Notice what it depends on, though. Summing is easy to split, because partial sums can simply be added together. When an operation has to bring all the records for one key together onto one machine, records must move between machines, and that movement is a cost the later chapters will learn to measure.",
}
