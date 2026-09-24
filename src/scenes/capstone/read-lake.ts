import type { Scene } from '@graphlearning/flow'

// §2 read-lake — a CODE card, like the other ten build sections. The section's content IS the reader's
// surface plus what the three prunings do to the scan, so the card is the scene.
//
// House rules for this course's code cards (each is the whole left half of a shot, against 2-3
// minutes of narration): every line <= 76 columns, because the card is drawn at a fixed font and
// scaled by fitView — one long line widens the card and shrinks that scene's type, which is why
// `cap-write` once rendered 59% smaller than `cap-window`. Aim for 14-20 lines: these cards are
// width-bound so height is free up to ~30 lines, and a 3-line card leaves the pane 80% empty.
// Earn the lines three ways — make the snippet self-contained, show the API surface the narration
// names but never displays, and end with what comes OUT.
export const capReadLake: Scene = {
  id: 'cap-read-lake',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'read_lake.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import col',
        '',
        '# one reader, every source -- only `format` changes',
        '#   parquet - orc - avro - json - csv - jdbc - delta',
        'raw = (spark.read',
        '    .format("parquet")',
        '    .option("mergeSchema", "false")',
        '    .load("s3://lake/events/dt=2026-08-04")   # one day\'s partition',
        '    .select("ts", "user_id", "product_id", "amount", "action")',
        '    .where(col("action") == "purchase"))      # pushed into the scan',
        '',
        '# messy sources need more of the reader\'s surface:',
        '#   .schema(events_schema)       skip inference, fail on drift',
        '#   .option("mode", "failFast")  vs permissive / dropMalformed',
        '#   .option("header", True) - .option("multiLine", True)',
        '',
        'raw.explain()   # PushedFilters: [EqualTo(action,purchase)]',
      ].join('\n'),
    },
  ],
  edges: [],
}
