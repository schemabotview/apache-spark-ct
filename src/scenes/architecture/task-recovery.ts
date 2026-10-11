import type { Scene } from '@graphlearning/flow'

// §2.8 — a lost executor, step by step, beside the limits of what lineage recovers. Only the lost
// map outputs are recomputed; the job is not restarted.
export const taskRecovery: Scene = {
  id: 'task-recovery',
  title: 'Recovering from a lost executor',
  flow: 'LR',
  nodes: [
    {
      id: 'recovery-steps',
      label: 'Executor 2 is lost',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'map-done', label: 'Stage 0 done', sub: 'shuffle files on local disks', badge: '01', pattern: 'service', icon: 'circlecheck' },
        { id: 'executor-lost', label: 'Executor lost', sub: 'its shuffle files go too', badge: '02', pattern: 'warn', icon: 'skull' },
        { id: 'fetch-failed', label: 'Fetch fails', sub: 'Stage 1 lacks its input', badge: '03', pattern: 'warn', icon: 'ban' },
        { id: 'rerun-map', label: 'Recompute', sub: 'only the lost Stage 0 tasks', badge: '04', pattern: 'network', icon: 'repeat' },
        { id: 'retry-reduce', label: 'Stage 1 retried', sub: 'the job carries on', badge: '05', pattern: 'service', icon: 'circlecheck' },
      ],
      edges: [
        { source: 'map-done', target: 'executor-lost' },
        { source: 'executor-lost', target: 'fetch-failed' },
        { source: 'fetch-failed', target: 'rerun-map' },
        { source: 'rerun-map', target: 'retry-reduce' },
      ],
    },
    {
      id: 'recovery-limits',
      kind: 'list',
      framed: true,
      label: 'What lineage does not cover',
      sub: 'limits to plan around',
      icon: 'shieldcheck',
      pattern: 'warn',
      items: [
        'A task failing 4 times in a row fails the job',
        'Plain local[4] gives each task one attempt',
        'A write to an external system may run twice',
      ],
    },
  ],
  edges: [],
}
