import type { Scene } from '@graphlearning/flow'

// Course 12 (aqe) scenes.
//
// COURSE-PLAN.md §5 rates this the SHARPEST RISK in the whole spine: the only source in the four
// books is the 2E study notes, which describe Spark 3.0.0-preview2, and skew-join handling changed
// after that release. Everything here is stated against current Spark (3.2+) defaults — in
// particular `spark.sql.adaptive.enabled` has been TRUE by default since 3.2, which the 2E notes
// predate and which changes the advice from "turn this on" to "know what it is already doing".

export const staticPlanProblem: Scene = {
  id: 'aqe-static-problem',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'when',
      label: 'The optimizer decides before it has seen anything',
      pattern: 'group',
      sub: 'every choice about how to run the query is made at plan time, from numbers nobody measured',
      cols: 3,
      children: [
        { id: 'w-size', label: 'how big is that table?', pattern: 'warn', sub: 'from stats, if they exist' },
        { id: 'w-filter', label: 'how many rows survive?', pattern: 'warn', sub: 'a heuristic fraction' },
        { id: 'w-skew', label: 'are the keys even?', pattern: 'warn', sub: 'assumed, always' },
      ],
    },
    {
      id: 'consequence',
      label: 'Wrong, deterministically',
      pattern: 'warn',
      icon: 'repeat',
      sub: 'the same wrong plan, every run, until the stats change',
    },
    {
      id: 'idea',
      label: 'But they exist — later',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'partway through, Spark knows exactly what it has',
    },
  ],
  edges: [
    { source: 'when', target: 'consequence' },
    { source: 'consequence', target: 'idea' },
  ],
}

export const materializationPoints: Scene = {
  id: 'aqe-materialization',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'stage',
      label: 'A stage runs to completion',
      pattern: 'service',
      icon: 'checkCircle',
      sub: 'every task done, every shuffle file written and closed',
    },
    {
      id: 'known',
      label: 'At that instant, guessing stops being necessary',
      pattern: 'group',
      sub: 'the shuffle files are on disk and have been measured — these are counts, not estimates',
      cols: 3,
      children: [
        { id: 'k-bytes', label: 'bytes per partition', pattern: 'service', sub: 'all 200 of them, exactly' },
        { id: 'k-rows', label: 'rows per partition', pattern: 'service', sub: 'so skew is now visible' },
        { id: 'k-total', label: 'the real output size', pattern: 'service', sub: 'not the estimate from before' },
      ],
    },
    {
      id: 'boundary',
      label: 'So re-plan here',
      pattern: 'network',
      icon: 'gitbranch',
      sub: 'the piece between two of these is a query stage',
    },
  ],
  edges: [
    { source: 'stage', target: 'known' },
    { source: 'known', target: 'boundary' },
  ],
}

export const theLoop: Scene = {
  id: 'aqe-loop',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'loop',
      label: 'Plan a bit, run a bit, look, plan again',
      pattern: 'group',
      sub: 'on by default since Spark 3.2 — spark.sql.adaptive.enabled, which is now a thing to KNOW rather than a thing to turn on',
      children: [
        { id: 'l-run', label: 'run the next query stage', pattern: 'service', sub: 'to completion, shuffle written' },
        { id: 'l-read', label: 'read its real statistics', pattern: 'network', sub: 'measured, not estimated' },
        { id: 'l-replan', label: 're-optimize what is left', pattern: 'network', sub: 'Catalyst runs again on the remainder' },
        { id: 'l-next', label: 'repeat at the next', pattern: 'service', sub: 'until the query is finished' },
      ],
      edges: [
        { source: 'l-run', target: 'l-read' },
        { source: 'l-read', target: 'l-replan' },
        { source: 'l-replan', target: 'l-next' },
      ],
    },
    {
      id: 'shape',
      label: 'Which changes what a plan IS',
      pattern: 'group',
      sub: 'not one decision taken before the job, but a sequence of decisions taken during it',
      cols: 2,
      children: [
        { id: 's-before', label: 'before: one plan', pattern: 'warn', sub: 'fixed at submit time' },
        { id: 's-after', label: 'after: a plan per stage', pattern: 'service', sub: 'each one better informed' },
      ],
    },
  ],
  edges: [{ source: 'loop', target: 'shape' }],
}

