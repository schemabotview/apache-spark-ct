import type { Scene } from '@graphlearning/flow'

// Course 4 (execution) scenes. The question is how a line of code becomes work on a cluster, and the
// answer is a chain of four units — job, stage, task, slot — each bounded by a different thing. The
// scenes are built so the same four keep reappearing in the same order, because the course's value
// is in being able to name which one you are looking at in the UI.

export const nothingHappensYet: Scene = {
  id: 'exec-nothing-yet',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'wrote',
      label: 'What you wrote',
      pattern: 'group',
      sub: 'four lines that look like they read a file and compute an answer',
      cols: 1,
      children: [
        { id: 'w1', label: 'spark.read.parquet(…)', pattern: 'storage', sub: 'no file is opened' },
        { id: 'w2', label: '.filter(…)', pattern: 'service', sub: 'no row is tested' },
        { id: 'w3', label: '.groupBy(…).count()', pattern: 'service', sub: 'nothing is counted' },
      ],
    },
    {
      id: 'happened',
      label: 'What actually happened',
      pattern: 'group',
      sub: 'a plan was built on the driver, in memory, and nothing was sent anywhere',
      cols: 2,
      children: [
        { id: 'h-plan', label: 'a tree grew', pattern: 'network', sub: 'each call adds a node' },
        { id: 'h-cluster', label: 'the cluster is idle', pattern: 'network', sub: 'it has not been told anything' },
      ],
    },
    {
      id: 'why',
      label: 'Why wait',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'you cannot optimise a chain you cannot yet see the end of',
    },
  ],
  edges: [
    { source: 'wrote', target: 'happened' },
    { source: 'happened', target: 'why' },
  ],
}

export const theAction: Scene = {
  id: 'exec-the-action',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'kinds',
      label: 'An action is anything that needs a real answer',
      pattern: 'group',
      sub: 'a transformation returns another description; an action returns a value, writes a file, or shows rows',
      cols: 3,
      children: [
        { id: 'k-value', label: 'a value to the driver', pattern: 'network', sub: 'count · collect · first · take' },
        { id: 'k-write', label: 'a write to storage', pattern: 'storage', sub: 'save · write · saveAsTable' },
        { id: 'k-show', label: 'rows on your screen', pattern: 'network', sub: 'show — yes, this is an action' },
      ],
    },
    {
      id: 'triggers',
      label: 'One action, one job',
      pattern: 'warn',
      icon: 'zap',
      sub: 'and the job runs the WHOLE plan behind it, every time',
    },
    {
      id: 'trap',
      label: 'The trap that follows from "every time"',
      pattern: 'group',
      sub: 'three actions on one DataFrame is three jobs, each re-running the entire chain from the source',
      cols: 2,
      children: [
        { id: 't-three', label: 'count, then show, then write', pattern: 'warn', sub: 'the file is read three times' },
        { id: 't-fix', label: 'cache() between them', pattern: 'service', sub: 'or accept paying three times' },
      ],
    },
  ],
  edges: [
    { source: 'kinds', target: 'triggers' },
    { source: 'triggers', target: 'trap' },
  ],
}

export const whyLazyPays: Scene = {
  id: 'exec-why-lazy',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'naive',
      label: 'If Spark ran each line as you wrote it',
      pattern: 'group',
      sub: 'read one billion rows, then throw away all but one thousand of them',
      flow: 'LR',
      children: [
        { id: 'n-read', label: 'read 1B rows', pattern: 'warn', sub: 'every column, every row' },
        { id: 'n-filter', label: 'keep 1K', pattern: 'warn', sub: 'discard 99.9999%' },
      ],
    },
    {
      id: 'lazy',
      label: 'Because it waited, it can rearrange',
      pattern: 'group',
      sub: 'the filter is pushed into the scan, so the rows are never read in the first place',
      cols: 3,
      children: [
        { id: 'l-push', label: 'predicate pushdown', pattern: 'service', sub: 'the filter moves into the read' },
        { id: 'l-prune', label: 'column pruning', pattern: 'service', sub: 'read 3 columns, not 200' },
        { id: 'l-fuse', label: 'operator fusion', pattern: 'service', sub: 'ten steps become one pass' },
      ],
    },
    {
      id: 'price',
      label: 'The price you pay for it',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'errors surface at the action, far from the line that caused them',
    },
  ],
  edges: [
    { source: 'naive', target: 'lazy', label: 'none of this is possible eagerly' },
    { source: 'lazy', target: 'price' },
  ],
}

