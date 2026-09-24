import type { Scene } from '@graphlearning/flow'

export const theAction: Scene = {
  id: 'exec-the-action',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'kinds',
      label: 'An action is anything that needs a real answer',
      pattern: 'group',
      sub: 'a transformation returns another description; an action returns a value, writes a file, or shows rows',
      cols: 3,
      children: [
        { id: 'k-value', label: 'a value to the driver', pattern: 'network', sub: 'count · collect · first · take' },
        { id: 'k-write', label: 'a write to storage', pattern: 'storage', sub: 'save · write · saveAsTable' },
        { id: 'k-show', label: 'rows on your screen', pattern: 'network', sub: 'show — yes, this is an action' },
      ],
    },
    {
      id: 'triggers',
      label: 'One action, one job',
      pattern: 'warn',
      icon: 'zap',
      sub: 'and the job runs the WHOLE plan behind it, every time',
    },
    {
      id: 'trap',
      label: 'The trap that follows from "every time"',
      pattern: 'group',
      sub: 'three actions on one DataFrame is three jobs, each re-running the entire chain from the source',
      cols: 2,
      children: [
        { id: 't-three', label: 'count, then show, then write', pattern: 'warn', sub: 'the file is read three times' },
        { id: 't-fix', label: 'cache() between them', pattern: 'service', sub: 'or accept paying three times' },
      ],
    },
  ],
  edges: [
    { source: 'kinds', target: 'triggers' },
    { source: 'triggers', target: 'trap' },
  ],
}
