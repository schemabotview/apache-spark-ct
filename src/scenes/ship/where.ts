import type { Scene } from '@graphlearning/flow'
import { ideFrame, fold } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/02-deploy-modes/project/ops/where.py?raw'
import session from '../../../spine/ship/02-deploy-modes/session.txt?raw'

export const deployModes: Scene = ideFrame(
  'deploy-modes',
  'retail-pipeline',
  shipTree(2),
  { file: 'ops/where.py', code: code, highlight: [6, 7, 8, 12], terminal: fold(session, [1, 11]) },
  {
    id: 'deploy-modes-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'modes-table',
        kind: 'table',
        label: 'Where the driver runs',
        headers: ['deploy mode', 'driver', 'when'],
        values: [
          ['client', 'where submit ran', 'interactive work'],
          ['cluster', 'a cluster node', 'production'],
        ],
      },
      {
        id: 'deploy-facts',
        kind: 'list',
        icon: 'server',
        label: 'Client and cluster mode',
        pattern: 'storage',
        items: [
          'The driver plans every job and holds collect() results',
          'Client: it lives and dies with your terminal',
          'Cluster: the cluster manager starts it, and restarts it',
          'Cluster mode needs a cluster manager to start it on',
        ],
      },
    ],
  },
)
