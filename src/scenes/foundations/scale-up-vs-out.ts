import type { Scene } from '@graphlearning/flow'

// §1.2 — the same 70 TB scan reached two ways. The edge labels carry the arithmetic the slide states
// (70 TB at an assumed 2 GB/s per machine), so the comparison reads off the diagram itself.
export const scaleUpVsOut: Scene = {
  id: 'scale-up-vs-out',
  title: 'Scale up versus scale out',
  flow: 'TB',
  nodes: [
    { id: 'history-scan', label: '70 TB history', sub: 'one full scan', pattern: 'storage', icon: 'database' },
    {
      id: 'scale-up',
      label: 'Scale up',
      pattern: 'group',
      cols: 1,
      children: [
        { id: 'up-machine', label: 'Bigger machine', sub: 'more cores, memory, disk', pattern: 'service', icon: 'server' },
        { id: 'up-same-code', label: 'Same code', sub: 'no network in between', pattern: 'service', icon: 'code' },
        { id: 'up-ceiling', label: 'Hard ceiling', sub: 'largest machine on offer', pattern: 'warn', icon: 'ban' },
      ],
    },
    {
      id: 'scale-out',
      label: 'Scale out',
      pattern: 'group',
      cols: 1,
      children: [
        { id: 'out-machines', label: 'More machines', sub: 'add nodes as data grows', pattern: 'service', icon: 'boxes' },
        { id: 'out-network', label: 'Network cost', sub: 'data moves between nodes', pattern: 'warn', icon: 'network' },
        { id: 'out-coordination', label: 'Coordination', sub: 'scheduling and failures', pattern: 'warn', icon: 'workflow' },
      ],
    },
  ],
  edges: [
    { source: 'history-scan', target: 'scale-up', label: '~10 h on one' },
    { source: 'history-scan', target: 'scale-out', label: '~12 min on 50' },
  ],
}
