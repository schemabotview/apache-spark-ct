import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame } from '../ide'
import { plansTree } from './tree'
import code from '../../../spine/plans/05-stages/project/explore/stages.py?raw'
import session from '../../../spine/plans/05-stages/session.txt?raw'

export const exchangesStages: Scene = ideFrame(
  'exchanges-stages',
  'retail-pipeline',
  plansTree(5, 'explore/stages.py'),
  { file: 'explore/stages.py', code: code, show: [[9, 22]], highlight: [10, 13, 14, 17, 18, 21], terminal: fold(session, [1, 7], [12, 12], [15, 18]) },
  {
    id: 'exchanges-stages-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'stage-map',
        label: 'Stage 2 · 4 tasks',
        sub: 'scan, filter, join, partial sum',
        pattern: 'network',
        icon: 'none',
        cols: 2,
        children: [
          {
            id: 'stage-map-0',
            label: 'FileScan parquet',
            variant: 'chip',
            icon: 'none',
            pattern: 'network',
          },
          {
            id: 'stage-map-1',
            label: 'BroadcastHashJoin',
            variant: 'chip',
            icon: 'none',
            pattern: 'network',
          },
          {
            id: 'stage-map-2',
            label: 'partial HashAggregate',
            variant: 'chip',
            icon: 'none',
            pattern: 'network',
          },
          {
            id: 'stage-map-3',
            label: 'write 17,464 B',
            variant: 'chip',
            icon: 'none',
            pattern: 'network',
          },
        ],
      },
      {
        id: 'stage-reduce',
        label: 'Stage 3 · 200 tasks',
        sub: 'read the shuffle, final sum',
        pattern: 'service',
        icon: 'none',
        cols: 2,
        children: [
          {
            id: 'stage-reduce-0',
            label: 'read 17,464 B',
            variant: 'chip',
            icon: 'none',
            pattern: 'service',
          },
          {
            id: 'stage-reduce-1',
            label: 'final HashAggregate',
            variant: 'chip',
            icon: 'none',
            pattern: 'service',
          },
        ],
      },
      {
        id: 'stages-facts',
        kind: 'list',
        icon: 'workflow',
        label: 'An Exchange is a stage boundary',
        pattern: 'storage',
        items: [
          'Stages 0 and 1: reading the Parquet footers, and broadcasting stores',
          'The broadcast ran as its own small job: stage 1',
          '17 KB crossed the shuffle: partial sums, not orders',
        ],
      },
    ],
  },
)
