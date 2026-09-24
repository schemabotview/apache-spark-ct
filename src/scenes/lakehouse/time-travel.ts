import type { Scene } from '@graphlearning/flow'

export const timeTravel: Scene = {
  id: 'lake-time-travel',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'how',
      label: 'Not a feature — the same replay, stopped early',
      pattern: 'group',
      sub: 'the log is an ordered list, so replaying it to entry 5 instead of entry 12 gives the file set as of version 5',
      cols: 2,
      children: [
        { id: 'h-now', label: 'replay to the end', pattern: 'service', sub: 'today’s table' },
        { id: 'h-then', label: 'replay to entry 5', pattern: 'service', sub: 'Tuesday’s table' },
      ],
    },
    {
      id: 'uses',
      label: 'What it is actually for',
      pattern: 'group',
      sub: 'the debugging use is the one that pays for itself the first time a number changes and nobody knows why',
      cols: 3,
      children: [
        { id: 'u-debug', label: 'what changed?', pattern: 'network', sub: 'diff two versions, exactly' },
        { id: 'u-rollback', label: 'undo a bad write', pattern: 'network', sub: 'restore a previous version' },
        { id: 'u-repro', label: 'reproduce a model', pattern: 'network', sub: 'train on the data as it was' },
      ],
    },
    {
      id: 'cost',
      label: 'And it is not free',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'old versions exist because their files were never deleted — §11',
    },
  ],
  edges: [
    { source: 'how', target: 'uses' },
    { source: 'uses', target: 'cost' },
  ],
}
