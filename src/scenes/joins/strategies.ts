import type { Scene } from '@graphlearning/flow'

// Course 9's scene file for §§1–6 — the five strategies, one scene each, plus the framing scene that
// opens the course. They live together because they share a vocabulary (build side, probe side,
// stream side) and reading them side by side is how the differences stay honest.
//
// Written to the house rules in ../shuffle/index.ts: leaf labels ≤ 22 chars, leaf subs ≤ 50, inner
// groups that chain get their own flow, and anything needing a sentence rides a group or the slide.

// §1 — the problem, stated once, in the terms every later section reuses.
export const theProblem: Scene = {
  id: 'joins-the-problem',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'want',
      label: 'What a join asks for',
      pattern: 'group',
      sub: 'orders ⋈ customers on customer_id — every matching pair, wherever the two rows live',
      cols: 2,
      children: [
        { id: 'o-row', label: 'an order row', pattern: 'storage', sub: 'customer_id = 42 · on host A' },
        { id: 'c-row', label: 'its customer row', pattern: 'storage', sub: 'customer_id = 42 · on host D' },
      ],
    },
    {
      id: 'gap',
      label: 'On different machines',
      pattern: 'warn',
      icon: 'router',
      sub: 'and neither host knows the other has a match',
    },
    {
      id: 'options',
      label: 'So exactly one of two things must happen',
      pattern: 'group',
      sub: 'every join strategy in Spark is one of these two answers, and nothing else',
      cols: 2,
      children: [
        { id: 'move-small', label: 'Move one side whole', pattern: 'network', sub: 'copy the small table everywhere' },
        { id: 'move-both', label: 'Move both by key', pattern: 'network', sub: 'repartition so matches land together' },
      ],
    },
  ],
  edges: [
    { source: 'want', target: 'gap' },
    { source: 'gap', target: 'options' },
  ],
}

// §2 — broadcast hash join. The point is the asymmetry: one side travels, the other never moves.
export const broadcastJoin: Scene = {
  id: 'joins-broadcast',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'driver',
      label: 'Driver',
      pattern: 'service',
      icon: 'server',
      sub: 'collects the small side, then broadcasts it',
    },
    {
      id: 'cluster',
      label: 'Every executor gets the whole small table',
      pattern: 'group',
      sub: 'the big side never moves — no shuffle, no stage boundary, no Exchange in the plan',
      cols: 3,
      children: [
        {
          id: 'e1',
          label: 'Executor A',
          pattern: 'network',
          cols: 1,
          children: [
            { id: 'e1-hash', label: 'hash table', pattern: 'service', sub: 'the whole small side' },
            { id: 'e1-part', label: 'its big partition', pattern: 'storage', sub: 'stays exactly where it was' },
          ],
        },
        {
          id: 'e2',
          label: 'Executor B',
          pattern: 'network',
          cols: 1,
          children: [
            { id: 'e2-hash', label: 'hash table', pattern: 'service', sub: 'an identical copy' },
            { id: 'e2-part', label: 'its big partition', pattern: 'storage', sub: 'stays exactly where it was' },
          ],
        },
        {
          id: 'e3',
          label: 'Executor C',
          pattern: 'network',
          cols: 1,
          children: [
            { id: 'e3-hash', label: 'hash table', pattern: 'service', sub: 'an identical copy' },
            { id: 'e3-part', label: 'its big partition', pattern: 'storage', sub: 'stays exactly where it was' },
          ],
        },
      ],
    },
    {
      id: 'probe',
      label: 'Then every task probes locally — one pass, no network',
      pattern: 'group',
      sub: 'the big partition is streamed through, and each row looks its key up in the table already beside it',
      cols: 2,
      children: [
        { id: 'p-stream', label: 'stream the partition', pattern: 'service', sub: 'read once, in place' },
        { id: 'p-lookup', label: 'one local lookup', pattern: 'service', sub: 'per row, against the local hash table' },
      ],
    },
  ],
  edges: [
    { source: 'driver', target: 'cluster', label: 'one copy per executor' },
    { source: 'cluster', target: 'probe' },
  ],
}

