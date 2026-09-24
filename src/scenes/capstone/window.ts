import type { Scene } from '@graphlearning/flow'

// §8 window — a CODE card. Two calls do the work; the comment block carries what the watermark buys,
// because "it bounds memory on a stream that never ends" is the claim the section rests on.
export const capWindow: Scene = {
  id: 'cap-window',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'window.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import sum, window',
        '',
        'agg = (enriched',
        '    .withWatermark("ts", "10 minutes")   # tolerate this lateness',
        '    .groupBy(window("ts", "5 minutes"), "category")',
        '    .agg(sum("amount").alias("revenue")))',
        '',
        '# bucketed by EVENT time -- when the purchase happened, never',
        '# when it reached Spark. a 10:04 event arriving at 10:09 still',
        '# lands in the 10:00-10:05 window.',
        '',
        '# what the watermark buys:',
        '#   later than 10 min   -> dropped, not silently mis-bucketed',
        '#   watermark past end  -> window final, its STATE EVICTED',
        '#                          (the only thing bounding memory',
        '#                           on a stream that never ends)',
        '',
        '# those running totals live in the state store between triggers',
        '# and are CHECKPOINTED -- a restart resumes mid-window, intact.',
      ].join('\n'),
    },
  ],
  edges: [],
}
