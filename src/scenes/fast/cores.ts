import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/11-cores/project/perf/cores.py?raw'
import session from '../../../spine/fast/11-cores/session.txt?raw'

export const executorResources: Scene = ideFrame(
  'executor-resources',
  'retail-pipeline',
  fastTree(11),
  { file: 'perf/cores.py', code: code, highlight: [10, 11, 12, 15], terminal: session },
  {
    id: 'executor-resources-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'resources',
        kind: 'table',
        label: 'Sizing executors on a cluster',
        headers: ['setting', 'sets'],
        values: [
          ['spark.executor.cores', 'task slots each'],
          ['spark.executor.memory', 'heap each'],
          ['spark.executor.instances', 'how many (static)'],
          ['…executor.memoryOverhead', 'off-heap, ≥ 384 MB'],
        ],
      },
      {
        id: 'cores-facts',
        kind: 'list',
        icon: 'cpu',
        label: 'Dynamic allocation',
        pattern: 'storage',
        items: [
          'spark.dynamicAllocation.enabled: executors follow the work',
          'Idle executors are released after a timeout',
          'Needs shuffle data to outlive executors: shuffle tracking',
          'Scaling is not linear: 4 cores ≈ 2.5–3× one, here',
        ],
      },
    ],
  },
)
