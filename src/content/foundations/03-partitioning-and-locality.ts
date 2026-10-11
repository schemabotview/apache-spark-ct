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
Each machine sends a **partial total** for store 7, not its raw events:

**A** 1,200 + **B** 950 + **C** 1,430 = **3,580** in sales

### The misconception
Not every operation splits like a sum. A **median** or a **distinct count** cannot be combined by adding partial results, so those steps must **move records**.`,
  narration:
    "Once a workload is spread across machines, two ideas carry most of the weight. The first is the partition. The order events are still one logical dataset, but physically they are split into chunks, and each chunk can be processed without looking at any other. Here there are six partitions spread over three machines, so three pieces of work can run at the same moment. The second idea is locality. Distributed storage systems keep the blocks of a large file on many different machines, and the cheapest plan is to run the computation where the data already sits. Shipping a few kilobytes of program to a machine is fast. Shipping hundreds of gigabytes of events to the program is not. So in this picture, each machine sums the sales in the partitions it holds, and only those small partial totals cross the network to be combined. For store seven, machine A found twelve hundred in sales, machine B nine hundred and fifty, and machine C fourteen hundred and thirty, and adding the three gives the full total of three thousand five hundred and eighty. That is the shape to look for. Notice what it depends on, though. Summing is easy to split, because partial sums can simply be added together. Not every operation works that way. You cannot get a median by combining three partial medians, and you cannot add three distinct counts without double counting. When an operation has to bring all the records for one key together onto one machine, records must move between machines, and that movement is a cost the later chapters will learn to measure.",
}
