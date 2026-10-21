import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/04-repl/project/jobs/daily_sales.py?raw'
import session from '../../../spine/start/04-repl/session.txt?raw'

export const replBeside: Scene = ideFrame(
  'repl-beside',
  'retail-pipeline',
  startTree('daily_sales.py'),
  { file: 'jobs/daily_sales.py', code, pattern: 'service', terminal: session },
  {
    id: 'repl-beside-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'repl-shows',
        kind: 'table',
        label: 'What the REPL printed',
        headers: ['you typed', 'you got'],
        values: [
          ['df', 'the schema — a plan, no rows'],
          ['df.collect()', 'a list of Row objects'],
        ],
      },
      {
        id: 'repl-facts',
        kind: 'list',
        icon: 'terminal',
        label: 'Try a line, then write it down',
        pattern: 'network',
        items: [
          'SPARK_CONF_DIR=conf sets the variable for this one command',
          'python -q skips the banner; Spark starts on getOrCreate()',
          'A DataFrame’s repr is its columns and their types',
          'Only an action, like collect(), brings rows back',
          'The pyspark command is the same REPL with spark ready-made',
        ],
      },
    ],
  },
)
