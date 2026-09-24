import type { Scene } from '@graphlearning/flow'

// Course 1 (origins) scenes. Eight sections, eight scenes, one file — each is small, and reading
// them in sequence is how the argument stays honest: a hardware limit forces distribution, MapReduce
// answers it with a disk round-trip per step, the round-trip forces a zoo of specialist engines, and
// Spark's bet is that removing the round-trip collapses the zoo back into one engine.
//
// Written to the layout limits enforced by scripts/lint-scenes.mjs — see ../shuffle/index.ts.

// §1 — where one machine stops. The point is that this is a HARDWARE fact, not a software choice.
export const theSingleMachine: Scene = {
  id: 'origins-single-machine',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'free-lunch',
      label: 'Until ~2005, programs got faster on their own',
      pattern: 'group',
      sub: 'each year the same code ran faster, because each year the clock went up — nobody had to do anything',
      cols: 3,
      children: [
        { id: 'y1', label: '1995 · 100 MHz', pattern: 'service', sub: 'same code' },
        { id: 'y2', label: '2000 · 1 GHz', pattern: 'service', sub: 'same code, 10× faster' },
        { id: 'y3', label: '2005 · 3 GHz', pattern: 'service', sub: 'and then it stopped' },
      ],
    },
    {
      id: 'wall',
      label: 'Heat, not ambition',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'clock speed stalled — power and heat scale faster than it does',
    },
    {
      id: 'after',
      label: 'The industry turned sideways instead',
      pattern: 'group',
      sub: 'more cores at the same speed — which means nothing gets faster unless the program is rewritten to use them',
      cols: 2,
      children: [
        { id: 'a-cores', label: 'more cores', pattern: 'network', sub: 'then more machines' },
        { id: 'a-cost', label: 'the cost moved', pattern: 'network', sub: 'to you, into the program' },
      ],
    },
  ],
  edges: [
    { source: 'free-lunch', target: 'wall' },
    { source: 'wall', target: 'after' },
  ],
}

// §2 — ship code to data. One inversion, drawn as a before/after, because it is the whole idea.
export const shipCodeToData: Scene = {
  id: 'origins-ship-code',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'old',
      label: 'The old shape — bring the data to the program',
      pattern: 'group',
      sub: 'works until the data is bigger than the pipe: a terabyte over a gigabit link is hours before any work starts',
      flow: 'LR',
      children: [
        { id: 'o-store', label: 'storage array', pattern: 'storage', sub: 'all the data, one place' },
        { id: 'o-pipe', label: 'the network', pattern: 'warn', sub: 'the bottleneck' },
        { id: 'o-cpu', label: 'one big server', pattern: 'service', sub: 'all the compute, one place' },
      ],
      edges: [
        { source: 'o-store', target: 'o-pipe' },
        { source: 'o-pipe', target: 'o-cpu' },
      ],
    },
    {
      id: 'new',
      label: 'The inversion — send the program to the data',
      pattern: 'group',
      sub: 'the program is kilobytes and the data is terabytes, so move the small thing — GFS and MapReduce, Google, 2003–04',
      cols: 3,
      children: [
        { id: 'n1', label: 'node 1', pattern: 'service', sub: 'its block + a copy of the code' },
        { id: 'n2', label: 'node 2', pattern: 'service', sub: 'its block + a copy of the code' },
        { id: 'n3', label: 'node 3', pattern: 'service', sub: 'its block + a copy of the code' },
      ],
    },
  ],
  edges: [{ source: 'old', target: 'new', label: 'move the kilobytes, not the terabytes' }],
}

// §3 — the disk tax. The cost that Spark exists to remove, so it gets the clearest frame in the course.
export const theDiskTax: Scene = {
  id: 'origins-disk-tax',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'MapReduce, three steps of one algorithm',
      pattern: 'group',
      sub: 'every step ends by writing its whole output to HDFS, and the next begins by reading it back — with replication',
      children: [
        { id: 'm1', label: 'step 1 · map + reduce', pattern: 'service', sub: 'compute in memory' },
        { id: 'd1', label: 'write to HDFS', pattern: 'warn', sub: 'to disk, then replicated ×3 over the network' },
        { id: 'm2', label: 'step 2 · map + reduce', pattern: 'service', sub: 'read it all back first' },
        { id: 'd2', label: 'write to HDFS', pattern: 'warn', sub: 'to disk, then replicated ×3, again' },
        { id: 'm3', label: 'step 3 · map + reduce', pattern: 'service', sub: 'read it all back again' },
      ],
      edges: [
        { source: 'm1', target: 'd1' },
        { source: 'd1', target: 'm2' },
        { source: 'm2', target: 'd2' },
        { source: 'd2', target: 'm3' },
      ],
    },
    {
      id: 'who-pays',
      label: 'Who this hurts most',
      pattern: 'group',
      sub: 'any algorithm whose steps are a loop rather than a line — which is most of the interesting ones',
      cols: 3,
      children: [
        { id: 'w-ml', label: 'machine learning', pattern: 'warn', sub: 'the same data, 100 iterations' },
        { id: 'w-graph', label: 'graph algorithms', pattern: 'warn', sub: 'PageRank, until it converges' },
        { id: 'w-interactive', label: 'interactive queries', pattern: 'warn', sub: 'a re-read for every question' },
      ],
    },
  ],
  edges: [{ source: 'chain', target: 'who-pays', label: 'the round-trip is per step' }],
}

