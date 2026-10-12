import type { Scene } from '@graphlearning/flow'

// §7.1 — the same aggregation as a stream over four arriving files: each micro-batch reads only the
// new rows, while the result stays cumulative and ends equal to a batch query over all the files.
export const incrementalQuery: Scene = {
  id: 'incremental-query',
  title: 'Bounded and unbounded data',
  flow: 'TB',
  nodes: [
    {
      id: 'stream-code',
      kind: 'code',
      filename: 'store_totals_stream.py',
      label: `events = (spark.readStream.schema(SCHEMA)
          .json("events/"))           # unbounded
totals = (events.groupBy("store_id")
          .agg(F.sum("amount").alias("sales")))

(totals.writeStream.outputMode("complete")
       .option("checkpointLocation", "ck/")
       .start())`,
    },
    {
      id: 'incremental-table',
      kind: 'table',
      label: 'Four files arrive, one per micro-batch',
      sub: 'rows read vs result',
      headers: ['batch', 'new rows read', 'store 7', 'store 9', 'store 12'],
      values: [
        ['0', '3', '65', '15', '–'],
        ['1', '3', '90', '75', '80'],
        ['2', '2', '130', '75', '80'],
        ['3', '2', '130', '80', '100'],
        ['batch query', 'all 10', '130', '80', '100'],
      ],
    },
  ],
  edges: [{ source: 'stream-code', target: 'incremental-table' }],
}
