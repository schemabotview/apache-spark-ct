import type { Scene } from '@graphlearning/flow'

// §5 reduce-side-fetch — the asymmetry that explains the memory cliff. A map task's input is its
// one partition; a reduce task's input is a slice of EVERY map task's output, so its fan-in grows
// with the width of the stage before it. Drawn as many-to-one into a single task, then the inside
// of that task: buffer → spill → merge. The spill node is `warn` because this is the exact place a
// shuffle stops being slow and starts being an OOM.
export const reduceFetch: Scene = {
  id: 'shuffle-reduce-fetch',
  padding: 0.14,
  flow: 'LR',
  nodes: [
    {
      id: 'sources',
      label: 'Every map task that ran',
      pattern: 'group',
      sub: 'each holds one slice for this reducer — and a reducer must have them all before it can finish',
      children: [
        { id: 'm-0', label: 'map task 0', pattern: 'storage', sub: 'slice 7 · 40 MB' },
        { id: 'm-1', label: 'map task 1', pattern: 'storage', sub: 'slice 7 · 38 MB' },
        { id: 'm-n', label: 'map task 399', pattern: 'storage', sub: 'slice 7 · 41 MB' },
      ],
    },
    {
      id: 'reducer',
      label: 'Reduce task 7',
      pattern: 'group',
      sub: 'one task · 400 inbound streams · ~16 GB to pull through',
      children: [
        { id: 'fetch', label: 'fetch', pattern: 'network', icon: 'router', sub: 'a few blocks in flight at a time, not all 400' },
        { id: 'mem', label: 'execution memory', pattern: 'service', sub: 'shared with every task on the executor' },
        { id: 'spill-r', label: 'spill to disk', pattern: 'warn', sub: 'does not fit → sorted runs go out, and get read back' },
        { id: 'merge', label: 'merge + aggregate', pattern: 'service', sub: 'the actual groupBy, finally' },
      ],
      edges: [
        { source: 'fetch', target: 'mem' },
        { source: 'mem', target: 'spill-r' },
        { source: 'spill-r', target: 'merge' },
      ],
    },
  ],
  edges: [{ source: 'sources', target: 'reducer', label: 'fan-in = the stage before it' }],
}
