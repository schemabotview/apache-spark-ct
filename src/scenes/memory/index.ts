import type { Scene } from '@graphlearning/flow'

// Course 11 (memory) scenes. The course answers "where did my memory go" and "why did my cache
// vanish" — and both answers come from the same place: one shared pool with an asymmetric borrow
// rule. §§1–3 establish that; §§4–8 are caching, which is the half people think they understand;
// §§9–11 are what happens when it does not fit.

export const theExecutorBudget: Scene = {
  id: 'mem-executor-budget',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'heap',
      label: 'One executor’s JVM heap, carved up',
      pattern: 'group',
      sub: 'spark.executor.memory is the heap — and rather less than all of it is yours to use',
      children: [
        { id: 'h-res', label: 'reserved · 300 MB', pattern: 'warn', sub: 'Spark’s own internals · not negotiable' },
        { id: 'h-unified', label: 'the unified pool · 60%', pattern: 'service', sub: 'spark.memory.fraction — execution AND storage' },
        { id: 'h-user', label: 'user memory · the rest', pattern: 'network', sub: 'your objects, UDF state, anything you allocate' },
      ],
    },
    {
      id: 'outside',
      label: 'And a fourth region, outside the heap entirely',
      pattern: 'group',
      sub: 'memoryOverhead — the container has to hold this too, and the kernel enforces it, not the JVM',
      cols: 3,
      children: [
        { id: 'o-stacks', label: 'thread stacks', pattern: 'network', sub: 'one per task' },
        { id: 'o-net', label: 'network buffers', pattern: 'network', sub: 'shuffle transfers' },
        { id: 'o-py', label: 'Python workers', pattern: 'warn', sub: 'if you use them at all' },
      ],
    },
    {
      id: 'sum',
      label: '16 GB in, ~9 GB usable',
      pattern: 'warn',
      icon: 'calculator',
      sub: 'which is why "it has 16 GB, why did it OOM" is the wrong question',
    },
  ],
  edges: [
    { source: 'heap', target: 'outside' },
    { source: 'outside', target: 'sum' },
  ],
}

export const storageVsExecution: Scene = {
  id: 'mem-storage-vs-execution',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'exec',
      label: 'Execution',
      pattern: 'service',
      sub: 'transient · needed only while an operator runs',
      cols: 1,
      children: [
        { id: 'e-shuffle', label: 'shuffle buffers', pattern: 'network', sub: 'the map-side sort' },
        { id: 'e-join', label: 'join hash tables', pattern: 'network', sub: 'the build side' },
        { id: 'e-sort', label: 'sorts and aggregates', pattern: 'network', sub: 'accumulating state' },
      ],
    },
    {
      id: 'store',
      label: 'Storage',
      pattern: 'service',
      sub: 'durable · kept across operations on purpose',
      cols: 1,
      children: [
        { id: 's-cache', label: 'cached partitions', pattern: 'network', sub: 'what cache() put there' },
        { id: 's-bcast', label: 'broadcast variables', pattern: 'network', sub: 'the small side of a join' },
      ],
    },
    {
      id: 'one',
      label: 'One pool, a soft boundary',
      pattern: 'warn',
      icon: 'gitmerge',
      sub: 'they share, and the line between them moves at runtime',
    },
  ],
  edges: [
    { source: 'exec', target: 'one' },
    { source: 'store', target: 'one' },
  ],
}

export const whoWins: Scene = {
  id: 'mem-who-wins',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'rule',
      label: 'The borrow rule, and it is not symmetric',
      pattern: 'group',
      sub: 'storageFraction (0.5) is not a reservation — it is only the floor storage is allowed to defend',
      cols: 2,
      children: [
        { id: 'r-exec', label: 'execution evicts storage', pattern: 'service', sub: 'down to the floor, whenever it needs to' },
        { id: 'r-store', label: 'storage never evicts', pattern: 'warn', sub: 'execution is untouchable — it waits or spills' },
      ],
    },
    {
      id: 'why',
      label: 'Why the asymmetry is right',
      pattern: 'group',
      sub: 'one of these two can be rebuilt for free, and the other cannot be rebuilt at all',
      cols: 2,
      children: [
        { id: 'w-cache', label: 'evicted cache', pattern: 'service', sub: 'lineage recomputes it — you lose time' },
        { id: 'w-exec', label: 'evicted execution state', pattern: 'warn', sub: 'mid-shuffle, that work is simply gone' },
      ],
    },
    {
      id: 'so',
      label: 'Protects the unrebuildable',
      pattern: 'service',
      icon: 'shield',
      sub: 'and your cache is the thing it is willing to lose',
    },
  ],
  edges: [
    { source: 'rule', target: 'why' },
    { source: 'why', target: 'so' },
  ],
}

