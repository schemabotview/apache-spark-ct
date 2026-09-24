import type { Scene } from '@graphlearning/flow'

// §12 tune — a CODE card. It opens on the Spark UI rather than on a config, because the section's whole
// argument is that you read first and change second. The three AQE flags are the ones worth setting by
// hand; all three default to true from Spark 3.2 on, so the card shows them as what to CHECK.
export const capTune: Scene = {
  id: 'cap-tune',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'tune.py',
      minCols: 76,
      label: [
        '# always start here: Spark UI -> Stages',
        '#   slow stage?             look at its shuffle read / write',
        '#   one task 10x the rest?  that is SKEW, not bad luck',
        '',
        '# AQE: stop trusting the compile-time plan -- re-plan at',
        '# runtime from the partition sizes actually observed.',
        '# ALL THREE default to true since Spark 3.2 -- check, do not assume',
        'spark.conf.get("spark.sql.adaptive.enabled")',
        'spark.conf.get("spark.sql.adaptive.coalescePartitions.enabled")',
        'spark.conf.get("spark.sql.adaptive.skewJoin.enabled")',
        '',
        '#   coalescePartitions  200 tiny shuffle parts -> a sensible few',
        '#   skewJoin            split the hot key\'s oversized partition',
        '#                       so one straggler cannot hold the stage',
        '#   AQE can even switch sort-merge -> broadcast mid-flight',
        '',
        'products.cache()   # re-read on every batch run -- cache it once',
        '# Spark UI -> Storage tab confirms the reuse',
      ].join('\n'),
    },
  ],
  edges: [],
}
