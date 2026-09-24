import type { Scene } from '@graphlearning/flow'

export const sparkSubmit: Scene = {
  id: 'topology-spark-submit',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'submit.sh',
      minCols: 76,
      label: [
        '# Every flag here decides one thing from this course.',
        'spark-submit \\',
        '  --master k8s://https://my-cluster:6443 \\  # which manager',
        '  --deploy-mode cluster \\                   # where the driver',
        '  --name nightly-sessionize \\',
        '  --driver-memory 4g \\        # it only plans -- unless you',
        '                              # collect(), and then it is a trap',
        '  --executor-memory 16g \\     # split: execution + storage',
        '  --executor-cores 5 \\        # ~5 is the usual advice',
        '  --num-executors 20 \\        # 20 x 5 = 100 task slots',
        '  --conf spark.sql.shuffle.partitions=400 \\',
        '  --conf spark.dynamicAllocation.enabled=true \\',
        '  app.py --date 2026-09-24',
        '',
        '# Read the resource flags as ONE number:',
        '#   executors x cores = the slots your job can ever use.',
        '#   400 shuffle partitions over 100 slots = 4 clean waves.',
        '#   401 partitions = 5 waves, the last one 1% busy.',
        '',
        '# Order matters: --conf before the app file is Spark config,',
        '# after it is an argument to YOUR program. A misplaced flag',
        '# is silently ignored rather than rejected.',
      ].join('\n'),
    },
  ],
  edges: [],
}