export const oneParentThreeChildren: Scene = {
  id: 'mem-one-parent',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'One expensive parent, three things that want it',
      pattern: 'group',
      sub: 'an ordinary shape: read, clean, then answer three questions from the cleaned data',
      cols: 3,
      children: [
        { id: 'c1', label: 'count()', pattern: 'network', sub: 'job 1' },
        { id: 'c2', label: 'write(summary)', pattern: 'network', sub: 'job 2' },
        { id: 'c3', label: 'write(detail)', pattern: 'network', sub: 'job 3' },
      ],
    },
    {
      id: 'without',
      label: 'The parent runs 3×',
      pattern: 'warn',
      icon: 'repeat',
      sub: 'a recipe gets re-cooked, from the source, per action',
    },
    {
      id: 'with',
      label: 'With cache: once, then reused',
      pattern: 'group',
      sub: 'and this is the ONLY situation where caching reliably pays — a shared, expensive, reused parent',
      cols: 2,
      children: [
        { id: 'wi-first', label: 'the first action fills it', pattern: 'service', sub: 'cache() is lazy — nothing happens before' },
        { id: 'wi-rest', label: 'the rest read memory', pattern: 'service', sub: 'no re-read, no re-shuffle' },
      ],
    },
  ],
  edges: [
    { source: 'shape', target: 'without' },
    { source: 'without', target: 'with' },
  ],
}

export const cacheVsPersist: Scene = {
  id: 'mem-cache-vs-persist',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'cache',
      label: 'cache()',
      pattern: 'service',
      icon: 'zap',
      sub: 'persist() with the default level, and nothing else',
    },
    {
      id: 'defaults',
      label: 'And the default is not the same for both APIs',
      pattern: 'group',
      sub: 'a genuine trap: the same method name means two different things depending on what you call it on',
      cols: 2,
      children: [
        { id: 'd-rdd', label: 'rdd.cache()', pattern: 'warn', sub: 'MEMORY_ONLY — drops what does not fit' },
        { id: 'd-df', label: 'df.cache()', pattern: 'service', sub: 'MEMORY_AND_DISK — spills instead' },
      ],
    },
    {
      id: 'lazy',
      label: 'Both are lazy. unpersist() is not.',
      pattern: 'group',
      sub: 'marking something cached does nothing until an action fills it — and a partial action fills it partially',
      cols: 2,
      children: [
        { id: 'l-fill', label: 'df.cache(); df.count()', pattern: 'service', sub: 'count() is what materialises it' },
        { id: 'l-partial', label: 'df.cache(); df.take(1)', pattern: 'warn', sub: 'caches ONE partition, silently' },
      ],
    },
  ],
  edges: [
    { source: 'cache', target: 'defaults' },
    { source: 'defaults', target: 'lazy' },
  ],
}

