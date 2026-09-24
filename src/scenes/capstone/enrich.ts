import type { Scene } from '@graphlearning/flow'

// §7 enrich — a CODE card, and the payoff of §4: the same table, the same join API, a different plan.
// The two-line contrast block is the section, so it is set in the card rather than only spoken.
export const capEnrich: Scene = {
  id: 'cap-enrich',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'enrich.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import broadcast',
        '',
        'prod = spark.read.parquet("dim/products")   # small - fits in memory',
        '',
        'enriched = events.join(',
        '    broadcast(prod), "product_id")          # ship dim to every exec',
        '',
        '# the SAME table and the SAME join API as the batch layer -- a',
        '# different plan, because the SHAPE of the data is different:',
        '#',
        '#   batch   both sides large  -> sort-merge  -> shuffle',
        '#   speed   one side tiny     -> broadcast   -> NO shuffle',
        '#',
        '# every shuffle costs latency a stream cannot afford, which',
        '# makes broadcast the highest-leverage join fix in Spark.',
        '',
        '# Spark also broadcasts on its own under this threshold:',
        'spark.conf.get("spark.sql.autoBroadcastJoinThreshold")   # 10MB',
        '',
        'enriched.explain()   # BroadcastHashJoin -- and no Exchange',
      ].join('\n'),
    },
  ],
  edges: [],
}
