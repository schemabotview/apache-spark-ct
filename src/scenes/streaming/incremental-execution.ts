import type { Scene } from '@graphlearning/flow'

export const incrementalExecution: Scene = {
  id: 'str-incremental',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'naive',
      label: 'Recompute everything?',
      pattern: 'warn',
      icon: 'repeat',
      sub: 'correct, and impossible — the input grows forever',
    },
    {
      id: 'real',
      label: 'So the engine keeps the RUNNING RESULT instead',
      pattern: 'group',
      sub: 'a count per key, updated by the new rows — the answer is the same, the work is proportional to what arrived',
      cols: 3,
      children: [
        { id: 'r-old', label: 'state: dest → 1,204', pattern: 'service', sub: 'what the last batch left' },
        { id: 'r-new', label: '+ 17 new rows', pattern: 'network', sub: 'this batch’s input' },
        { id: 'r-out', label: '= 1,221', pattern: 'service', sub: 'and the state is updated' },
      ],
    },
    {
      id: 'cost',
      label: 'Which introduces STATE',
      pattern: 'warn',
      icon: 'database',
      sub: 'it must survive between batches, and across restarts',
    },
  ],
  edges: [
    { source: 'naive', target: 'real' },
    { source: 'real', target: 'cost' },
  ],
}