export const storageLevels: Scene = {
  id: 'mem-storage-levels',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The storage levels, and when each is the right answer',
      sub: 'three independent choices — memory or disk, deserialized or serialized, replicated or not',
      headers: ['Level', 'What it does', 'Use when'],
      values: [
        ['MEMORY_ONLY', 'objects in memory; drops whole partitions that do not fit', 'the RDD default — rarely what you want'],
        ['MEMORY_AND_DISK', 'memory first, the rest serialized to disk', 'the DataFrame default, and the safe answer'],
        ['MEMORY_ONLY_SER', 'serialized in memory — smaller, CPU to decode', 'memory-bound and you can spare CPU'],
        ['DISK_ONLY', 'serialized on disk, always', 'recomputation costs more than a disk read'],
        ['..._2', 'any level, replicated to a second node', 'losing it would cost a very long recompute'],
        ['OFF_HEAP', 'outside the JVM heap, in Tungsten memory', 'GC pauses are the measured problem'],
      ],
    },
    {
      id: 'note',
      label: 'The _SER trade',
      pattern: 'network',
      icon: 'scale',
      sub: 'compact, but CPU to decode on every single read',
    },
  ],
  edges: [{ source: 'table', target: 'note' }],
}

export const whatEvictionDoes: Scene = {
  id: 'mem-eviction',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'lru',
      label: 'Eviction is LRU, and it works on whole partitions',
      pattern: 'group',
      sub: 'a partition is never half-cached — the unit that arrives is the unit that leaves',
      cols: 2,
      children: [
        { id: 'l-unit', label: 'the unit is a partition', pattern: 'network', sub: 'not a row, not a block of rows' },
        { id: 'l-order', label: 'least recently used first', pattern: 'network', sub: 'across everything cached' },
      ],
    },
    {
      id: 'after',
      label: 'And what happens next depends entirely on the level',
      pattern: 'group',
      sub: 'this is the whole practical difference between the two defaults from the last section',
      cols: 2,
      children: [
        { id: 'a-mem', label: 'MEMORY_ONLY → recomputed', pattern: 'warn', sub: 'the lineage runs again, silently' },
        { id: 'a-disk', label: 'MEMORY_AND_DISK → read back', pattern: 'service', sub: 'slower than memory, far faster than redoing it' },
      ],
    },
    {
      id: 'worst',
      label: 'The thrash',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'too big to fit → evict, recompute, evict, recompute',
    },
  ],
  edges: [
    { source: 'lru', target: 'after' },
    { source: 'after', target: 'worst' },
  ],
}

export const checkpoint: Scene = {
  id: 'mem-checkpoint',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'cache',
      label: 'cache() keeps the result AND the lineage',
      pattern: 'group',
      sub: 'it has to — if the cache is evicted, the lineage is the only way to get the data back',
      cols: 2,
      children: [
        { id: 'ca-data', label: 'the data, in memory', pattern: 'service', sub: 'and possibly on local disk' },
        { id: 'ca-graph', label: 'the whole graph', pattern: 'warn', sub: 'still hundreds of steps long' },
      ],
    },
    {
      id: 'check',
      label: 'checkpoint() writes to reliable storage and CUTS it',
      pattern: 'group',
      sub: 'setCheckpointDir first · the new lineage is one step: read this file',
      cols: 2,
      children: [
        { id: 'ch-data', label: 'the data, on HDFS or S3', pattern: 'service', sub: 'durable, not local' },
        { id: 'ch-graph', label: 'lineage: truncated', pattern: 'service', sub: 'the graph before it is discarded' },
      ],
    },
    {
      id: 'when',
      label: 'When you actually need it',
      pattern: 'group',
      sub: 'a loop that never ends: 200 iterations means a 200-deep graph the driver has to carry and replay',
      cols: 2,
      children: [
        { id: 'wh-iter', label: 'iterative algorithms', pattern: 'network', sub: 'ML, graph, anything converging' },
        { id: 'wh-stream', label: 'streaming state', pattern: 'network', sub: 'where it is not optional' },
      ],
    },
  ],
  edges: [
    { source: 'cache', target: 'check', label: 'cut the graph' },
    { source: 'check', target: 'when' },
  ],
}

