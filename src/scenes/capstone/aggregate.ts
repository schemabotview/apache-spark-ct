import type { Scene } from '@graphlearning/flow'

// §4 batch-aggregate — a CODE card. It has to set up the §7 payoff: the SAME products table joined a
// different way, so the comment block names both strategies and points forward to enrich.py.
export const capAggregate: Scene = {
  id: 'cap-aggregate',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'aggregate.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import countDistinct, sum',
        '',
        'products = spark.read.parquet("dim/products")   # id -> category',
        '',
        'rollup = (clean',
        '    .join(products, "product_id")   # BOTH sides large in batch, so',
        '                                    # Catalyst picks a sort-merge:',
        '                                    # sort each side, then shuffle',
        '    .groupBy("day", "category")     # wide -> shuffle -> new stage',
        '    .agg(sum("amount").alias("revenue"),',
        '         countDistinct("user_id").alias("buyers")))',
        '',
        '# we declared WHAT, never HOW -- no join hint, no partition count.',
        '# Catalyst chose the strategy; Tungsten compiled it to bytecode.',
        '#',
        '# the speed layer joins this SAME table a different way, because',
        '# there one side is tiny -> broadcast (see enrich.py)',
        '',
        'rollup.explain()   # SortMergeJoin + Exchange hashpartitioning',
      ].join('\n'),
    },
  ],
  edges: [],
}
