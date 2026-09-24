import type { Section } from '../types'

export const closer: Section = {
  id: 'closer',
  title: 'Everything, end to end',
  scene: 'cap-lambda-arch',
  slide: `## Everything, end to end

One pipeline, every concept — assembled and running.

### What we built
- **Batch layer** — read → clean → join → aggregate → partitioned write (accurate)
- **Speed layer** — readStream → enrich → window → write (seconds fresh)
- **Serving** — merge the two into one answer; **deployed** and **tuned** on a cluster

### Every part, exercised
- **The structured API** — DataFrames, two join strategies, Catalyst planning, Tungsten running
- **The runtime** — driver, executors, stages cut at each shuffle, deploy modes
- **The streaming model** — unbounded table, event-time windows, watermarks, exactly-once
- **The practical layer** — sources & pushdown, partitioned writes, submit config, AQE

From a raw event in a lake to a live answer on a dashboard — that’s Spark, end to end.`,
  narration:
    'Let’s pull all the way back and take in the whole thing, lit up at once. On the left, the batch layer: it reads the day from the lake, cleans and deduplicates it, joins in product details and aggregates, and writes a partitioned, accurate view — our source of truth. On the right, the speed layer: it reads the live stream from Kafka, enriches it with a broadcast join, aggregates it in event-time windows under a watermark, and writes a checkpointed, exactly-once real-time view. Below, the serving layer merges the two — accurate history plus the fresh present — into a single answer, and the whole system runs on a cluster, submitted, configured, and tuned in the Spark UI. Now look at what this one project had to touch. The structured API is in every line we wrote — DataFrames, two completely different join strategies over the same table, Catalyst choosing the sort-merge and the broadcast, Tungsten compiling both to run fast. The runtime is in how all of it lands on the cluster — a driver holding the plan, executors running tasks in slots, stages cut at every shuffle, and a deploy mode chosen deliberately so a stream outlives the terminal that started it. The streaming model is the entire right-hand side, from the unbounded input table through event-time windows and watermarks to exactly-once recovery. And the practical layer is here too, because a real pipeline cannot avoid it: columnar sources and pushdown, partitioning and file layout, the submit-line configuration, and adaptive execution re-planning the job while it runs. That is what separates a pipeline from a demo. Not any single one of those ideas, but the fact that all of them have to hold at the same time, over the same data, without contradicting each other — accuracy from one side, latency from the other, one answer out. From a raw event sitting in a lake to a live number on a dashboard. That is Apache Spark, end to end.',
}
