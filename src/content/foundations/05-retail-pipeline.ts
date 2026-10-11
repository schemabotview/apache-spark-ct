import type { Section } from '../types'

export const retailPipeline: Section = {
  id: 'retail-pipeline',
  title: "Spark's scope and the retail pipeline",
  scene: 'retail-pipeline',
  slide: `## Spark's scope — and our pipeline

Spark is a **distributed compute engine**: it plans and runs work over data that lives somewhere else.

### What Spark does
- Batch processing with **DataFrames and SQL**
- Incremental processing with **Structured Streaming**
- Reading and writing many **data formats**

### What other systems supply
- Durable **storage** and the cluster's machines
- Table **transactions**, via table formats
- **Scheduling** pipelines to run on time`,
  narration:
    "To finish this chapter, let's be precise about what Spark is, and what it is not. Spark is a distributed compute engine. It takes a description of work, plans it, and runs it across many machines, over data that lives somewhere else. Within that role it covers a lot of ground: batch processing with DataFrames and SQL, incremental processing of arriving data with Structured Streaming, and reading and writing many data formats. Just as important is what it leaves to other systems. Spark does not store your data durably. Object stores, distributed file systems and databases do that. It runs on machines that a cluster manager provides. Transactional guarantees on tables come from table formats layered over storage. And deciding that a pipeline runs every night at two is the job of a scheduler. On the left is the pipeline this course returns to again and again. Order events arrive all day as JSON, alongside reference data for products and stores. The pipeline ingests the events with a declared schema, sets aside the malformed ones, enriches them with the reference data, and summarises daily sales per store, with a streaming view added later. We can now justify distributing a workload like this one. Next, we trace what actually happens inside a small Spark application when it runs.",
}
