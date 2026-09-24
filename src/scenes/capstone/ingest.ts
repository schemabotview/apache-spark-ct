import type { Scene } from '@graphlearning/flow'

// §6 ingest — a CODE card. The unbounded-input-table idea is the whole prerequisite this course cannot
// assume, so the card states it in the comment block rather than leaving it to the narration alone.
export const capIngest: Scene = {
  id: 'cap-ingest',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'ingest.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import col, from_json',
        '',
        'events = (spark.readStream',
        '    .format("kafka")',
        '    .option("subscribe", "clicks")',
        '    .option("startingOffsets", "latest")     # "earliest" to replay',
        '    .option("maxOffsetsPerTrigger", 500000)  # a backlog cannot swamp',
        '    .load()                                  # raw Kafka rows',
        '    .select(from_json(col("value"), schema).alias("e"))',
        '    .select("e.*"))     # -> ts, user_id, product_id, amount',
        '',
        '# an UNBOUNDED input table: rows append forever, and we get to',
        '# treat it exactly like a static DataFrame.',
        '',
        '# Kafka earns its place twice over:',
        '#   offsets REPLAYABLE   -> rewind on crash, lose nothing',
        '#   topics PARTITIONED   -> the read scales across executors',
        '',
        '# same readStream, other sources: file dir - socket - rate',
      ].join('\n'),
    },
  ],
  edges: [],
}
