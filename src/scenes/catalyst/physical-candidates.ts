import type { Scene } from '@graphlearning/flow'

export const physicalCandidates: Scene = {
  id: 'cat-physical',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'logical',
      label: 'The logical plan: WHAT',
      pattern: 'service',
      icon: 'gitmerge',
      sub: 'Join (user#3 = user#9) — and says nothing at all about how',
    },
    {
      id: 'strategies',
      label: 'Several physical plans say HOW',
      pattern: 'group',
      sub: 'each computes exactly the same rows; they differ only in what they do to the cluster',
      cols: 3,
      children: [
        { id: 'ph-b', label: 'BroadcastHashJoin', pattern: 'network', sub: 'ship the small side · no shuffle' },
        { id: 'ph-s', label: 'SortMergeJoin', pattern: 'network', sub: 'shuffle both · sort both · merge' },
        { id: 'ph-h', label: 'ShuffledHashJoin', pattern: 'network', sub: 'shuffle both · hash one side' },
      ],
    },
    {
      id: 'same',
      label: 'Same answer, different cost',
      pattern: 'warn',
      icon: 'scale',
      sub: 'which is the entire reason a cost model has to exist at all',
    },
  ],
  edges: [
    { source: 'logical', target: 'strategies', label: 'strategies generate candidates' },
    { source: 'strategies', target: 'same' },
  ],
}
