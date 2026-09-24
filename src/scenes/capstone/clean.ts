import type { Scene } from '@graphlearning/flow'

// §3 clean — a CODE card. The point of the section is that nothing above the explain() has run, so
// the card spends its lower half naming the transformation/action split the narration asserts.
export const capClean: Scene = {
  id: 'cap-clean',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'clean.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import col, to_date, to_timestamp',
        '',
        'clean = (raw',
        '    .dropDuplicates(["event_id"])       # kill at-least-once replays',
        '    .withColumn("ts", to_timestamp("ts"))',
        '    .withColumn("day", to_date("ts"))   # the rollup groups by this',
        '    .filter(col("amount") > 0))         # drop nonsense rows',
        '',
        '# nothing above has RUN. every call is a transformation, and',
        '# transformations are LAZY -- each adds a node to the logical',
        '# plan; no row is touched until an action asks for one.',
        '#',
        '#   transformations  select - filter - withColumn - join - groupBy',
        '#   actions          count - collect - show - write - save',
        '',
        'clean.explain()      # ONE scan: our filter folded into the',
        '                     # pushdown from read_lake.py, because',
        '                     # Catalyst sees the whole chain at once',
      ].join('\n'),
    },
  ],
  edges: [],
}