// §4 — the zoo. Drawn as a ring of specialists around one storage layer, because "they all had to be
// learned, operated and kept in sync" is the cost, and that only reads as a diagram.
export const theEngineZoo: Scene = {
  id: 'origins-engine-zoo',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'zoo',
      label: 'One specialist engine per workload, each with its own everything',
      pattern: 'group',
      sub: 'a separate API, a separate cluster to operate, a separate failure model, and a separate set of people who know it',
      cols: 3,
      children: [
        { id: 'z-hive', label: 'Hive', pattern: 'network', sub: 'SQL over MapReduce' },
        { id: 'z-storm', label: 'Storm', pattern: 'network', sub: 'stream processing' },
        { id: 'z-impala', label: 'Impala', pattern: 'network', sub: 'interactive SQL' },
        { id: 'z-giraph', label: 'Giraph', pattern: 'network', sub: 'graph processing' },
        { id: 'z-mahout', label: 'Mahout', pattern: 'network', sub: 'machine learning' },
        { id: 'z-drill', label: 'Drill', pattern: 'network', sub: 'ad-hoc queries' },
      ],
    },
    {
      id: 'glue',
      label: 'And the real work was between them',
      pattern: 'group',
      sub: 'a pipeline crossing three engines wrote to disk at every border, because nothing else could be shared',
      cols: 2,
      children: [
        { id: 'g-copy', label: 'data copied between', pattern: 'warn', sub: 'formats converted at every hop' },
        { id: 'g-ops', label: 'four clusters to run', pattern: 'warn', sub: 'and four things to be paged about' },
      ],
    },
  ],
  edges: [{ source: 'zoo', target: 'glue' }],
}

// §5 — the bet. Two things kept, one thing changed. That framing is the section.
export const theBet: Scene = {
  id: 'origins-the-bet',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'keep',
      label: 'Keep what MapReduce got right',
      pattern: 'group',
      sub: 'UC Berkeley AMPLab, 2009 — the distribution model was never the problem',
      cols: 2,
      children: [
        { id: 'k-par', label: 'data parallelism', pattern: 'service', sub: 'partition it, run the same code on each' },
        { id: 'k-ft', label: 'fault tolerance', pattern: 'service', sub: 'a node dies, the work is redone' },
      ],
    },
    {
      id: 'change',
      label: 'Change one thing',
      pattern: 'warn',
      icon: 'zap',
      sub: 'keep intermediate results in memory between steps',
    },
    {
      id: 'follows',
      label: 'What falls out of that single change',
      pattern: 'group',
      sub: 'not a faster MapReduce — a different set of things it is possible to write at all',
      cols: 3,
      children: [
        { id: 'f-iter', label: 'iteration is cheap', pattern: 'network', sub: 'loop over cached data, not disk' },
        { id: 'f-interactive', label: 'queries feel live', pattern: 'network', sub: 'seconds, not minutes' },
        { id: 'f-lineage', label: 'and still fault-tolerant', pattern: 'network', sub: 'lineage replaces replication' },
      ],
    },
  ],
  edges: [
    { source: 'keep', target: 'change' },
    { source: 'change', target: 'follows' },
  ],
}

// §6 — one engine. The zoo from §4, collapsed. Same subject, opposite shape, on purpose.
export const oneEngine: Scene = {
  id: 'origins-one-engine',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'libs',
      label: 'The libraries you choose between',
      pattern: 'group',
      sub: 'each one replaces a whole engine from the zoo — and they compose, because they share the layer below',
      cols: 4,
      children: [
        { id: 'l-sql', label: 'Spark SQL', pattern: 'network', sub: 'replaces Hive and Impala' },
        { id: 'l-stream', label: 'Structured Streaming', pattern: 'network', sub: 'replaces Storm' },
        { id: 'l-ml', label: 'MLlib', pattern: 'network', sub: 'replaces Mahout' },
        { id: 'l-graph', label: 'GraphX', pattern: 'network', sub: 'replaces Giraph' },
      ],
    },
    {
      id: 'core',
      label: 'One core engine',
      pattern: 'service',
      icon: 'cpu',
      sub: 'all four compile to the same DAG of tasks',
    },
    {
      id: 'payoff',
      label: 'Why sharing the layer below is the whole point',
      pattern: 'group',
      sub: 'a SQL read feeding an ML model is one plan, not two systems handing files to each other',
      cols: 2,
      children: [
        { id: 'p-nodisk', label: 'no disk at the borders', pattern: 'service', sub: 'the handoff stays in memory' },
        { id: 'p-opt', label: 'optimized across them', pattern: 'service', sub: 'a filter can move into the scan' },
      ],
    },
  ],
  edges: [
    { source: 'libs', target: 'core' },
    { source: 'core', target: 'payoff' },
  ],
}

