import type { Scene } from '@graphlearning/flow'

export const preferredLocations: Scene = {
  id: 'rdd-locality',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ask',
      label: 'Send the task to the data',
      pattern: 'service',
      icon: 'mapPin',
      sub: 'moving a task is free · moving a partition is not',
    },
    {
      id: 'levels',
      label: 'The levels it will settle for, best first',
      pattern: 'group',
      sub: 'it waits briefly for a better level before giving up — spark.locality.wait, 3 seconds by default',
      cols: 4,
      children: [
        { id: 'lv-1', label: 'PROCESS_LOCAL', pattern: 'service', sub: 'same JVM — already cached here' },
        { id: 'lv-2', label: 'NODE_LOCAL', pattern: 'network', sub: 'same machine, another process' },
        { id: 'lv-3', label: 'RACK_LOCAL', pattern: 'network', sub: 'same rack, over the network' },
        { id: 'lv-4', label: 'ANY', pattern: 'warn', sub: 'anywhere — ship the data' },
      ],
    },
    {
      id: 'sign',
      label: 'What it looks like when this is hurting you',
      pattern: 'group',
      sub: 'the locality column in the Stages tab is the fastest read on whether placement is working',
      cols: 2,
      children: [
        { id: 'sg-any', label: 'mostly ANY', pattern: 'warn', sub: 'every task is pulling its input over the wire' },
        { id: 'sg-wait', label: 'idle slots, then a rush', pattern: 'warn', sub: 'it is waiting out locality.wait' },
      ],
    },
  ],
  edges: [
    { source: 'ask', target: 'levels' },
    { source: 'levels', target: 'sign' },
  ],
}
