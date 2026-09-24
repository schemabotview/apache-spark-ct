import type { Scene } from '@graphlearning/flow'

// §5 partitioned-write — a CODE card. Three decisions (layout, file count, format) plus the knobs the
// narration names, and it closes on the staleness gap that motivates the speed layer in §6.
export const capWrite: Scene = {
  id: 'cap-write',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'write.py',
      minCols: 76,
      label: [
        '(rollup',
        '    .repartition("day")        # sane file count per day',
        '    .write.mode("overwrite")   # append - ignore - errorIfExists',
        '    .partitionBy("day")        # one folder per day -> readers prune',
        '    .format("delta")           # ACID log + time-travel, over Parquet',
        '    .save("s3://lake/views/revenue"))',
        '',
        '# layout knobs',
        '#   .repartition(n)   full shuffle, exact file count',
        '#   .coalesce(n)      fewer files, NO shuffle (can only reduce)',
        '#   .bucketBy(n, k)   pre-sorted -> later joins skip the shuffle',
        '',
        '# one writer, every sink -- only `format` changes',
        '#   delta - parquet - orc - json - csv - jdbc - kafka',
        '',
        '# the batch view is now perfectly accurate -- and exactly as',
        '# stale as the last nightly run. that gap is the speed layer.',
      ].join('\n'),
    },
  ],
  edges: [],
}
