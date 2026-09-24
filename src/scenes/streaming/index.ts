import type { Scene } from '@graphlearning/flow'

// Course 13 (streaming) scenes. The through-line is that Structured Streaming is not a second
// engine — it is the batch engine run incrementally over a table that keeps growing. So §§1–4 are
// that claim and its machinery, §§5–7 are the durability that makes it trustworthy, and §§8–12 are
// the one genuinely new problem: time, and the state that keeping track of time requires.
//
// Learning Spark 1E is deliberately ignored as a source for this course: its streaming chapter is
// DStreams, which Structured Streaming replaced.

export const theUnboundedTable: Scene = {
  id: 'str-unbounded-table',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      label: 'A stream is a table that rows keep being appended to',
      pattern: 'group',
      sub: 'not a sequence of events to react to — a table, which happens never to be finished',
      flow: 'LR',
      children: [
        { id: 't-1', label: 'rows so far', pattern: 'service', sub: 'processed' },
        { id: 't-2', label: 'new rows', pattern: 'network', sub: 'arriving now' },
        { id: 't-3', label: '…', pattern: 'warn', sub: 'and it never ends' },
      ],
    },
    {
      id: 'query',
      label: 'Query it as a table',
      pattern: 'service',
      icon: 'filecode',
      sub: 'the same groupBy you would write over a finished table, unchanged',
    },
    {
      id: 'result',
      label: 'The result table, kept up to date',
      pattern: 'group',
      sub: 'conceptually recomputed from the whole input every time — and then made efficient, which is §4',
      cols: 2,
      children: [
        { id: 'r-think', label: 'think: recomputed', pattern: 'network', sub: 'the model you reason with' },
        { id: 'r-run', label: 'run: incrementally', pattern: 'service', sub: 'what actually happens' },
      ],
    },
  ],
  edges: [
    { source: 'table', target: 'query' },
    { source: 'query', target: 'result' },
  ],
}

export const theSameEngine: Scene = {
  id: 'str-same-engine',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'batch',
      label: 'Batch',
      pattern: 'network',
      icon: 'filecode',
      sub: 'spark.read · df.groupBy(…).count() · df.write',
    },
    {
      id: 'stream',
      label: 'Streaming',
      pattern: 'network',
      icon: 'activity',
      sub: 'spark.readStream · the SAME line · df.writeStream',
    },
    {
      id: 'shared',
      label: 'Everything between the first line and the last is identical',
      pattern: 'group',
      sub: 'same parser, same analyzer, same Catalyst rules, same Tungsten codegen, same shuffle',
      cols: 3,
      children: [
        { id: 's-cat', label: 'Catalyst', pattern: 'service', sub: 'the same optimizer' },
        { id: 's-tun', label: 'Tungsten', pattern: 'service', sub: 'the same generated code' },
        { id: 's-shuf', label: 'the same shuffle', pattern: 'service', sub: 'and the same skew problems' },
      ],
    },
  ],
  edges: [
    { source: 'batch', target: 'shared' },
    { source: 'stream', target: 'shared' },
  ],
}

export const theTrigger: Scene = {
  id: 'str-trigger',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'The trigger decides WHEN a batch runs — and nothing else changes',
      sub: 'the same query, the same output; only the rhythm of execution differs',
      headers: ['Trigger', 'What it does', 'Use when'],
      values: [
        ['default', 'a new micro-batch as soon as the last finishes', 'lowest latency, and you accept variable batch sizes'],
        ['processingTime("1 minute")', 'one batch a minute, on the clock', 'a predictable rhythm; skips if a batch overruns'],
        ['availableNow', 'process everything waiting, then stop', 'a scheduled job that catches up and exits'],
        ['continuous (experimental)', 'record at a time, ~1 ms latency', 'rarely — it supports only map-like operations'],
      ],
    },
    {
      id: 'note',
      label: 'availableNow: the missed one',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'a batch job that remembers where it stopped',
    },
  ],
  edges: [{ source: 'table', target: 'note' }],
}

