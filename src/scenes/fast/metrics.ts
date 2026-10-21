import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/02-metrics/project/perf/stage_metrics.py?raw'
import session from '../../../spine/fast/02-metrics/session.txt?raw'

export const stageMetrics: Scene = ideFrame(
  'stage-metrics',
  'retail-pipeline',
  fastTree(2),
  { file: 'perf/stage_metrics.py', code: code, show: [[10, 21]], highlight: [12, 15, 17, 18, 19], terminal: session },
  {
    id: 'stage-metrics-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'metrics-read',
        kind: 'table',
        label: 'Reading the stage list',
        headers: ['metric', 'tells you'],
        values: [
          ['run ms', 'task time, summed over tasks'],
          ['input MB', 'bytes read from files'],
          ['shuffle KB', 'bytes handed to the next stage'],
          ['tasks', 'parallelism of the stage'],
        ],
      },
      {
        id: 'metrics-facts',
        kind: 'list',
        icon: 'barchart',
        label: 'Find the expensive stage first',
        pattern: 'storage',
        items: [
          'Stage 2 is almost all of it: 4 tasks, 45 MB in',
          'Run time is summed: ~16 s of task time in ~2.5 s',
          '17 KB of shuffle: the aggregation is cheap',
          'Optimise stage 2’s scan, filter and join — nothing else',
        ],
      },
    ],
  },
)
