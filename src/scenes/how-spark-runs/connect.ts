import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runsTree } from './tree'
import code from '../../../spine/how-spark-runs/03-connect/project/connect.py?raw'
import session from '../../../spine/how-spark-runs/03-connect/session.txt?raw'

// Both runs are real: `remote("local[4]")` starts a Spark Connect server on this machine
// (pyspark[connect] 4.0.1), so the client and the driver are separate processes talking gRPC.
export const connect: Scene = ideFrame(
  'classic-connect',
  'how-spark-runs',
  runsTree('connect.py', 'connect.py'),
  { file: 'connect.py', code, show: [[7, 22]], highlight: [10, 12, 14, 19], terminal: session },
  {
    id: 'classic-connect-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'compare',
        kind: 'table',
        label: 'Two ways to reach a driver',
        headers: ['', 'classic', 'Spark Connect'],
        values: [
          ['the driver', 'in your process', 'a server'],
          ['the wire', 'Py4J', 'gRPC'],
          ['DataFrames, SQL', 'yes', 'yes'],
          ['sparkContext, RDDs', 'yes', 'no'],
          ['client crashes', 'driver dies too', 'server stays up'],
          ['upgrades', 'together', 'separately'],
        ],
      },
      {
        id: 'connect-facts',
        kind: 'list',
        icon: 'plug',
        label: 'Same query, different boundary',
        pattern: 'network',
        items: [
          'Connect sends an unresolved plan; the server runs it',
          'Anything that needs the JVM directly is classic-only',
          'This course uses classic, and says where Connect differs',
        ],
      },
    ],
  },
)
