import type { Scene } from '@graphlearning/flow'

// §7.12 — a foreachBatch writer that crashes after writing batch 1 and is restarted: the batch is
// replayed with the same batchId. An append-style writer duplicates it; a writer keyed by batchId
// overwrites it.
export const deliveryGuarantees: Scene = {
  id: 'delivery-guarantees',
  title: 'Replay, sinks and idempotency',
  flow: 'TB',
  nodes: [
    {
      id: 'foreachbatch-code',
      kind: 'code',
      filename: 'foreach_batch.py',
      label: `def write(df, batch_id):
    # at-least-once: append every attempt
    df.write.mode("append").parquet(log)

def write_idempotent(df, batch_id):
    # exactly-once effect: one place per batch
    (df.withColumn("batch_id", F.lit(batch_id))
       .write.mode("overwrite")
       .parquet(f"{out}/batch_id={batch_id}"))`,
    },
    {
      id: 'replay-table',
      kind: 'table',
      label: 'Crash after writing batch 1, then restart',
      sub: '8 distinct orders in three batches',
      headers: ['writer', 'rows in sink', 'distinct'],
      values: [
        ['append each attempt', '11', '8'],
        ['overwrite per batchId', '8', '8'],
      ],
    },
  ],
  edges: [{ source: 'foreachbatch-code', target: 'replay-table' }],
}