export const incrementalExecution: Scene = {
  id: 'str-incremental',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'naive',
      label: 'Recompute everything?',
      pattern: 'warn',
      icon: 'repeat',
      sub: 'correct, and impossible — the input grows forever',
    },
    {
      id: 'real',
      label: 'So the engine keeps the RUNNING RESULT instead',
      pattern: 'group',
      sub: 'a count per key, updated by the new rows — the answer is the same, the work is proportional to what arrived',
      cols: 3,
      children: [
        { id: 'r-old', label: 'state: dest → 1,204', pattern: 'service', sub: 'what the last batch left' },
        { id: 'r-new', label: '+ 17 new rows', pattern: 'network', sub: 'this batch’s input' },
        { id: 'r-out', label: '= 1,221', pattern: 'service', sub: 'and the state is updated' },
      ],
    },
    {
      id: 'cost',
      label: 'Which introduces STATE',
      pattern: 'warn',
      icon: 'database',
      sub: 'it must survive between batches, and across restarts',
    },
  ],
  edges: [
    { source: 'naive', target: 'real' },
    { source: 'real', target: 'cost' },
  ],
}

export const theOffsetLog: Scene = {
  id: 'str-offset-log',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'dir',
      label: 'The checkpoint directory',
      pattern: 'group',
      sub: 'not an optimisation — the query’s identity. Delete it and you have a different query with no memory.',
      cols: 2,
      children: [
        { id: 'd-off', label: 'offsets/', pattern: 'warn', sub: 'what this batch WILL process — written first' },
        { id: 'd-com', label: 'commits/', pattern: 'service', sub: 'what a batch DID process — written after' },
        { id: 'd-state', label: 'state/', pattern: 'network', sub: 'the running aggregates' },
        { id: 'd-meta', label: 'metadata', pattern: 'network', sub: 'the query id' },
      ],
    },
    {
      id: 'order',
      label: 'Write-ahead, and the order is the whole point',
      pattern: 'group',
      sub: 'the offset is recorded BEFORE the work, so a crash can be distinguished from a completion',
      cols: 2,
      children: [
        { id: 'o-crash', label: 'offset but no commit', pattern: 'warn', sub: 'it crashed — redo that batch' },
        { id: 'o-ok', label: 'offset and commit', pattern: 'service', sub: 'it finished — move on' },
      ],
    },
    {
      id: 'result',
      label: 'Replay, not guesswork',
      pattern: 'service',
      icon: 'rotateCcw',
      sub: 'restart reprocesses exactly the batch that was in flight',
    },
  ],
  edges: [
    { source: 'dir', target: 'order' },
    { source: 'order', target: 'result' },
  ],
}

export const outputModes: Scene = {
  id: 'str-output-modes',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'Output modes — what gets written out of the result table',
      sub: 'not a preference: each one is legal only for certain queries, and the errors say so at start-up',
      headers: ['Mode', 'Writes', 'Constraint'],
      values: [
        ['append', 'only rows that will never change again', 'aggregations need a watermark, so Spark knows when that is'],
        ['update', 'rows that changed in this batch', 'the sink must handle an upsert, not just an insert'],
        ['complete', 'the whole result table, every batch', 'aggregations only — and the state can never be dropped'],
      ],
    },
    {
      id: 'trap',
      label: 'complete ends in tears',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'every key ever seen, held forever, rewritten each batch',
    },
  ],
  edges: [{ source: 'table', target: 'trap' }],
}

