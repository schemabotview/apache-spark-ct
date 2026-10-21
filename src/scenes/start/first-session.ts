import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/03-first-session/project/jobs/daily_sales.py?raw'
import session from '../../../spine/start/03-first-session/session.txt?raw'

export const firstSession: Scene = ideFrame(
  'first-session',
  'retail-pipeline',
  startTree('daily_sales.py', ['conf', 'daily_sales.py']),
  { file: 'jobs/daily_sales.py', code, highlight: [6, 8, 9, 10, 16], pattern: 'service', terminal: session },
  {
    id: 'first-session-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'builder',
        kind: 'table',
        label: 'The builder, call by call',
        headers: ['call', 'what it sets'],
        values: [
          ['master("local[4]")', 'here, 4 slots'],
          ['appName("daily-sales")', 'its name in the UI'],
          ['getOrCreate()', 'start or reuse the driver'],
          ['spark.stop()', 'stop the driver'],
        ],
      },
      {
        id: 'conf-files',
        kind: 'table',
        label: 'conf/, found through SPARK_CONF_DIR',
        headers: ['file', 'what it does'],
        values: [
          ['log4j2.properties', 'warnings only, one line each'],
          ['spark-defaults.conf', 'no progress bar'],
        ],
      },
      {
        id: 'first-session-facts',
        kind: 'list',
        icon: 'spark',
        label: 'One session per application',
        pattern: 'service',
        items: [
          'The master moves to spark-submit in Course 12',
          'The web UI lives while the session does',
        ],
      },
    ],
  },
)
