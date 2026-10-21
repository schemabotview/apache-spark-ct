import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/05-partitions/project/partitions.py?raw'
import session from '../../../spine/how-spark-runs/05-partitions/session.txt?raw'

// Task counts are the status tracker's numTasks per stage. The production row is the course's fixed
// arithmetic: 200 GB ÷ 128 MB ≈ 1,600 partitions on 50 executors × 4 cores = 200 slots.
export const partitions: Scene = ideFrame(
  'partitions-tasks',
  'how-spark-runs',
  runsTree('partitions.py', 'partitions.py'),
  { file: 'partitions.py', code, show: [[10, 25]], highlight: [16, 17, 18, 21, 23], terminal: session },
  {
    id: 'partitions-tasks-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'waves',
        kind: 'table',
        label: 'Tasks, slots and waves',
        headers: ['', 'tasks', 'slots', 'waves'],
        values: [
          ['range(), 4 partitions', '4', '4', '1'],
          ['repartition(8)', '8', '4', '2'],
          ['one production day', '≈ 1,600', '200', '8'],
        ],
      },
      {
        id: 'partition-facts',
        kind: 'list',
        icon: 'layers',
        label: 'One task per partition',
        pattern: 'network',
        items: [
          'A stage runs one task for each of its partitions',
          'Slots are executor cores: four here, 200 in production',
          'More tasks than slots run in waves',
          'repartition(8) added a stage: it moves rows — a shuffle',
        ],
      },
    ],
  },
)
