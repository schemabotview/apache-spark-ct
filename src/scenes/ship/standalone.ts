import type { Scene } from '@graphlearning/flow'
import { ideFrame, fold } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/03-cluster-managers/project/deploy/standalone.sh?raw'
import session from '../../../spine/ship/03-cluster-managers/session.txt?raw'

export const clusterManagers: Scene = ideFrame(
  'cluster-managers',
  'retail-pipeline',
  shipTree(3),
  { file: 'deploy/standalone.sh', code: code, show: [[4, 19]], highlight: [6, 9, 12], terminal: fold(session, [1, 13]) },
  {
    id: 'cluster-managers-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'managers-table',
        kind: 'table',
        label: 'Cluster managers in Spark 4.0.1',
        headers: ['manager', 'master URL', 'cluster mode'],
        values: [
          ['standalone', 'spark://host:7077', 'JVM apps'],
          ['YARN', 'yarn', 'a container'],
          ['Kubernetes', 'k8s://host:443', 'a pod'],
          ['local', 'local[4]', 'none'],
        ],
      },
      {
        id: 'manager-facts',
        kind: 'list',
        icon: 'server',
        label: 'What a cluster manager does',
        pattern: 'storage',
        items: [
          'Owns the machines: cores and memory on each worker',
          'Starts executors for each application that asks',
          'Spark does the rest: plans, tasks, shuffles',
          'YARN and Kubernetes also share the machines with other work',
        ],
      },
    ],
  },
)
