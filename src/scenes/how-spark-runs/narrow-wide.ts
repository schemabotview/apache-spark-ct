import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/06-narrow-wide/project/narrow_wide.py?raw'
import session from '../../../spine/how-spark-runs/06-narrow-wide/session.txt?raw'

// The plan is the real explain() output; the side pane is the same plan drawn as partitions.
const part = (id: string, label: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, variant: 'chip', icon: 'none', pattern })

export const narrowWide: Scene = ideFrame(
  'narrow-wide',
  'how-spark-runs',
  runsTree('narrow_wide.py', 'narrow_wide.py'),
  { file: 'narrow_wide.py', code, show: [[6, 19]], highlight: [13, 14, 17, 18], pattern: 'network', terminal: session },
  {
    id: 'narrow-wide-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'narrow',
        label: 'Narrow',
        sub: 'filter, select: each partition stays where it is',
        pattern: 'network',
        icon: 'none',
        flow: 'LR',
        children: [part('n-in-1', 'part 1', 'network'), part('n-in-2', 'part 2', 'network'), part('n-out-1', 'part 1', 'network'), part('n-out-2', 'part 2', 'network')],
        edges: [
          { source: 'n-in-1', target: 'n-out-1' },
          { source: 'n-in-2', target: 'n-out-2' },
        ],
      },
      {
        id: 'wide',
        label: 'Wide',
        sub: 'groupBy: every store’s rows meet in one partition',
        pattern: 'service',
        icon: 'none',
        flow: 'LR',
        children: [part('w-in-1', 'part 1', 'service'), part('w-in-2', 'part 2', 'service'), part('w-out-7', 'store 7', 'service'), part('w-out-9', 'store 9', 'service')],
        edges: [
          { source: 'w-in-1', target: 'w-out-7' },
          { source: 'w-in-1', target: 'w-out-9' },
          { source: 'w-in-2', target: 'w-out-7' },
          { source: 'w-in-2', target: 'w-out-9' },
        ],
      },
      {
        id: 'narrow-wide-facts',
        kind: 'list',
        icon: 'share',
        label: 'Reading the plan',
        pattern: 'service',
        items: [
          'Read it bottom up: Scan, Filter, Project are narrow',
          'Exchange is the shuffle: rows cross partitions',
          'partial_sum before it shrinks what has to move',
          '200 is spark.sql.shuffle.partitions, the default',
        ],
      },
    ],
  },
)