export const coalescePartitions: Scene = {
  id: 'aqe-coalesce',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Before — 200 reduce partitions, because 200 is the default',
      pattern: 'group',
      sub: 'the filter upstream removed 99% of the rows, and nothing downstream was told',
      cols: 4,
      children: [
        { id: 'b-1', label: '8 MB', pattern: 'warn', sub: 'a whole task, for this' },
        { id: 'b-2', label: '7 MB', pattern: 'warn', sub: 'and again' },
        { id: 'b-3', label: '9 MB', pattern: 'warn', sub: 'and again' },
        { id: 'b-4', label: '…197 more', pattern: 'warn', sub: 'scheduling costs more than the work' },
      ],
    },
    {
      id: 'after',
      label: 'After — contiguous partitions merged toward a target size',
      pattern: 'group',
      sub: 'advisoryPartitionSizeInBytes, 64 MB by default — the target, not a guarantee',
      cols: 3,
      children: [
        { id: 'a-1', label: '~64 MB', pattern: 'service', sub: 'eight of them, combined' },
        { id: 'a-2', label: '~64 MB', pattern: 'service', sub: 'eight more' },
        { id: 'a-3', label: '~60 MB', pattern: 'service', sub: 'the remainder' },
      ],
    },
    {
      id: 'why',
      label: 'And the reason this is worth having',
      pattern: 'group',
      sub: 'it makes the old advice obsolete: you no longer size shuffle.partitions for the WHOLE query',
      cols: 2,
      children: [
        { id: 'w-high', label: 'set it high and forget it', pattern: 'service', sub: 'AQE brings it down per stage' },
        { id: 'w-stage', label: 'per stage, not per query', pattern: 'service', sub: 'one number never fitted all of them' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'after', label: 'coalesce' },
    { source: 'after', target: 'why' },
  ],
}

export const strategySwitch: Scene = {
  id: 'aqe-strategy-switch',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'planned',
      label: 'Planned as a sort-merge join',
      pattern: 'warn',
      icon: 'gitmerge',
      sub: 'the right side ESTIMATED at 4 GB — with no statistics',
    },
    {
      id: 'measured',
      label: 'Then the stage ran, and it measured 3 MB',
      pattern: 'group',
      sub: 'the filter was far more selective than the heuristic assumed — which is normal, not exceptional',
      cols: 2,
      children: [
        { id: 'm-est', label: 'estimated: 4 GB', pattern: 'warn', sub: 'a guess built on a guess' },
        { id: 'm-real', label: 'actual: 3 MB', pattern: 'service', sub: 'counted, from the shuffle files' },
      ],
    },
    {
      id: 'switch',
      label: 'So it switches, mid-flight',
      pattern: 'group',
      sub: 'the sort and the second shuffle are dropped — and a local shuffle reader avoids re-reading what is already there',
      cols: 2,
      children: [
        { id: 'sw-new', label: 'BroadcastHashJoin', pattern: 'service', sub: 'ship 3 MB, join locally' },
        { id: 'sw-saved', label: 'no sort, no second shuffle', pattern: 'service', sub: 'the expensive half, removed' },
      ],
    },
  ],
  edges: [
    { source: 'planned', target: 'measured' },
    { source: 'measured', target: 'switch' },
  ],
}

export const skewSplit: Scene = {
  id: 'aqe-skew-split',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'detect',
      label: 'A partition is skewed only if BOTH tests pass',
      pattern: 'group',
      sub: 'two conditions, because either alone gives false positives on a small or a uniformly large stage',
      cols: 2,
      children: [
        { id: 'd-factor', label: '> 5× the median', pattern: 'network', sub: 'skewedPartitionFactor' },
        { id: 'd-size', label: 'and > 256 MB', pattern: 'network', sub: 'skewedPartitionThresholdInBytes' },
      ],
    },
    {
      id: 'split',
      label: 'The fix: split one side, replicate the other',
      pattern: 'group',
      sub: 'splitting alone would lose matches — the counterpart partition has to be copied to every piece',
      cols: 2,
      children: [
        { id: 'sp-big', label: 'the big one → N pieces', pattern: 'service', sub: 'now N tasks, not one' },
        { id: 'sp-other', label: 'its match → copied N times', pattern: 'service', sub: 'so every piece can still find it' },
      ],
    },
    {
      id: 'limits',
      label: 'And where it stops',
      pattern: 'group',
      sub: 'it needs somewhere to cut — and a single key has no internal boundary to cut along',
      cols: 2,
      children: [
        { id: 'li-key', label: 'one hot KEY cannot split', pattern: 'warn', sub: 'all its rows must meet in one place' },
        { id: 'li-joins', label: 'and it applies to joins', pattern: 'warn', sub: 'sort-merge and shuffled hash' },
      ],
    },
  ],
  edges: [
    { source: 'detect', target: 'split' },
    { source: 'split', target: 'limits' },
  ],
}

export const dynamicPartitionPruning: Scene = {
  id: 'aqe-dpp',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'query',
      label: 'The classic star-schema shape',
      pattern: 'group',
      sub: 'a filter on the DIMENSION, a join to the FACT, and no filter the fact table can use directly',
      cols: 2,
      children: [
        { id: 'q-dim', label: 'dim_date', pattern: 'network', sub: 'small · WHERE quarter = Q3' },
        { id: 'q-fact', label: 'fact_sales', pattern: 'storage', sub: 'huge · 2 years · partitioned · unfiltered' },
      ],
    },
    {
      id: 'build',
      label: 'So Spark builds the filter it needs',
      pattern: 'group',
      sub: 'run the dimension side first, collect the join keys that survived, and turn them into a predicate',
      cols: 2,
      children: [
        { id: 'b-run', label: 'the small side runs first', pattern: 'service', sub: 'it was being broadcast anyway' },
        { id: 'b-keys', label: 'its keys become a filter', pattern: 'service', sub: 'date_id IN (…the Q3 days…)' },
      ],
    },
    {
      id: 'apply',
      label: 'Pushed into the scan',
      pattern: 'service',
      icon: 'filter',
      sub: '90 partitions of 730 — the rest never even listed',
    },
  ],
  edges: [
    { source: 'query', target: 'build' },
    { source: 'build', target: 'apply' },
  ],
}

