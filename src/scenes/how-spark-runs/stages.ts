import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/07-stages/project/stages.py?raw'
import session from '../../../spine/how-spark-runs/07-stages/session.txt?raw'

// AQE is off in this one script so the job is planned once and the 200 shuffle partitions show
// as 200 tasks; with it on (the default), the second stage is coalesced — Course 10.
const op = (id: string, label: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, variant: 'chip', icon: 'none', pattern })

export const stages: Scene = ideFrame(
  'jobs-stages-tasks',
  'how-spark-runs',
  runsTree('stages.py', 'stages.py'),
  { file: 'stages.py', code, show: [[9, 25]], highlight: [11, 18, 22, 24], pattern: 'network', terminal: session },
  {
    id: 'jobs-stages-tasks-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'job',
        label: 'Job 0 — collect()',
        sub: 'one action, one job, cut at the shuffle',
        pattern: 'service',
        icon: 'none',
        flow: 'TB',
        children: [
          { id: 'stage-0', label: 'Stage 0 · 4 tasks', sub: 'one per input partition', pattern: 'network', icon: 'none', cols: 3, children: [op('s0-scan', 'scan', 'network'), op('s0-filter', 'filter', 'network'), op('s0-partial', 'partial sum', 'network')] },
          { id: 'stage-1', label: 'Stage 1 · 200 tasks', sub: 'one per shuffle partition', pattern: 'service', icon: 'none', cols: 2, children: [op('s1-read', 'read shuffle', 'service'), op('s1-sum', 'final sum', 'service')] },
        ],
        edges: [{ source: 'stage-0', target: 'stage-1', label: 'shuffle' }],
      },
      {
        id: 'stages-facts',
        kind: 'list',
        icon: 'workflow',
        label: 'Action → job → stages → tasks',
        pattern: 'service',
        items: [
          'Each shuffle ends one stage and starts the next',
          'A stage waits for every task of the one before it',
          '200 tasks for three stores: most of them are empty',
        ],
      },
    ],
  },
)
