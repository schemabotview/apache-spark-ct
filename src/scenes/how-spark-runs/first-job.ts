import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/01-first-job/project/first_job.py?raw'
import session from '../../../spine/how-spark-runs/01-first-job/session.txt?raw'

export const firstJob: Scene = ideFrame(
  'first-job',
  'how-spark-runs',
  runsTree('first_job.py', 'first_job.py'),
  { file: 'first_job.py', code, highlight: [6, 7, 10, 13, 14, 15], terminal: session },
  {
    id: 'first-job-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'path',
        kind: 'table',
        label: 'What one show() set in motion',
        headers: ['', 'where', 'what happens'],
        values: [
          ['1', 'Python', 'getOrCreate() starts a JVM'],
          ['2', 'JVM', 'that JVM is the driver'],
          ['3', 'Python → JVM', 'each call adds to a plan'],
          ['4', 'driver', 'show() is an action: plan it'],
          ['5', 'driver', 'cut the plan into stages'],
          ['6', 'executors', 'one task per partition'],
          ['7', 'driver', 'rows come back; Python prints'],
        ],
      },
      {
        id: 'first-job-facts',
        kind: 'list',
        icon: 'java',
        label: 'PySpark drives a Java program',
        pattern: 'service',
        items: [
          'The first line of output is that JVM starting',
          'Lines 10–14 run no Spark work at all — they describe it',
          'conf/ keeps Spark’s own log lines to warnings',
        ],
      },
    ],
  },
)
