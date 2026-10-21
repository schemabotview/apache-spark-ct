import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { fastTree } from './tree'
import code from '../../../spine/fast/03-spill/project/perf/spill.py?raw'
import session from '../../../spine/fast/03-spill/session.txt?raw'

export const spillSymptom: Scene = ideFrame(
  'spill-symptom',
  'retail-pipeline',
  fastTree(3),
  { file: 'perf/spill.py', code: code, show: [[9, 22]], highlight: [14, 15, 16, 17, 19], terminal: session },
  {
    id: 'spill-symptom-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'symptoms',
        kind: 'table',
        label: 'Symptom → where to look',
        headers: ['symptom', 'metric'],
        values: [
          ['memory', 'spill (memory, disk)'],
          ['CPU', 'run time vs GC time'],
          ['I/O', 'input, shuffle read bytes'],
          ['scheduling', 'few tasks, idle slots'],
          ['one slow task', 'task time quantiles'],
        ],
      },
      {
        id: 'spill-facts',
        kind: 'list',
        icon: 'harddrive',
        label: 'Spill: memory ran out, disk took over',
        pattern: 'warn',
        items: [
          'One partition: every row sorted by one task',
          '150 MB written to disk and read back',
          '200 partitions: each task’s share fit in memory',
          'Spill is a symptom: give tasks less data each',
        ],
      },
    ],
  },
)
