import type { Scene } from '@graphlearning/flow'

// §9 real-time-view — a CODE card. All three output modes are listed because the section's job is to
// justify choosing `update`, and the checkpoint block is the exactly-once story in four lines.
export const capRealTimeView: Scene = {
  id: 'cap-real-time-view',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'write_stream.py',
      minCols: 76,
      label: [
        '(agg.writeStream',
        '    .outputMode("update")                    # only changed windows',
        '    .option("checkpointLocation", "ckpt/speed")',
        '    .toTable("revenue_rt")                   # the real-time view',
        '    .start())',
        '',
        '# output modes',
        '#   append    only rows that are final and will never change',
        '#   complete  rewrite the entire result table every trigger',
        '#   update    emit just what changed          <- ours',
        '',
        '# the checkpoint IS the fault-tolerance story: on every trigger',
        '# Spark durably records the Kafka OFFSETS consumed and the',
        '# window STATE, so a crash resumes at exactly that point.',
        '#   nothing lost + nothing double-counted = exactly-once',
        '',
        '# same writeStream, other sinks:',
        '#   kafka - files - console (debug) - foreachBatch (anything)',
      ].join('\n'),
    },
  ],
  edges: [],
}
