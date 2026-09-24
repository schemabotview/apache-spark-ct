import type { Section } from '../types'

export const computeNotStorage: Section = {
  id: 'compute-not-storage',
  title: 'Spark deliberately owns no storage',
  scene: 'origins-compute-not-storage',
  focus: 'spark',
  slide: `## Spark deliberately owns no storage

The most consequential thing about Spark's design is something it **doesn't** do.

### Hadoop shipped both halves, welded
**HDFS** (storage) and **MapReduce** (compute) were one product. Taking one without the other didn't really work.

### Spark ships only the compute half
It reads and writes anything — \`S3 · HDFS · JDBC · Cassandra · Kafka\` — and owns **nothing** long-term.

### What the omission buys
Storage and compute **scale independently**. Keep a petabyte in object storage for cents; spin up a cluster for twenty minutes; kill it.

**This is why Spark outlived the Hadoop stack it was born inside.** When workloads moved to cloud object storage, Spark just pointed at it. HDFS was the thing being replaced.

### What it costs
No owner means **no guarantees** — no transactions, no schema enforcement, no atomic writes. Exactly the gap table formats later filled.`,
  narration:
    "Here's the design decision I'd argue matters most, and it's about something Spark deliberately doesn't do. Hadoop shipped two halves welded together: HDFS for storage, MapReduce for compute, as one product. They were co-designed and you couldn't sensibly take one without the other. Spark ships only the compute half. It reads from and writes to almost anything — S3, Azure Data Lake, Google Cloud Storage, HDFS, relational databases over JDBC, Cassandra, Kafka, Kinesis — and it owns none of it. There's a deliberate, carefully-shaped hole where a storage system would go. At the time that looked like an omission. It turned out to be the reason Spark is still here. Think about what it buys. Storage and compute scale independently. You can keep a petabyte sitting in object storage for a trivial monthly cost, spin up a big cluster for twenty minutes to run one job, and then destroy the cluster entirely. Under the Hadoop model, storing more data meant buying more machines, and those machines also ran compute whether you needed compute or not. The two were chained together. So when the industry moved to cloud object storage — which is most of what happened to data infrastructure in the 2010s — Spark simply pointed at the new thing and carried on. It didn't need rewriting, because it never assumed HDFS. HDFS, meanwhile, was the thing being replaced. Be honest about the cost, though. Owning no storage means guaranteeing nothing about it. A folder of Parquet files on S3 has no transactions, no schema enforcement, no atomic writes — if a job dies halfway, readers see the wreckage. That gap is precisely what table formats like Delta and Iceberg were later built to fill.",
}