export const dppVsStatic: Scene = {
  id: 'aqe-dpp-vs-static',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'static',
      label: 'Static partition pruning — the filter is in your query',
      pattern: 'group',
      sub: 'WHERE year = 2026 · the value is a literal, visible at plan time, and directories are excluded immediately',
      cols: 2,
      children: [
        { id: 'st-when', label: 'decided at plan time', pattern: 'service', sub: 'before anything runs' },
        { id: 'st-need', label: 'needs a literal', pattern: 'network', sub: 'you must have written one' },
      ],
    },
    {
      id: 'dynamic',
      label: 'Dynamic partition pruning — the filter is DERIVED',
      pattern: 'group',
      sub: 'you never wrote a filter on the fact table; Spark worked one out from the other side of the join',
      cols: 2,
      children: [
        { id: 'dy-when', label: 'decided at run time', pattern: 'service', sub: 'after the small side runs' },
        { id: 'dy-need', label: 'needs a join', pattern: 'network', sub: 'and a partitioned fact table' },
      ],
    },
    {
      id: 'note',
      label: 'DPP is not part of AQE',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'separate setting · on by default since Spark 3.0',
    },
  ],
  edges: [
    { source: 'static', target: 'dynamic' },
    { source: 'dynamic', target: 'note' },
  ],
}

export const whatItDoesNotFix: Scene = {
  id: 'aqe-limits',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'shuffle',
      label: 'It never removes a shuffle',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'broadcasting and bucketing still beat everything here',
    },
    {
      id: 'others',
      label: 'And three more it cannot reach',
      pattern: 'group',
      sub: 'each one is outside the mechanism: AQE only ever acts at a shuffle boundary, using what that shuffle measured',
      cols: 3,
      children: [
        { id: 'o-key', label: 'a single hot key', pattern: 'warn', sub: 'one partition, nothing to cut along' },
        { id: 'o-narrow', label: 'a job with no shuffle', pattern: 'warn', sub: 'no boundary, so no re-plan' },
        { id: 'o-read', label: 'the first stage', pattern: 'warn', sub: 'nothing has been measured yet' },
      ],
    },
    {
      id: 'stats',
      label: 'And it is not a substitute for statistics',
      pattern: 'group',
      sub: 'AQE fixes the plan after the fact; ANALYZE TABLE means the first plan was right — both are worth having',
      cols: 2,
      children: [
        { id: 'sa-analyze', label: 'ANALYZE TABLE', pattern: 'service', sub: 'a better first guess' },
        { id: 'sa-aqe', label: 'AQE', pattern: 'service', sub: 'a correction to a bad one' },
      ],
    },
  ],
  edges: [
    { source: 'shuffle', target: 'others' },
    { source: 'others', target: 'stats' },
  ],
}

export const seeingIt: Scene = {
  id: 'aqe-seeing-it',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'aqe.txt',
      minCols: 76,
      label: [
        '# BEFORE the query runs -- explain() shows the static plan:',
        '',
        'AdaptiveSparkPlan isFinalPlan=false          <-- not yet',
        '+- SortMergeJoin [dept_id#7], [id#22], Inner',
        '   +- Sort [dept_id#7 ASC], false, 0',
        '      +- Exchange hashpartitioning(dept_id#7, 200)',
        '',
        '# AFTER it has run -- the SAME DataFrame, explained again:',
        '',
        'AdaptiveSparkPlan isFinalPlan=true           <-- now final',
        '+- == Final Plan ==',
        '   BroadcastHashJoin [dept_id#7], [id#22], Inner  <-- switched',
        '   +- AQEShuffleRead coalesced                    <-- 200 -> 12',
        '+- == Initial Plan ==',
        '   SortMergeJoin [dept_id#7], [id#22], Inner',
        '',
        '# isFinalPlan is the flag to read. False means you are',
        '# looking at a guess; true means you are looking at what',
        '# actually happened, with the initial plan kept beside it.',
        '',
        '# The operators AQE inserts, and what each one tells you:',
        '#   AQEShuffleRead coalesced  -> partitions were merged',
        '#   AQEShuffleRead skewed     -> a partition was split',
        '#   BroadcastHashJoin, where  -> the strategy changed',
        '#     the initial plan had SortMergeJoin',
        '',
        '# The SQL tab shows both plans side by side, which is the',
        '# easiest way to see what it decided and why.',
      ].join('\n'),
    },
  ],
  edges: [],
}

export const aqeScenes: Scene[] = [
  staticPlanProblem,
  materializationPoints,
  theLoop,
  coalescePartitions,
  strategySwitch,
  skewSplit,
  dynamicPartitionPruning,
  dppVsStatic,
  whatItDoesNotFix,
  seeingIt,
]