export const jobStageTask: Scene = {
  id: 'exec-job-stage-task',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'units',
      label: 'Four units, each bounded by a different thing',
      pattern: 'group',
      sub: 'being able to name which one you are looking at is most of what reading the Spark UI is',
      cols: 4,
      children: [
        { id: 'u-job', label: 'Job', pattern: 'service', sub: 'bounded by one action' },
        { id: 'u-stage', label: 'Stage', pattern: 'service', sub: 'bounded by a shuffle' },
        { id: 'u-task', label: 'Task', pattern: 'service', sub: 'bounded by one partition' },
        { id: 'u-slot', label: 'Slot', pattern: 'network', sub: 'bounded by one core' },
      ],
    },
    {
      id: 'counts',
      label: 'Which means the counts are not yours to choose',
      pattern: 'group',
      sub: 'three of these four numbers are decided for you, and knowing by what is how you change them',
      cols: 3,
      children: [
        { id: 'c-jobs', label: 'jobs = actions', pattern: 'network', sub: 'you control this directly' },
        { id: 'c-stages', label: 'stages = shuffles + 1', pattern: 'network', sub: 'count the Exchanges' },
        { id: 'c-tasks', label: 'tasks = partitions', pattern: 'network', sub: 'per stage, not per job' },
      ],
    },
  ],
  edges: [{ source: 'units', target: 'counts' }],
}

export const theStageCut: Scene = {
  id: 'exec-stage-cut',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'stage0',
      label: 'Stage 0 — everything narrow, fused into one pass',
      pattern: 'service',
      sub: 'scan, filter, project: no row needs a row from another partition, so none of this needs a boundary',
      flow: 'LR',
      children: [
        { id: 'sc', label: 'FileScan', pattern: 'storage', sub: '4 partitions', variant: 'tile' },
        { id: 'fi', label: 'Filter', pattern: 'network', sub: 'narrow', variant: 'tile' },
        { id: 'pr', label: 'Project', pattern: 'network', sub: 'narrow', variant: 'tile' },
      ],
      edges: [
        { source: 'sc', target: 'fi' },
        { source: 'fi', target: 'pr' },
      ],
    },
    {
      id: 'cut',
      label: 'Exchange',
      pattern: 'warn',
      icon: 'router',
      sub: 'the only thing that ever starts a new stage',
    },
    {
      id: 'stage1',
      label: 'Stage 1 — cannot begin until Stage 0 is entirely done',
      pattern: 'service',
      sub: 'not mostly done. entirely. the slowest task of Stage 0 holds every task of Stage 1',
      flow: 'LR',
      children: [
        { id: 'ag', label: 'HashAggregate', pattern: 'network', sub: 'the groupBy', variant: 'tile' },
        { id: 'wr', label: 'Write', pattern: 'storage', sub: 'or collect', variant: 'tile' },
      ],
      edges: [{ source: 'ag', target: 'wr' }],
    },
  ],
  edges: [
    { source: 'stage0', target: 'cut' },
    { source: 'cut', target: 'stage1' },
  ],
}

export const pipelining: Scene = {
  id: 'exec-pipelining',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'imagined',
      label: 'What people imagine three narrow steps cost',
      pattern: 'group',
      sub: 'three passes over the data, and two intermediate collections nobody asked for',
      flow: 'LR',
      children: [
        { id: 'i1', label: 'pass 1 · filter', pattern: 'warn', sub: 'write result' },
        { id: 'i2', label: 'pass 2 · map', pattern: 'warn', sub: 'write result' },
        { id: 'i3', label: 'pass 3 · filter', pattern: 'warn', sub: 'write result' },
      ],
      edges: [
        { source: 'i1', target: 'i2' },
        { source: 'i2', target: 'i3' },
      ],
    },
    {
      id: 'actual',
      label: 'What it actually costs',
      pattern: 'service',
      icon: 'zap',
      sub: 'one row in → all three applied → next row',
    },
    {
      id: 'stops',
      label: 'Where the fusion stops',
      pattern: 'group',
      sub: 'exactly one thing ends it, and it is the same thing that ends a stage',
      cols: 2,
      children: [
        { id: 's-shuffle', label: 'a wide dependency', pattern: 'warn', sub: 'the boundary, every time' },
        { id: 's-opaque', label: 'an opaque function', pattern: 'warn', sub: 'a UDF Spark cannot see into' },
      ],
    },
  ],
  edges: [
    { source: 'imagined', target: 'actual', label: 'it does not work like this' },
    { source: 'actual', target: 'stops' },
  ],
}

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

export const slots: Scene = {
  id: 'exec-slots',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'waves',
      label: '200 tasks over 100 slots runs in two waves',
      pattern: 'group',
      sub: 'tasks queue; they do not run in parallel past the number of cores you actually have',
      flow: 'LR',
      children: [
        { id: 'w1', label: 'wave 1', pattern: 'service', sub: '100 tasks, every slot busy' },
        { id: 'w2', label: 'wave 2', pattern: 'service', sub: '100 tasks, every slot busy' },
      ],
    },
    {
      id: 'ragged',
      label: 'And 201 tasks runs in three',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'one task and 99 idle cores, for a whole task’s duration',
    },
    {
      id: 'rule',
      label: 'The arithmetic worth doing before any tuning',
      pattern: 'group',
      sub: 'it is free, it takes ten seconds, and it is frequently the whole problem',
      cols: 2,
      children: [
        { id: 'ru-slots', label: 'executors × cores', pattern: 'network', sub: '= every slot you will ever have' },
        { id: 'ru-parts', label: 'partitions ≈ a multiple', pattern: 'network', sub: 'of that number, 2–4× for skew' },
      ],
    },
  ],
  edges: [
    { source: 'waves', target: 'ragged' },
    { source: 'ragged', target: 'rule' },
  ],
}

