import type { Scene, SceneNode } from '@graphlearning/flow'
import code from '../../../spine/how-spark-runs/02-who/project/who_does_what.py?raw'
import session from '../../../spine/how-spark-runs/02-who/session.txt?raw'

// The cluster as the Spark docs' cluster-mode overview draws it, beside the same application asked
// about itself on this machine (local[4]): one executor, called 'driver', with four cores.
const slot = (id: string, label: string): SceneNode => ({ id, label, variant: 'chip', pattern: 'network', icon: 'none' })
const executor = (n: number): SceneNode => ({
  id: `exec-${n}`,
  label: `Executor ${n}`,
  sub: 'a JVM on a worker machine',
  pattern: 'network',
  icon: 'cpu',
  cols: 2,
  children: [slot(`e${n}-t1`, 'task'), slot(`e${n}-t2`, 'task'), { id: `e${n}-cache`, label: 'cache', sub: 'partitions kept in memory', icon: 'memory', pattern: 'storage', span: 'all' }],
})

export const cluster: Scene = {
  id: 'driver-executors',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'app',
      label: 'One Spark application',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'client',
          label: 'Driver machine',
          bare: true,
          children: [
            { id: 'python', label: 'Your Python process', sub: 'builds the plan through PySpark', icon: 'python', pattern: 'user' },
            {
              id: 'driver',
              label: 'Driver',
              sub: 'a JVM: one per application',
              pattern: 'service',
              icon: 'java',
              cols: 1,
              children: [
                { id: 'sc', label: 'SparkSession / SparkContext', sub: 'the entry point; holds the configuration', icon: 'dooropen', pattern: 'service' },
                { id: 'dag', label: 'DAG scheduler', sub: 'cuts a job into stages', icon: 'workflow', pattern: 'service' },
                { id: 'ts', label: 'Task scheduler', sub: 'sends tasks to free slots', icon: 'clock', pattern: 'service' },
              ],
            },
          ],
          edges: [{ source: 'python', target: 'driver', label: 'Py4J' }],
        },
        { id: 'cm', label: 'Cluster manager', sub: 'standalone, YARN or Kubernetes: grants machines', icon: 'boxes', pattern: 'external' },
        { id: 'executors', label: 'Executors', bare: true, children: [executor(1), executor(2)] },
      ],
      edges: [
        { source: 'client', target: 'cm', label: 'ask for executors' },
        { source: 'cm', target: 'executors', label: 'start them' },
      ],
    },
    {
      id: 'here',
      label: 'On this machine',
      bare: true,
      framed: true,
      children: [
        { id: 'who-code', kind: 'code', filename: 'who_does_what.py', label: code.replace(/\n+$/, ''), show: [[8, 12], [14, 18]], pattern: 'network' },
        { id: 'who-run', kind: 'terminal', filename: 'Terminal — how-spark-runs', label: session.replace(/\n+$/, '') },
        {
          id: 'local',
          kind: 'list',
          icon: 'server',
          label: 'local[4]: the whole cluster in one JVM',
          pattern: 'network',
          items: [
            'The driver is also the only executor — named "driver"',
            'Its four task slots are four threads',
            'No cluster manager: master is local[4]',
            'The web UI on port 4040 lives in the driver',
          ],
        },
      ],
    },
  ],
  edges: [],
}
