import type { Scene } from '@graphlearning/flow'

// §9 aqe-fixes-it — the point is that AQE is a LOOP, not a setting, so the frame has to close: a
// stage finishes, its real statistics become available for the first time, the optimizer runs again
// on what it now knows, and the next stage is planned differently. The three re-plans are the branch
// the loop takes, each naming the condition that triggers it.
//
// Redrawn after the first render: `limits` was a leaf card carrying a 180-char sub, which spilled
// out of the bottom of the frame entirely. It is a GROUP now — three short cards say the same thing
// and stay inside their borders. See index.ts house rules.
export const aqeLoop: Scene = {
  id: 'shuffle-aqe-loop',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'loop',
      label: 'Adaptive Query Execution — on by default since Spark 3.2',
      pattern: 'group',
      sub: 'a shuffle is the one moment the optimizer stops guessing, because the data has been counted',
      children: [
        { id: 'run', label: 'a stage completes', pattern: 'service', sub: 'its shuffle files are written' },
        { id: 'stats', label: 'real statistics exist', pattern: 'network', icon: 'database', sub: 'actual bytes and rows per partition' },
        {
          id: 'replan',
          label: 'Catalyst runs again on the rest of the plan',
          pattern: 'service',
          sub: 'three re-plans, each with its own trigger',
          flow: 'LR',
          children: [
            { id: 'coalesce', label: 'coalesce partitions', pattern: 'network', sub: '200 × 8 MB → a few × 64 MB' },
            { id: 'switch', label: 'switch the join', pattern: 'network', sub: 'measured small → broadcast it' },
            { id: 'split', label: 'split the skew', pattern: 'network', sub: 'cut it up, duplicate its match' },
          ],
        },
        { id: 'next', label: 'the next stage runs', pattern: 'service', sub: 'and the loop repeats at the next shuffle' },
      ],
      edges: [
        { source: 'run', target: 'stats' },
        { source: 'stats', target: 'replan' },
        { source: 'replan', target: 'next' },
      ],
    },
    {
      id: 'limits',
      label: 'What it still cannot do for you',
      pattern: 'group',
      sub: 'the three sentences to keep beside every "just turn on AQE"',
      cols: 3,
      children: [
        { id: 'l-key', label: 'a single hot key', pattern: 'warn', sub: 'is one partition — it cannot be split' },
        { id: 'l-remove', label: 'it right-sizes', pattern: 'warn', sub: 'the shuffle still happens' },
        { id: 'l-narrow', label: 'no shuffle, no stats', pattern: 'warn', sub: 'nothing adapts inside a narrow stage' },
      ],
    },
  ],
  edges: [{ source: 'loop', target: 'limits' }],
}
