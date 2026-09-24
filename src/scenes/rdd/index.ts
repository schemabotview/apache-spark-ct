import type { Scene } from '@graphlearning/flow'

// Course 3 (rdd) scenes. The RDD is the abstraction everything else in Spark is built on, and the
// course's job is to show that it is a much smaller idea than its reputation: five properties, and
// every famous Spark behaviour falls out of one of them. So the scenes keep returning to that list.
//
// This is the course where Learning Spark 1E earns its place as a source — its chapters 3 and 4 are
// still the clearest account of partitions, lineage and narrow-vs-wide dependency in any of the four.

export const fiveProperties: Scene = {
  id: 'rdd-five-properties',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'required',
      label: 'The three every RDD must have',
      pattern: 'group',
      sub: 'this is the whole interface — an RDD is a description of how to produce data, not the data',
      cols: 3,
      children: [
        { id: 'p-parts', label: 'a list of partitions', pattern: 'storage', sub: 'the pieces it splits into' },
        { id: 'p-compute', label: 'a compute function', pattern: 'service', sub: 'how to produce one partition' },
        { id: 'p-deps', label: 'its dependencies', pattern: 'network', sub: 'which parents it was built from' },
      ],
    },
    {
      id: 'optional',
      label: 'And two that are optional',
      pattern: 'group',
      sub: 'both are hints to the scheduler — they change how the work is placed, never what it computes',
      cols: 2,
      children: [
        { id: 'p-partitioner', label: 'a partitioner', pattern: 'network', sub: 'how keys map to partitions, if keyed' },
        { id: 'p-locality', label: 'preferred locations', pattern: 'network', sub: 'where each partition would rather run' },
      ],
    },
    {
      id: 'claim',
      label: 'That is the whole of it',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'every famous Spark behaviour falls out of one of these five',
    },
  ],
  edges: [
    { source: 'required', target: 'optional' },
    { source: 'optional', target: 'claim' },
  ],
}

export const thePartition: Scene = {
  id: 'rdd-partition',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'split',
      label: 'One logical collection, many physical pieces',
      pattern: 'group',
      sub: 'you write code against the whole thing; Spark runs it once per partition, in parallel',
      cols: 4,
      children: [
        { id: 'pa', label: 'partition 0', pattern: 'storage', sub: 'on host A' },
        { id: 'pb', label: 'partition 1', pattern: 'storage', sub: 'on host B' },
        { id: 'pc', label: 'partition 2', pattern: 'storage', sub: 'on host C' },
        { id: 'pd', label: 'partition 3', pattern: 'storage', sub: 'on host A' },
      ],
    },
    {
      id: 'ceiling',
      label: 'min(partitions, slots)',
      pattern: 'warn',
      icon: 'ruler',
      sub: '1000 partitions on 4 cores is still 4 at a time',
    },
    {
      id: 'where',
      label: 'Where the count comes from',
      pattern: 'group',
      sub: 'nobody sets this once — it changes at every read and at every shuffle, and both defaults are guesses',
      cols: 3,
      children: [
        { id: 'w-read', label: 'on read', pattern: 'network', sub: 'file size ÷ maxPartitionBytes (128 MB)' },
        { id: 'w-shuffle', label: 'after a shuffle', pattern: 'network', sub: 'spark.sql.shuffle.partitions (200)' },
        { id: 'w-manual', label: 'when you say so', pattern: 'network', sub: 'repartition · coalesce' },
      ],
    },
  ],
  edges: [
    { source: 'split', target: 'ceiling' },
    { source: 'ceiling', target: 'where' },
  ],
}

export const immutability: Scene = {
  id: 'rdd-immutability',
  padding: 0.14,
  flow: 'LR',
  nodes: [
    {
      id: 'chain',
      label: 'Nothing is ever modified — each step describes a NEW collection',
      pattern: 'group',
      sub: 'rddB does not change rddA; it records that it is rddA with a filter applied',
      flow: 'LR',
      children: [
        { id: 'a', label: 'rddA', pattern: 'storage', sub: 'read from a file' },
        { id: 'b', label: 'rddB', pattern: 'service', sub: '= rddA, filtered' },
        { id: 'c', label: 'rddC', pattern: 'service', sub: '= rddB, mapped' },
      ],
      edges: [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
      ],
    },
    {
      id: 'buys',
      label: 'What immutability buys',
      pattern: 'group',
      sub: 'three properties that are hard to retrofit and free if you start here',
      cols: 3,
      children: [
        { id: 'bu-safe', label: 'no locking needed', pattern: 'network', sub: 'nothing can be written concurrently' },
        { id: 'bu-redo', label: 'safely recomputable', pattern: 'network', sub: 'the same inputs give the same answer' },
        { id: 'bu-share', label: 'freely shareable', pattern: 'network', sub: 'two branches can read one parent' },
      ],
    },
  ],
  edges: [{ source: 'chain', target: 'buys' }],
}