export const spill: Scene = {
  id: 'mem-spill',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'Spilling is execution memory running out',
      pattern: 'group',
      sub: 'a sort or an aggregate is accumulating state and the pool will not stretch — so it writes a sorted run out',
      cols: 3,
      children: [
        { id: 'w-fill', label: 'the buffer fills', pattern: 'network', sub: 'mid-operation, not at the start' },
        { id: 'w-out', label: 'a sorted run to disk', pattern: 'warn', sub: 'serialized on the way out' },
        { id: 'w-back', label: 'and read back to merge', pattern: 'warn', sub: 'so you pay for it twice' },
      ],
    },
    {
      id: 'metrics',
      label: 'The two numbers in the UI, which measure different things',
      pattern: 'group',
      sub: 'a large memory figure against a small disk figure is normal — it is the same data, measured twice',
      cols: 2,
      children: [
        { id: 'm-mem', label: 'Spill (Memory)', pattern: 'network', sub: 'the size it had in memory, deserialized' },
        { id: 'm-disk', label: 'Spill (Disk)', pattern: 'network', sub: 'the size written, serialized and compressed' },
      ],
    },
    {
      id: 'fix',
      label: 'And the fix is almost never more memory',
      pattern: 'group',
      sub: 'spilling means the partition was too big — so make the partitions smaller, or stop one being huge',
      cols: 2,
      children: [
        { id: 'f-parts', label: 'more partitions', pattern: 'service', sub: 'each one smaller' },
        { id: 'f-skew', label: 'or fix the skew', pattern: 'service', sub: 'if only ONE task is spilling' },
      ],
    },
  ],
  edges: [
    { source: 'what', target: 'metrics' },
    { source: 'metrics', target: 'fix' },
  ],
}

export const offHeap: Scene = {
  id: 'mem-off-heap',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'What turning it on actually does',
      pattern: 'group',
      sub: 'spark.memory.offHeap.enabled plus a size — and the size is a SECOND budget, not a share of the first',
      cols: 2,
      children: [
        { id: 'w-alloc', label: 'Spark allocates directly', pattern: 'service', sub: 'through Unsafe, outside the heap' },
        { id: 'w-gc', label: 'the GC never traces it', pattern: 'service', sub: 'so it adds nothing to pause time' },
      ],
    },
    {
      id: 'cost',
      label: 'And what it costs you',
      pattern: 'group',
      sub: 'you have traded one number you had to get right for two numbers you have to get right',
      cols: 3,
      children: [
        { id: 'c-two', label: 'two pools to size', pattern: 'warn', sub: 'plenty of one, none of the other' },
        { id: 'c-k8s', label: 'it counts in the container', pattern: 'warn', sub: 'raise memoryOverhead, or be OOMKilled' },
        { id: 'c-leak', label: 'and leaks are yours', pattern: 'warn', sub: 'you opted out of the collector' },
      ],
    },
    {
      id: 'when',
      label: 'Only if GC is measured',
      pattern: 'service',
      icon: 'activity',
      sub: 'a third of task time — otherwise it changes nothing',
    },
  ],
  edges: [
    { source: 'what', target: 'cost' },
    { source: 'cost', target: 'when' },
  ],
}

export const readingTheStorageTab: Scene = {
  id: 'mem-storage-tab',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The Storage tab, and the Executors tab beside it',
      sub: 'four numbers that between them answer "is my caching doing anything at all"',
      headers: ['What to read', 'Healthy', 'What it means otherwise'],
      values: [
        ['Fraction Cached', '100%', 'below it — partitions are being evicted or were never filled'],
        ['Size in Memory', 'what you expected', 'far larger — deserialized objects are much bigger than the file'],
        ['Size on Disk', 'zero', 'non-zero — it did not fit, and MEMORY_AND_DISK caught it'],
        ['GC Time (Executors)', 'a few % of task time', 'a third — the heap is too full, cache included'],
        ['Nothing listed at all', '—', 'you cached it but never ran an action; cache() is lazy'],
      ],
    },
    {
      id: 'rule',
      label: 'The rule, in one line',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'expensive, shared, reused — and measured. Else do not.',
    },
  ],
  edges: [{ source: 'table', target: 'rule' }],
}

export const memoryScenes: Scene[] = [
  theExecutorBudget,
  storageVsExecution,
  whoWins,
  oneParentThreeChildren,
  cacheVsPersist,
  storageLevels,
  whatEvictionDoes,
  checkpoint,
  spill,
  offHeap,
  readingTheStorageTab,
]
