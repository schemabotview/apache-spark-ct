import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/04-lazy/project/lazy.py?raw'
import session from '../../../spine/how-spark-runs/04-lazy/session.txt?raw'

// Job ids come from the driver's own status tracker. collect() on a plan with no shuffle is exactly
// one job, which is why this frame uses it rather than show() or count() (both can run more).
export const lazy: Scene = ideFrame(
  'lazy-evaluation',
  'how-spark-runs',
  runsTree('lazy.py', 'lazy.py'),
  { file: 'lazy.py', code, show: [[6, 21]], highlight: [12, 13, 14, 17, 19], terminal: session },
  {
    id: 'lazy-evaluation-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'kinds',
        kind: 'table',
        label: 'Two kinds of call',
        headers: ['transformations', 'actions'],
        values: [
          ['filter, where', 'collect, take'],
          ['select, withColumn', 'show, count'],
          ['groupBy().agg()', 'write.parquet()'],
          ['join, union', 'foreach'],
          ['orderBy, distinct', 'toPandas'],
          ['return a new DataFrame', 'run a job, return a result'],
        ],
      },
      {
        id: 'lazy-facts',
        kind: 'list',
        icon: 'workflow',
        label: 'A DataFrame is a plan, not data',
        pattern: 'network',
        items: [
          'Transformations only add steps to the plan',
          'An action makes the driver run the plan as a job',
          'A second action runs the whole plan again',
          'Seeing the whole plan first is what lets Spark optimise it',
        ],
      },
    ],
  },
)