export const lineage: Scene = {
  id: 'rdd-lineage',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'graph',
      label: 'The lineage graph — every RDD knows its parents',
      pattern: 'group',
      sub: 'built on the driver as you write transformations, all the way back to something durable on disk',
      flow: 'LR',
      children: [
        { id: 'l-file', label: 'the file', pattern: 'storage', sub: 'durable — the root' },
        { id: 'l-1', label: 'filtered', pattern: 'service', sub: 'narrow' },
        { id: 'l-2', label: 'mapped', pattern: 'service', sub: 'narrow' },
        { id: 'l-3', label: 'grouped', pattern: 'warn', sub: 'wide' },
      ],
      edges: [
        { source: 'l-file', target: 'l-1' },
        { source: 'l-1', target: 'l-2' },
        { source: 'l-2', target: 'l-3' },
      ],
    },
    {
      id: 'loss',
      label: 'A machine dies',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'no replica exists — and none is needed',
    },
    {
      id: 'recover',
      label: 'The recovery, which is just the graph read backwards',
      pattern: 'group',
      sub: 'only the lost partition is rebuilt — not the RDD, not the stage, not the job',
      cols: 3,
      children: [
        { id: 'r-which', label: 'which parents fed it', pattern: 'network', sub: 'the graph already says' },
        { id: 'r-redo', label: 'redo that path', pattern: 'network', sub: 'for that one partition' },
        { id: 'r-done', label: 'carry on', pattern: 'service', sub: 'slower, not failed' },
      ],
    },
  ],
  edges: [
    { source: 'graph', target: 'loss' },
    { source: 'loss', target: 'recover', label: 'the plan IS the backup' },
  ],
}

export const narrowDependency: Scene = {
  id: 'rdd-narrow',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'Narrow — each output partition reads exactly one input',
      pattern: 'group',
      sub: 'map · filter · flatMap · mapPartitions · union — no row ever needs to know about another partition',
      cols: 3,
      children: [
        { id: 'n-a', label: 'partition 0 → 0′', pattern: 'service', sub: 'host A, start to finish' },
        { id: 'n-b', label: 'partition 1 → 1′', pattern: 'service', sub: 'host B, start to finish' },
        { id: 'n-c', label: 'partition 2 → 2′', pattern: 'service', sub: 'host C, start to finish' },
      ],
    },
    {
      id: 'gifts',
      label: 'Three things this buys, all at once',
      pattern: 'group',
      sub: 'the reason Spark works hard to keep a run of operations narrow for as long as it can',
      cols: 3,
      children: [
        { id: 'g-pipe', label: 'pipelining', pattern: 'network', sub: 'ten narrow steps, one pass over the rows' },
        { id: 'g-local', label: 'no network', pattern: 'network', sub: 'the work happens where the data is' },
        { id: 'g-cheap', label: 'cheap recovery', pattern: 'network', sub: 'one lost partition, one parent to redo' },
      ],
    },
  ],
  edges: [{ source: 'shape', target: 'gifts' }],
}

export const wideDependency: Scene = {
  id: 'rdd-wide',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'Wide — an output partition needs rows from many inputs',
      pattern: 'group',
      sub: 'groupByKey · reduceByKey · join · distinct · sortBy — every input can contribute to every output',
      cols: 2,
      children: [
        { id: 'w-in', label: 'every input partition', pattern: 'storage', sub: 'holds a bit of every key' },
        { id: 'w-out', label: 'every output partition', pattern: 'warn', sub: 'needs a bit from every input' },
      ],
      edges: [{ source: 'w-in', target: 'w-out' }],
    },
    {
      id: 'costs',
      label: 'Everything narrow gave you, taken back',
      pattern: 'group',
      sub: 'one wide dependency undoes all three gifts at once — which is why the count of them is the cost of the job',
      cols: 3,
      children: [
        { id: 'c-pipe', label: 'pipelining ends', pattern: 'warn', sub: 'a stage boundary, here' },
        { id: 'c-net', label: 'the network', pattern: 'warn', sub: 'written to disk, then fetched' },
        { id: 'c-redo', label: 'recovery is costly', pattern: 'warn', sub: 'one lost partition, MANY parents' },
      ],
    },
  ],
  edges: [{ source: 'shape', target: 'costs' }],
}

export const recomputeNotReplicate: Scene = {
  id: 'rdd-recompute',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'hdfs',
      label: 'MapReduce — buy safety with copies',
      pattern: 'group',
      sub: 'write every intermediate result three times, so losing one machine loses nothing',
      cols: 2,
      children: [
        { id: 'h-cost', label: '3× the storage', pattern: 'warn', sub: 'and 3× the write traffic' },
        { id: 'h-when', label: 'paid always', pattern: 'warn', sub: 'even when nothing fails' },
      ],
    },
    {
      id: 'spark',
      label: 'Spark — buy safety with a recipe',
      pattern: 'group',
      sub: 'keep the lineage graph instead of the copies: a few kilobytes on the driver, per job',
      cols: 2,
      children: [
        { id: 's-cost', label: 'nearly free', pattern: 'service', sub: 'a graph, not a dataset' },
        { id: 's-when', label: 'paid on failure', pattern: 'service', sub: 'and only for what was lost' },
      ],
    },
    {
      id: 'condition',
      label: 'The condition',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'every transformation must be deterministic, or recovery lies',
    },
  ],
  edges: [
    { source: 'hdfs', target: 'spark', label: 'trade copies for a graph' },
    { source: 'spark', target: 'condition' },
  ],
}