// §3 — the threshold. The number is famous; what it MEASURES is what people get wrong.
export const threshold: Scene = {
  id: 'joins-threshold',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'knob',
      label: 'The broadcast threshold',
      pattern: 'service',
      icon: 'ruler',
      sub: 'autoBroadcast… · 10 MB default · -1 disables it',
    },
    {
      id: 'measures',
      label: 'What the 10 MB is measured against',
      pattern: 'group',
      sub: 'not the file on disk — the optimizer’s ESTIMATE of the side’s size in memory',
      cols: 3,
      children: [
        { id: 'm-file', label: '10 MB of Parquet', pattern: 'storage', sub: 'columnar, dictionary-encoded, compressed' },
        { id: 'm-mem', label: '≈ 100 MB in memory', pattern: 'warn', sub: 'decoded rows, JVM objects, hash-table overhead' },
        { id: 'm-est', label: 'and it is an estimate', pattern: 'warn', sub: 'no table stats → Spark guesses, often badly' },
      ],
    },
    {
      id: 'fails',
      label: 'How it goes wrong',
      pattern: 'group',
      sub: 'both failure directions land on the driver, which is why they are worth knowing',
      cols: 2,
      children: [
        { id: 'f-oom', label: 'driver OOM', pattern: 'warn', sub: 'forced broadcast() on something not small' },
        { id: 'f-timeout', label: 'broadcastTimeout', pattern: 'warn', sub: '300 s to collect and ship — then the job dies' },
      ],
    },
  ],
  edges: [
    { source: 'knob', target: 'measures' },
    { source: 'measures', target: 'fails' },
  ],
}

// §4 — sort-merge join. Drawn as the three phases it actually has, because "it shuffles" is the
// half of the story everyone tells and "then it sorts" is the half that explains the cost.
export const sortMerge: Scene = {
  id: 'joins-sort-merge',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'smj',
      label: 'Sort-merge join — the default when neither side is small',
      pattern: 'group',
      sub: 'three phases, two of them expensive, and it is the only strategy that never needs a side to fit in memory',
      children: [
        {
          id: 'phase-1',
          label: '1 · Shuffle both sides',
          pattern: 'warn',
          sub: 'hash(join key) → the same partition id on both sides',
          flow: 'LR',
          children: [
            { id: 's-left', label: 'orders', pattern: 'storage', sub: 'repartitioned by customer_id' },
            { id: 's-right', label: 'customers', pattern: 'storage', sub: 'repartitioned by customer_id' },
          ],
        },
        { id: 'phase-2', label: '2 · Sort each partition', pattern: 'service', sub: 'by the join key, on both sides — spills if it does not fit' },
        { id: 'phase-3', label: '3 · Merge in one pass', pattern: 'service', sub: 'two cursors walk the sorted runs together, in lockstep' },
      ],
      edges: [
        { source: 'phase-1', target: 'phase-2' },
        { source: 'phase-2', target: 'phase-3' },
      ],
    },
    {
      id: 'why',
      label: 'Why sort, when hashing found the partition already',
      pattern: 'group',
      sub: 'the sort is what lets the merge stream — and streaming is what removes the memory ceiling',
      cols: 2,
      children: [
        { id: 'w-stream', label: 'nothing is held whole', pattern: 'service', sub: 'neither side must fit in memory' },
        { id: 'w-spill', label: 'it degrades, not dies', pattern: 'service', sub: 'too big → spill and carry on' },
      ],
    },
  ],
  edges: [{ source: 'smj', target: 'why' }],
}

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

// §6 — nested loop. Short scene: the shape of the cost is the whole content.
export const nestedLoop: Scene = {
  id: 'joins-nested-loop',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'What forces it',
      pattern: 'group',
      sub: 'every other strategy needs an equality to hash on — take that away and only this is left',
      cols: 3,
      children: [
        { id: 'c-range', label: 'a range condition', pattern: 'warn', sub: 'ON a.ts BETWEEN b.start AND b.end' },
        { id: 'c-ineq', label: 'an inequality', pattern: 'warn', sub: 'ON a.price > b.floor' },
        { id: 'c-none', label: 'no condition at all', pattern: 'warn', sub: 'a cross join, written by accident' },
      ],
    },
    {
      id: 'cost',
      label: 'Every row × every row',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: '1M × 1M = 1,000,000,000,000 comparisons',
    },
    {
      id: 'live',
      label: 'When you have to live with it',
      pattern: 'group',
      sub: 'the condition is genuinely non-equi — so make the inner side small instead of making it go away',
      cols: 2,
      children: [
        { id: 'l-bnlj', label: 'broadcast the small side', pattern: 'service', sub: 'O(n×m) but with zero shuffle' },
        { id: 'l-prefilter', label: 'add an equi-key', pattern: 'service', sub: 'join on the day, then filter the range' },
      ],
    },
  ],
  edges: [
    { source: 'cause', target: 'cost' },
    { source: 'cost', target: 'live' },
  ],
}
