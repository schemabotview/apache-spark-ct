import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame } from '../ide'
import { underneathTree } from './tree'
import code from '../../../spine/underneath/01-lineage/project/explore/rdd_lineage.py?raw'
import session from '../../../spine/underneath/01-lineage/session.txt?raw'

export const rddLineage: Scene = ideFrame(
  'rdd-lineage',
  'retail-pipeline',
  underneathTree(1),
  { file: 'explore/rdd_lineage.py', code: code, show: [[9, 20]], highlight: [12, 13, 14, 15, 16, 19], terminal: fold(session, [1, 3], [-10, -1]) },
  {
    id: 'rdd-lineage-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'rdd-steps',
        kind: 'table',
        label: 'Each line, one RDD',
        headers: ['line', 'RDD', 'holds'],
        values: [
          ['12', 'textFile', 'strings'],
          ['13', 'map(json.loads)', 'dicts'],
          ['14', 'filter', 'completed dicts'],
          ['15', 'map', '(store, amount)'],
          ['16', 'reduceByKey', '(store, total)'],
        ],
      },
      {
        id: 'lineage-facts',
        kind: 'list',
        icon: 'gitbranch',
        label: 'Lineage, written down',
        pattern: 'storage',
        items: [
          'toDebugString is the recipe for every partition',
          '+-(3) marks the shuffle: two stages',
          'No schema, no optimizer: Spark runs what you wrote',
          'Every lambda runs in a Python worker, per record',
        ],
      },
    ],
  },
)
