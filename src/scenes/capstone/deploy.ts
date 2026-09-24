import type { Scene } from '@graphlearning/flow'

// §11 deploy — a CODE card, and the only shell one in the course. Both submit lines are shown together
// because the section's claim is that the SAME cluster runs them with different flags: cluster mode and
// fixed executors for the stream that never ends, dynamic allocation for the nightly batch.
//
// The `\\` line-continuations are escaped in the source so each array entry keeps a single trailing
// backslash on the rendered line.
export const capDeploy: Scene = {
  id: 'cap-deploy',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'submit.sh',
      minCols: 76,
      label: [
        '# streaming: runs forever, so the DRIVER lives in the cluster',
        '# (client mode would tie it to your laptop staying open)',
        'spark-submit --master yarn --deploy-mode cluster \\',
        '  --num-executors 10 --executor-cores 4 --executor-memory 8g \\',
        '  --conf spark.dynamicAllocation.enabled=false \\',
        '  speed_job.py',
        '',
        '# batch: same cluster, nightly, hands executors back when idle',
        'spark-submit --master yarn --deploy-mode cluster \\',
        '  --conf spark.dynamicAllocation.enabled=true \\',
        '  --conf spark.dynamicAllocation.minExecutors=2 \\',
        '  --conf spark.dynamicAllocation.maxExecutors=20 \\',
        '  batch_job.py',
        '',
        '# 10 executors x 4 cores = 40 task slots running at once',
        '# --master also takes: k8s://... - spark://... - local[*]',
      ].join('\n'),
    },
  ],
  edges: [],
}