// §7 — compute, not storage. A deliberate omission is hard to see; drawing the gap is the point.
export const computeNotStorage: Scene = {
  id: 'origins-compute-not-storage',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'hadoop',
      label: 'Hadoop shipped both halves, welded together',
      pattern: 'group',
      sub: 'HDFS and MapReduce were one product — you could not sensibly take one without the other',
      flow: 'LR',
      children: [
        { id: 'h-store', label: 'HDFS', pattern: 'storage', sub: 'the storage half' },
        { id: 'h-compute', label: 'MapReduce', pattern: 'service', sub: 'the compute half' },
      ],
    },
    {
      id: 'spark',
      label: 'Spark ships only the compute half',
      pattern: 'group',
      sub: 'it reads and writes, and owns nothing long-term — the deliberate gap where a storage system goes',
      cols: 4,
      children: [
        { id: 's-s3', label: 'S3 · ADLS · GCS', pattern: 'storage', sub: 'object storage' },
        { id: 's-hdfs', label: 'HDFS', pattern: 'storage', sub: 'still supported' },
        { id: 's-db', label: 'JDBC · Cassandra', pattern: 'storage', sub: 'databases' },
        { id: 's-kafka', label: 'Kafka · Kinesis', pattern: 'storage', sub: 'message buses' },
      ],
    },
    {
      id: 'buys',
      label: 'What the omission buys, and what it costs',
      pattern: 'group',
      sub: 'this one decision is why Spark outlived the Hadoop stack it was born inside',
      cols: 2,
      children: [
        { id: 'b-cloud', label: 'storage scales alone', pattern: 'service', sub: 'buy compute and storage separately' },
        { id: 'b-cost', label: 'nothing is transactional', pattern: 'warn', sub: 'no owner means no guarantees' },
      ],
    },
  ],
  edges: [
    { source: 'hadoop', target: 'spark', label: 'unweld them' },
    { source: 'spark', target: 'buys' },
  ],
}

// §8 — the timeline, as the course's closer. Each date is chosen for what it CHANGED, not for being
// a date: the API generation each one opened is what the rest of this concept is about.
export const theTimeline: Scene = {
  id: 'origins-timeline',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'early',
      label: 'The RDD era',
      pattern: 'group',
      sub: 'you wrote the plan yourself — map, filter, reduceByKey — and Spark ran exactly what you wrote',
      flow: 'LR',
      children: [
        { id: 't-2009', label: '2009 · AMPLab', pattern: 'service', sub: 'a research project at Berkeley' },
        { id: 't-2013', label: '2013 · Apache', pattern: 'service', sub: 'donated; Databricks founded' },
        { id: 't-2014', label: '2014 · 1.0', pattern: 'service', sub: 'RDDs are the API' },
      ],
    },
    {
      id: 'structured',
      label: 'The structured era',
      pattern: 'warn',
      icon: 'gitbranch',
      sub: '2016 · Spark 2.0 · DataFrames — an optimizer picks the plan',
    },
    {
      id: 'adaptive',
      label: 'The adaptive era',
      pattern: 'group',
      sub: 'the plan stops being fixed before the job starts, and is re-decided from real measurements mid-flight',
      flow: 'LR',
      children: [
        { id: 't-2020', label: '2020 · 3.0', pattern: 'network', sub: 'AQE and dynamic pruning arrive' },
        { id: 't-32', label: '2021 · 3.2', pattern: 'network', sub: 'AQE on by default' },
        { id: 't-now', label: '4.x today', pattern: 'network', sub: 'and this is where you start' },
      ],
    },
  ],
  edges: [
    { source: 'early', target: 'structured', label: 'stop writing the plan' },
    { source: 'structured', target: 'adaptive', label: 'stop fixing the plan' },
  ],
}

export const originsScenes: Scene[] = [
  theSingleMachine,
  shipCodeToData,
  theDiskTax,
  theEngineZoo,
  theBet,
  oneEngine,
  computeNotStorage,
  theTimeline,
]