export const sinksAndIdempotence: Scene = {
  id: 'str-sinks',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'three',
      label: 'Exactly-once needs three things, and Spark provides two',
      pattern: 'group',
      sub: 'the third is the sink’s, and no amount of Spark configuration can supply it',
      cols: 3,
      children: [
        { id: 't-src', label: 'a replayable source', pattern: 'service', sub: 'Kafka, files — ask again by offset' },
        { id: 't-det', label: 'deterministic compute', pattern: 'service', sub: 'same input, same output' },
        { id: 't-sink', label: 'an idempotent sink', pattern: 'warn', sub: 'writing twice = writing once' },
      ],
    },
    {
      id: 'why',
      label: 'A retry writes twice',
      pattern: 'warn',
      icon: 'copy',
      sub: 'replay gives at-least-once · the sink must do the rest',
    },
    {
      id: 'how',
      label: 'How a sink can manage it',
      pattern: 'group',
      sub: 'file and Delta sinks handle this for you; anything you write by hand does not',
      cols: 3,
      children: [
        { id: 'h-file', label: 'file sink', pattern: 'service', sub: 'a manifest of committed files' },
        { id: 'h-delta', label: 'a transactional table', pattern: 'service', sub: 'one atomic commit per batch' },
        { id: 'h-batch', label: 'foreachBatch + MERGE', pattern: 'network', sub: 'upsert on a key, with a batch id' },
      ],
    },
  ],
  edges: [
    { source: 'three', target: 'why' },
    { source: 'why', target: 'how' },
  ],
}

export const eventTime: Scene = {
  id: 'str-event-time',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two clocks, and only one of them is about your data',
      pattern: 'group',
      sub: 'they are usually close, and the gap is exactly where the difficulty of streaming lives',
      cols: 2,
      children: [
        { id: 'tw-event', label: 'event time', pattern: 'service', sub: 'when it happened · a column in the row' },
        { id: 'tw-proc', label: 'processing time', pattern: 'warn', sub: 'when Spark saw it · an accident of the day' },
      ],
    },
    {
      id: 'gap',
      label: 'Why they come apart',
      pattern: 'group',
      sub: 'every one of these is ordinary operations, not a malfunction — and each widens the gap',
      cols: 3,
      children: [
        { id: 'g-mobile', label: 'a phone was offline', pattern: 'network', sub: 'events arrive hours late' },
        { id: 'g-retry', label: 'a broker retried', pattern: 'network', sub: 'out of order, not just late' },
        { id: 'g-restart', label: 'the job was restarted', pattern: 'network', sub: 'an hour of backlog, at once' },
      ],
    },
    {
      id: 'rule',
      label: 'So aggregate on event time',
      pattern: 'service',
      icon: 'clock',
      sub: 'processing time depends on when the job happened to run',
    },
  ],
  edges: [
    { source: 'two', target: 'gap' },
    { source: 'gap', target: 'rule' },
  ],
}

export const windows: Scene = {
  id: 'str-windows',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'why',
      label: 'A bounded question',
      pattern: 'service',
      icon: 'crop',
      sub: '"how many?" has no answer · "how many by 09:10?" does',
    },
    {
      id: 'kinds',
      label: 'Three shapes of window',
      pattern: 'group',
      sub: 'the cost differs: a row lands in one tumbling window, and in several sliding ones',
      cols: 3,
      children: [
        { id: 'k-tumb', label: 'tumbling', pattern: 'service', sub: 'fixed, no overlap · one window per row' },
        { id: 'k-slide', label: 'sliding', pattern: 'network', sub: 'overlapping · a row counts in several' },
        { id: 'k-sess', label: 'session', pattern: 'network', sub: 'grows with activity, closes on a gap' },
      ],
    },
    {
      id: 'cost',
      label: 'Each window is state',
      pattern: 'warn',
      icon: 'database',
      sub: 'so a window that never closes is a leak',
    },
  ],
  edges: [
    { source: 'why', target: 'kinds' },
    { source: 'kinds', target: 'cost' },
  ],
}

