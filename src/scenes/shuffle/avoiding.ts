import type { Scene } from '@graphlearning/flow'

// §8 avoiding-it — three strategies that look unrelated and are actually one idea: a shuffle exists
// because rows that must meet are on different machines, so you either move the OTHER side instead
// (broadcast), or pay the shuffle once at write time and never again (bucketing), or arrange for
// the rows to have been colocated already. Each column ends on its `warn` row, because all three
// are traps when applied without the condition that makes them work.
//
// Redrawn after looking at the first render: the claim was a 62-char label on a LEAF card and wrapped
// straight out of its border, and the nine strategy rows were `variant: 'tile'`, which gave each one
// a large meaningless icon and shrank the text that carried the content. See index.ts house rules.
export const avoiding: Scene = {
  id: 'shuffle-avoiding',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'claim',
      label: 'Why a shuffle exists',
      pattern: 'service',
      icon: 'router',
      sub: 'rows that must meet are on different machines',
    },
    {
      id: 'ways',
      label: 'So there are three ways out — and all three are the same way out',
      pattern: 'group',
      sub: 'move the other side · pay for it once · be colocated already',
      cols: 3,
      children: [
        {
          id: 'broadcast',
          label: 'Broadcast join',
          pattern: 'network',
          sub: 'move the other side',
          cols: 1,
          children: [
            { id: 'b-how', label: 'ship the small side', pattern: 'service', sub: 'whole, to every executor' },
            { id: 'b-when', label: 'under ~10 MB', pattern: 'service', sub: 'autoBroadcastJoinThreshold' },
            { id: 'b-cost', label: 'via the driver', pattern: 'warn', sub: 'forcing it on a big table OOMs it' },
          ],
        },
        {
          id: 'bucket',
          label: 'Bucketing',
          pattern: 'network',
          sub: 'pay for it once, at write time',
          cols: 1,
          children: [
            { id: 'k-how', label: 'bucketBy(320, key)', pattern: 'service', sub: 'stored pre-partitioned' },
            { id: 'k-when', label: 'joined the same way', pattern: 'service', sub: 'a fact table, a dimension' },
            { id: 'k-cost', label: 'both sides must match', pattern: 'warn', sub: 'same column, same count' },
          ],
        },
        {
          id: 'prepart',
          label: 'Reuse the partitioning',
          pattern: 'network',
          sub: 'be colocated already',
          cols: 1,
          children: [
            { id: 'p-how', label: 'keep the layout', pattern: 'service', sub: 'two aggs, one key, one shuffle' },
            { id: 'p-when', label: 'a chain on one key', pattern: 'service', sub: 'Spark keeps it if you let it' },
            { id: 'p-cost', label: 'one stray repartition', pattern: 'warn', sub: 'throws it away — count the Exchanges' },
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'claim', target: 'ways' }],
}
