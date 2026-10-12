import type { Scene } from '@graphlearning/flow'

// §8.3 — the same application on the three cluster managers Spark 4.0.1 supports, by what each one
// takes care of and what is left to the team running it.
export const clusterManagers: Scene = {
  id: 'cluster-managers',
  title: 'Standalone, YARN, Kubernetes',
  flow: 'TB',
  nodes: [
    {
      id: 'master-urls',
      kind: 'code',
      filename: '--master',
      label: `spark://host:7077          # standalone
yarn                       # YARN, queue via --queue
k8s://https://api:6443     # Kubernetes
# K8s also needs an image and a service account:
spark.kubernetes.container.image=retail:4.0.1
spark.kubernetes.authenticate.driver\\
    .serviceAccountName=spark`,
    },
    {
      id: 'manager-table',
      kind: 'table',
      label: 'Who takes care of what',
      headers: ['concern', 'standalone', 'YARN', 'Kubernetes'],
      values: [
        ['sharing between teams', 'basic', 'queues', 'namespaces, quotas'],
        ['what is shipped', 'files', 'files', 'container image'],
        ['shuffle on scale-in', 'shuffle service', 'shuffle service', 'shuffle tracking'],
        ['Python cluster mode', 'no', 'yes', 'yes'],
        ['you operate', 'master, workers', 'Hadoop', 'K8s and RBAC'],
      ],
    },
  ],
  edges: [{ source: 'master-urls', target: 'manager-table' }],
}
