import type { Scene } from '@graphlearning/flow'

// §5 — shuffle hash join. The forgotten third option, and the one condition that makes it win.
export const shuffleHash: Scene = {
  id: 'joins-shuffle-hash',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'same',
      label: 'The same shuffle',
      pattern: 'warn',
      sub: 'both sides repartitioned by key — identical cost',
    },
    {
      id: 'diff',
      label: 'Then it does something different per partition',
      pattern: 'group',
      sub: 'no sort — build a hash table from the smaller side and probe it with the larger',
      cols: 2,
      children: [
        { id: 'build', label: 'build side', pattern: 'service', sub: 'the smaller partition → an in-memory hash map' },
        { id: 'probe-s', label: 'probe side', pattern: 'network', sub: 'streamed through, one lookup per row' },
      ],
    },
    {
      id: 'tradeoff',
      label: 'The trade',
      pattern: 'group',
      sub: 'preferSortMergeJoin is true by default, so Spark picks this only when it is clearly right',
      cols: 2,
      children: [
        { id: 't-win', label: 'no sort at all', pattern: 'service', sub: 'faster when one side genuinely fits' },
        { id: 't-lose', label: 'the build side must fit', pattern: 'warn', sub: 'if it does not, the executor dies' },
      ],
    },
  ],
  edges: [
    { source: 'same', target: 'diff' },
    { source: 'diff', target: 'tradeoff' },
  ],
}