export const dagScheduler: Scene = {
  id: 'exec-dag-scheduler',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'dag',
      label: 'DAG scheduler',
      pattern: 'service',
      sub: 'thinks in stages · knows the shape of the plan',
      cols: 1,
      children: [
        { id: 'd-cut', label: 'cuts stages', pattern: 'network', sub: 'at every shuffle' },
        { id: 'd-order', label: 'orders them', pattern: 'network', sub: 'by what depends on what' },
        { id: 'd-skip', label: 'skips finished ones', pattern: 'network', sub: 'shuffle files still on disk' },
      ],
    },
    {
      id: 'task',
      label: 'Task scheduler',
      pattern: 'service',
      sub: 'thinks in tasks · knows where the slots are',
      cols: 1,
      children: [
        { id: 'ts-place', label: 'places tasks', pattern: 'network', sub: 'preferring local data' },
        { id: 'ts-retry', label: 'retries failures', pattern: 'network', sub: 'up to four times' },
        { id: 'ts-spec', label: 'launches speculation', pattern: 'network', sub: 'against stragglers' },
      ],
    },
    {
      id: 'lost',
      label: 'When a shuffle file is lost',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'FetchFailed → the MAP STAGE is resubmitted, not the task',
    },
  ],
  edges: [
    { source: 'dag', target: 'task', label: 'here is a stage: run these tasks' },
    { source: 'task', target: 'lost' },
  ],
}

export const aRealLineage: Scene = {
  id: 'exec-real-lineage',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'chain',
      label: 'groupBy → sum → sort → limit → collect, in full',
      pattern: 'group',
      sub: 'one action, two shuffles, three stages — and the task counts change at every boundary',
      children: [
        {
          id: 'st0',
          label: 'Stage 0',
          pattern: 'service',
          sub: '8 tasks — one per input partition',
          flow: 'LR',
          children: [
            { id: 'a-scan', label: 'scan', pattern: 'storage', sub: '8 files', variant: 'tile' },
            { id: 'a-partial', label: 'partial agg', pattern: 'network', sub: 'per partition', variant: 'tile' },
          ],
          edges: [{ source: 'a-scan', target: 'a-partial' }],
        },
        { id: 'ex1', label: 'Exchange · by key', pattern: 'warn', sub: 'the groupBy' },
        {
          id: 'st1',
          label: 'Stage 1',
          pattern: 'service',
          sub: '200 tasks — the shuffle default',
          flow: 'LR',
          children: [
            { id: 'b-final', label: 'final agg', pattern: 'network', sub: 'one row per key', variant: 'tile' },
            { id: 'b-local', label: 'local top 5', pattern: 'network', sub: 'per partition', variant: 'tile' },
          ],
          edges: [{ source: 'b-final', target: 'b-local' }],
        },
        { id: 'ex2', label: 'Exchange · to one', pattern: 'warn', sub: 'the sort + limit' },
        { id: 'st2', label: 'Stage 2', pattern: 'service', sub: '1 task — merge 200 local top-5s, take 5' },
      ],
      edges: [
        { source: 'st0', target: 'ex1' },
        { source: 'ex1', target: 'st1' },
        { source: 'st1', target: 'ex2' },
        { source: 'ex2', target: 'st2' },
      ],
    },
  ],
  edges: [],
}

export const readingExplain: Scene = {
  id: 'exec-reading-explain',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'explain.txt',
      minCols: 76,
      label: [
        '>>> df.groupBy("dest").count().orderBy("count").explain()',
        '',
        '== Physical Plan ==',
        'AdaptiveSparkPlan isFinalPlan=false',
        '+- Sort [count#42 ASC NULLS FIRST], true, 0',
        '   +- Exchange rangepartitioning(count#42 ASC, 200)   <-- 2',
        '      +- HashAggregate(keys=[dest#7], functions=[count(1)])',
        '         +- Exchange hashpartitioning(dest#7, 200)    <-- 1',
        '            +- HashAggregate(keys=[dest#7], ...)',
        '               +- FileScan parquet [dest#7]',
        '                    PushedFilters: [IsNotNull(dest)]',
        '                    ReadSchema: struct<dest:string>',
        '',
        '# Read it BOTTOM-UP: the scan is the leaf, the sort is last.',
        '#',
        '# Two Exchanges -> two shuffles -> THREE stages.',
        '# That count is the cost of the query, and it is visible',
        '# here without running anything.',
        '#',
        '# Two HashAggregates is not a bug: the lower one is the',
        '# partial aggregate BEFORE the shuffle (the map-side combine),',
        '# the upper one finishes the job after it.',
        '#',
        '# ReadSchema names one column out of two hundred -- column',
        '# pruning worked. PushedFilters means the filter reached',
        '# the file reader instead of running after the scan.',
      ].join('\n'),
    },
  ],
  edges: [],
}

export const executionScenes: Scene[] = [
  nothingHappensYet,
  theAction,
  whyLazyPays,
  jobStageTask,
  theStageCut,
  pipelining,
  theTask,
  slots,
  dagScheduler,
  aRealLineage,
  readingExplain,
]