export const watermarks: Scene = {
  id: 'str-watermarks',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'When can state be dropped?',
      pattern: 'warn',
      icon: 'helpCircle',
      sub: 'never, without a rule — 09:00 may arrive tomorrow',
    },
    {
      id: 'promise',
      label: 'A watermark is a promise you make about lateness',
      pattern: 'group',
      sub: 'withWatermark("ts", "10 minutes") — the threshold is subtracted from the latest event time SEEN',
      cols: 2,
      children: [
        { id: 'p-say', label: 'you say: 10 minutes', pattern: 'service', sub: 'nothing later than that matters' },
        { id: 'p-do', label: 'Spark then drops state', pattern: 'service', sub: 'for windows the watermark has passed' },
      ],
    },
    {
      id: 'trade',
      label: 'And the trade it forces you to make explicitly',
      pattern: 'group',
      sub: 'there is no setting that gives you both — the honest answer is a number chosen from your data',
      cols: 2,
      children: [
        { id: 'tr-short', label: 'too short', pattern: 'warn', sub: 'late rows silently dropped' },
        { id: 'tr-long', label: 'too long', pattern: 'warn', sub: 'state grows, latency grows' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'promise' },
    { source: 'promise', target: 'trade' },
  ],
}

export const theStateStore: Scene = {
  id: 'str-state-store',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'what',
      label: 'Where a running aggregate actually lives',
      pattern: 'group',
      sub: 'partitioned by the grouping key, versioned per batch, and written to the checkpoint so a restart can resume',
      cols: 2,
      children: [
        { id: 'w-mem', label: 'in the executor', pattern: 'service', sub: 'for speed, during the batch' },
        { id: 'w-ckpt', label: 'and in the checkpoint', pattern: 'service', sub: 'for survival, between them' },
      ],
    },
    {
      id: 'providers',
      label: 'Two providers, and the choice is about size',
      pattern: 'group',
      sub: 'the default keeps the whole state in the JVM heap, which is fine until it is not',
      cols: 2,
      children: [
        { id: 'pr-hdfs', label: 'HDFS-backed (default)', pattern: 'network', sub: 'all in heap · GC pressure grows with state' },
        { id: 'pr-rocks', label: 'RocksDB', pattern: 'service', sub: 'spills to local disk · for large state' },
      ],
    },
    {
      id: 'watch',
      label: 'Watch numRowsTotal',
      pattern: 'warn',
      icon: 'trendingUp',
      sub: 'if it only ever rises, something never expires',
    },
  ],
  edges: [
    { source: 'what', target: 'providers' },
    { source: 'providers', target: 'watch' },
  ],
}

export const streamStreamJoins: Scene = {
  id: 'str-stream-joins',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'No side can be the build',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'neither is finished — a match may not have arrived yet',
    },
    {
      id: 'buffer',
      label: 'So both sides are buffered in state',
      pattern: 'group',
      sub: 'every unmatched row is kept, in case its partner turns up — and without a bound, that is every row forever',
      cols: 2,
      children: [
        { id: 'b-left', label: 'the left side, buffered', pattern: 'network', sub: 'waiting for matches' },
        { id: 'b-right', label: 'the right side, buffered', pattern: 'network', sub: 'waiting for matches' },
      ],
    },
    {
      id: 'need',
      label: 'Which is why Spark demands two things before it will run one',
      pattern: 'group',
      sub: 'together they put a ceiling on how long a row can usefully be kept — and so on the state',
      cols: 2,
      children: [
        { id: 'n-wm', label: 'a watermark on BOTH sides', pattern: 'service', sub: 'how late each may be' },
        { id: 'n-time', label: 'and a time bound in the ON', pattern: 'service', sub: 'clicks within an hour of the impression' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'buffer' },
    { source: 'buffer', target: 'need' },
  ],
}

export const streamingScenes: Scene[] = [
  theUnboundedTable,
  theSameEngine,
  theTrigger,
  incrementalExecution,
  theOffsetLog,
  outputModes,
  sinksAndIdempotence,
  eventTime,
  windows,
  watermarks,
  theStateStore,
  streamStreamJoins,
]
