import type { Scene } from '@graphlearning/flow'

export const theTask: Scene = {
  id: 'exec-the-task',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'One task = one partition of one stage',
      pattern: 'group',
      sub: 'the smallest unit Spark schedules — it cannot be split, moved mid-flight, or run by two cores',
      cols: 3,
      children: [
        { id: 't-code', label: 'the stage’s code', pattern: 'service', sub: 'serialised and shipped' },
        { id: 't-part', label: 'one partition', pattern: 'storage', sub: 'its only input' },
        { id: 't-out', label: 'its output', pattern: 'network', sub: 'shuffle files, or a result' },
      ],
    },
    {
      id: 'retry',
      label: 'What happens when one fails',
      pattern: 'group',
      sub: 'tasks are retried individually — spark.task.maxFailures is 4, and only then does the stage fail',
      cols: 3,
      children: [
        { id: 'r-1', label: 'retry elsewhere', pattern: 'network', sub: 'lineage says how to redo it' },
        { id: 'r-2', label: 'four strikes', pattern: 'network', sub: 'then the stage gives up' },
        { id: 'r-3', label: 'and the job fails', pattern: 'warn', sub: 'one partition can end everything' },
      ],
    },
    {
      id: 'spec',
      label: 'Speculative execution',
      pattern: 'warn',
      icon: 'copy',
      sub: 'a straggler is re-run elsewhere; first finisher wins',
    },
  ],
  edges: [
    { source: 'what', target: 'retry' },
    { source: 'retry', target: 'spec' },
  ],
}