export const preferredLocations: Scene = {
  id: 'rdd-locality',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ask',
      label: 'Send the task to the data',
      pattern: 'service',
      icon: 'mapPin',
      sub: 'moving a task is free · moving a partition is not',
    },
    {
      id: 'levels',
      label: 'The levels it will settle for, best first',
      pattern: 'group',
      sub: 'it waits briefly for a better level before giving up — spark.locality.wait, 3 seconds by default',
      cols: 4,
      children: [
        { id: 'lv-1', label: 'PROCESS_LOCAL', pattern: 'service', sub: 'same JVM — already cached here' },
        { id: 'lv-2', label: 'NODE_LOCAL', pattern: 'network', sub: 'same machine, another process' },
        { id: 'lv-3', label: 'RACK_LOCAL', pattern: 'network', sub: 'same rack, over the network' },
        { id: 'lv-4', label: 'ANY', pattern: 'warn', sub: 'anywhere — ship the data' },
      ],
    },
    {
      id: 'sign',
      label: 'What it looks like when this is hurting you',
      pattern: 'group',
      sub: 'the locality column in the Stages tab is the fastest read on whether placement is working',
      cols: 2,
      children: [
        { id: 'sg-any', label: 'mostly ANY', pattern: 'warn', sub: 'every task is pulling its input over the wire' },
        { id: 'sg-wait', label: 'idle slots, then a rush', pattern: 'warn', sub: 'it is waiting out locality.wait' },
      ],
    },
  ],
  edges: [
    { source: 'ask', target: 'levels' },
    { source: 'levels', target: 'sign' },
  ],
}

export const pairRdds: Scene = {
  id: 'rdd-pairs',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'Just (key, value) tuples',
      pattern: 'service',
      icon: 'key',
      sub: 'no new type — but the key is what every distributed op needs',
    },
    {
      id: 'unlocks',
      label: 'What having a key unlocks',
      pattern: 'group',
      sub: 'partitioning, grouping and joining are all "put the same key in the same place" — they need a key to exist',
      cols: 3,
      children: [
        { id: 'u-group', label: 'groupByKey', pattern: 'network', sub: 'all values for one key, together' },
        { id: 'u-reduce', label: 'reduceByKey', pattern: 'network', sub: 'combine them as they arrive' },
        { id: 'u-join', label: 'join', pattern: 'network', sub: 'match keys across two collections' },
      ],
    },
    {
      id: 'classic',
      label: 'The oldest optimisation in Spark, and still the clearest',
      pattern: 'group',
      sub: 'both give the same answer; one of them moves a hundredth of the data',
      cols: 2,
      children: [
        { id: 'cl-bad', label: 'groupByKey then sum', pattern: 'warn', sub: 'every row crosses the network' },
        { id: 'cl-good', label: 'reduceByKey', pattern: 'service', sub: 'summed per partition FIRST, then sent' },
      ],
    },
  ],
  edges: [
    { source: 'shape', target: 'unlocks' },
    { source: 'unlocks', target: 'classic' },
  ],
}

export const whenRddsWin: Scene = {
  id: 'rdd-when-still',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'default',
      label: 'The default is: do not',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'an RDD is opaque to the optimizer — you get exactly what you wrote',
    },
    {
      id: 'lost',
      label: 'What you give up by dropping to RDDs',
      pattern: 'group',
      sub: 'the structured API knows your rows have a schema; the RDD API knows only that they are objects',
      cols: 3,
      children: [
        { id: 'ls-cat', label: 'no Catalyst', pattern: 'warn', sub: 'no pushdown, no reordering' },
        { id: 'ls-tung', label: 'no Tungsten', pattern: 'warn', sub: 'JVM objects, not binary rows' },
        { id: 'ls-aqe', label: 'no AQE', pattern: 'warn', sub: 'nothing re-plans at runtime' },
      ],
    },
    {
      id: 'still',
      label: 'The narrow set of cases that still justify them',
      pattern: 'group',
      sub: 'each one is a thing the structured API genuinely cannot express, not a preference',
      cols: 3,
      children: [
        { id: 'st-unstructured', label: 'truly unstructured input', pattern: 'service', sub: 'before any schema exists' },
        { id: 'st-control', label: 'you need the partitioner', pattern: 'service', sub: 'custom placement, by hand' },
        { id: 'st-lowlevel', label: 'per-partition control', pattern: 'service', sub: 'one connection per partition' },
      ],
    },
  ],
  edges: [
    { source: 'default', target: 'lost' },
    { source: 'lost', target: 'still', label: 'unless' },
  ],
}

export const rddScenes: Scene[] = [
  fiveProperties,
  thePartition,
  immutability,
  lineage,
  narrowDependency,
  wideDependency,
  recomputeNotReplicate,
  preferredLocations,
  pairRdds,
  whenRddsWin,
]
