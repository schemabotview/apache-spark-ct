import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { writeTree } from './tree'
import code from '../../../spine/write/05-whole-job/project/jobs/daily_sales.py?raw'
import session from '../../../spine/write/05-whole-job/session.txt?raw'

export const wholeBatchJob: Scene = ideFrame(
  'whole-batch-job',
  'retail-pipeline',
  writeTree(5),
  { file: 'jobs/daily_sales.py', code: code, show: [[19, 34]], highlight: [19, 20, 22, 23, 24, 25, 26, 28, 29, 30, 31], terminal: session },
  {
    id: 'whole-batch-job-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'stages-of-job',
        kind: 'table',
        label: 'The job, step by step',
        headers: ['line', 'step', 'moves data?'],
        values: [
          ['19–20', 'read orders, stores', 'no'],
          ['22', 'keep completed', 'no'],
          ['23', 'join the city', 'small side: no'],
          ['24–26', 'sum per day and city', 'yes: a shuffle'],
          ['28–31', 'write by day', 'no'],
        ],
      },
      {
        id: 'whole-facts',
        kind: 'list',
        icon: 'circlecheck',
        label: 'Part I, done',
        pattern: 'storage',
        items: [
          'Two days of events in, a folder per day out',
          'A rerun overwrites the whole output, every day',
          'Course 8 makes it correct on messy data',
          'Courses 9 and 10 read its plan and make it fast',
        ],
      },
    ],
  },
)
