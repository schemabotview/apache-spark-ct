import type { Scene } from '@graphlearning/flow'

// §6 partition-count — a CODE card, because the section's content IS the knobs and the difference
// between the three of them. A diagram of "200" would be a box labelled 200. The card is built to
// the house rules for code scenes: every line ≤ 76 columns so the card renders at the same type size
// as the other code card in this course, and long enough (≈24 lines) that the pane is not 80% empty
// against two minutes of narration. It earns its lines by showing the three things the narration
// names but cannot display — the config, the two repartition operators, and the arithmetic that
// turns a data size into a partition count.
export const partitionCount: Scene = {
  id: 'shuffle-partition-count',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'partitions.py',
      minCols: 76,
      label: [
        '# The one number behind every "why 200 tasks?" question.',
        'spark.conf.get("spark.sql.shuffle.partitions")   # -> "200"',
        '',
        '# 200 is a fixed default, not a measurement. It knows nothing',
        '# about your data size, your cluster, or this query.',
        '',
        '#  40 GB shuffled / 200  = 200 MB per task -> spills, slow',
        '#  40 MB shuffled / 200  = 200 KB per task -> all overhead',
        '',
        '# Size it from the data, then round to a multiple of total cores',
        '# so the last wave of tasks does not leave the cluster idle:',
        '#     partitions ~= shuffled_bytes / 128MB, rounded up',
        'spark.conf.set("spark.sql.shuffle.partitions", 320)   # 40 cores',
        '',
        '# The two operators, which are NOT interchangeable:',
        'df.repartition(320, "user_id")  # full shuffle, even sizes,',
        '                                # and colocates by key',
        'df.coalesce(40)                 # no shuffle: merges neighbours',
        '                                # in place, so sizes stay uneven',
        '',
        '# coalesce(1) before a write is the classic trap: it does not',
        '# just merge the output, it drags the WHOLE upstream stage down',
        '# to one task. repartition(1) shuffles, but keeps the parallelism.',
        '',
        '# Spark 3: let it measure instead (on by default since 3.2)',
        'spark.conf.set("spark.sql.adaptive.enabled", True)',
        'spark.conf.set(',
        '    "spark.sql.adaptive.advisoryPartitionSizeInBytes", "64MB")',
      ].join('\n'),
    },
  ],
  edges: [],
}
