import type { Scene } from '@graphlearning/flow'

// Course 6 (catalyst) scenes.
//
// THIS IS THE COURSE THE REPO EXISTS TO MAKE ITS CASE WITH. See COURSE-PLAN.md §2: the canonical
// Databricks figures of this exact pipeline (excerpt pp. 51–53) draw every plan node as an EMPTY
// BOX. They show the shape — unresolved → resolved → optimized → physical — and never what actually
// changed at each step, which is the only interesting part.
//
// So every scene from §3 to §9 carries the REAL plan nodes (Relation, Filter, Project, Join,
// Aggregate) with their actual contents, and names the rule that fired between one frame and the
// next. That is the whole differentiation, and it is checkable on the frames.

export const oneFrontDoor: Scene = {
  id: 'cat-one-front-door',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ways',
      label: 'Three ways to ask the same question',
      pattern: 'group',
      sub: 'people believe one of these is faster than the others — and on the structured APIs, none of them is',
      cols: 3,
      children: [
        { id: 'w-sql', label: 'SQL', pattern: 'network', sub: 'SELECT dest, count(*) …' },
        { id: 'w-df', label: 'DataFrame', pattern: 'network', sub: 'df.groupBy("dest").count()' },
        { id: 'w-ds', label: 'Dataset', pattern: 'network', sub: 'typed, Scala and Java only' },
      ],
    },
    {
      id: 'same',
      label: 'One unresolved logical plan',
      pattern: 'service',
      icon: 'gitmerge',
      sub: 'the same tree, whichever door you came through',
    },
    {
      id: 'why',
      label: 'Which is why two things people argue about are settled',
      pattern: 'group',
      sub: 'language and dialect are ergonomic choices, not performance ones — the optimizer never learns which you used',
      cols: 2,
      children: [
        { id: 'y-lang', label: 'Python is not slower', pattern: 'service', sub: 'until you write a UDF' },
        { id: 'y-sql', label: 'SQL is not slower', pattern: 'service', sub: 'nor faster — it is the same tree' },
      ],
    },
  ],
  edges: [
    { source: 'ways', target: 'same' },
    { source: 'same', target: 'why' },
  ],
}

// §2 — the expression tree. This is one of the two diagram classes COURSE-PLAN.md flagged as
// unproven in the engine, so: VERDICT, from the rendered frame on 2026-09-24.
//
// The engine does NOT draw a classic edge-linked tree. A parent with `children` renders as a BOX
// CONTAINING them, so a tree comes out as nesting. For an expression that is arguably better than
// edges — the containment is the precedence, visibly — but it means each operator is a group HEADER
// rather than a node, and a bare symbol like "-" is far too small to read at capture size. So every
// operator here carries its name as well as its symbol, and a sub saying what it does.
//
// Anything genuinely needing edge-linked siblings (a plan tree where nodes are peers) should be
// drawn as a chained group instead, the way §3 and §7 do it.
export const expressionTree: Scene = {
  id: 'cat-expression-tree',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'src',
      label: '((price+5)*200)-6 < budget',
      pattern: 'network',
      icon: 'filecode',
      sub: 'one expression, as you wrote it',
    },
    {
      id: 'lt',
      label: '<  LessThan',
      pattern: 'service',
      sub: 'the root — a Predicate, returning true or false',
      cols: 2,
      children: [
        {
          id: 'minus',
          label: '−  Subtract',
          pattern: 'service',
          sub: 'its left child is everything below',
          cols: 2,
          children: [
            {
              id: 'times',
              label: '×  Multiply',
              pattern: 'network',
              sub: 'evaluated before the subtraction',
              cols: 2,
              children: [
                {
                  id: 'plus',
                  label: '+  Add',
                  pattern: 'network',
                  sub: 'the innermost bracket — evaluated first',
                  cols: 2,
                  children: [
                    { id: 'e-price', label: 'price', pattern: 'storage', sub: 'AttributeReference' },
                    { id: 'e-5', label: '5', pattern: 'user', sub: 'Literal' },
                  ],
                },
                { id: 'e-200', label: '200', pattern: 'user', sub: 'Literal' },
              ],
            },
            { id: 'e-6', label: '6', pattern: 'user', sub: 'Literal' },
          ],
        },
        { id: 'e-budget', label: 'budget', pattern: 'storage', sub: 'AttributeReference' },
      ],
    },
    {
      id: 'note',
      label: 'Nesting IS precedence',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'the shape already says what happens first',
    },
  ],
  edges: [
    { source: 'src', target: 'lt', label: 'parsed once, into this' },
    { source: 'lt', target: 'note' },
  ],
}

export const unresolvedPlan: Scene = {
  id: 'cat-unresolved',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'plan',
      label: 'The unresolved logical plan — real nodes, unknown names',
      pattern: 'group',
      sub: 'the grammar is fine, so a tree exists; but nothing in it has been checked against anything real',
      children: [
        { id: 'u-proj', label: "Project ['dest, 'total]", pattern: 'warn', sub: "the ' prefix means UNRESOLVED" },
        { id: 'u-agg', label: "Aggregate ['dest]", pattern: 'warn', sub: "[sum('cnt)] — is cnt a number? unknown" },
        { id: 'u-filter', label: "Filter ('country = 'IN')", pattern: 'warn', sub: 'does country exist? unknown' },
        { id: 'u-rel', label: "UnresolvedRelation [flights]", pattern: 'warn', sub: 'which table is that?' },
      ],
      edges: [
        { source: 'u-rel', target: 'u-filter' },
        { source: 'u-filter', target: 'u-agg' },
        { source: 'u-agg', target: 'u-proj' },
      ],
    },
    {
      id: 'knows',
      label: 'What it knows, and what it does not',
      pattern: 'group',
      sub: 'this is the boundary between a syntax error and an analysis error, and it is why they arrive at different times',
      cols: 2,
      children: [
        { id: 'k-yes', label: 'the shape is valid', pattern: 'service', sub: 'a SELECT with a GROUP BY and a WHERE' },
        { id: 'k-no', label: 'every name is a guess', pattern: 'warn', sub: 'table, column, type — all unchecked' },
      ],
    },
  ],
  edges: [{ source: 'plan', target: 'knows' }],
}

export const theCatalog: Scene = {
  id: 'cat-catalog',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'catalog',
      label: 'The catalog',
      pattern: 'service',
      icon: 'bookOpen',
      sub: 'the only thing that knows what a name means',
      cols: 1,
      children: [
        { id: 'c-tables', label: 'tables and views', pattern: 'network', sub: 'name → location and format' },
        { id: 'c-schema', label: 'columns and types', pattern: 'network', sub: 'dest is a string, cnt is a bigint' },
        { id: 'c-fns', label: 'functions', pattern: 'network', sub: 'built-ins, and your UDFs' },
        { id: 'c-stats', label: 'statistics', pattern: 'network', sub: 'row counts and sizes, IF computed' },
      ],
    },
    {
      id: 'sources',
      label: 'Where it comes from',
      pattern: 'group',
      sub: 'a session always has one — in-memory by default, and a shared metastore when tables outlive the session',
      cols: 2,
      children: [
        { id: 's-session', label: 'the session', pattern: 'network', sub: 'temp views, createOrReplaceTempView' },
        { id: 's-meta', label: 'an external metastore', pattern: 'network', sub: 'Hive, Glue, Unity — shared, durable' },
      ],
    },
    {
      id: 'stats',
      label: 'Statistics are OPTIONAL',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'no ANALYZE TABLE → the optimizer is guessing sizes',
    },
  ],
  edges: [
    { source: 'catalog', target: 'sources', label: 'backed by' },
    { source: 'catalog', target: 'stats' },
  ],
}

export const theAnalyzer: Scene = {
  id: 'cat-analyzer',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Before — every name a guess',
      pattern: 'group',
      sub: 'the same four nodes as the last frame, still carrying apostrophes',
      flow: 'LR',
      children: [
        { id: 'b-rel', label: "UnresolvedRelation", pattern: 'warn', sub: '[flights]' },
        { id: 'b-filter', label: "Filter ('country = IN)", pattern: 'warn', sub: "'country is a name, not a column" },
      ],
      edges: [{ source: 'b-rel', target: 'b-filter' }],
    },
    {
      id: 'after',
      label: 'After — every name bound to a real column, with a type and an id',
      pattern: 'group',
      sub: 'the apostrophes are gone; #7 and #11 are attribute ids, unique for the life of the plan',
      flow: 'LR',
      children: [
        { id: 'a-rel', label: 'Relation flights', pattern: 'service', sub: 'parquet · s3://…/flights' },
        { id: 'a-filter', label: 'Filter (country#7 = IN)', pattern: 'service', sub: 'country#7: string' },
      ],
      edges: [{ source: 'a-rel', target: 'a-filter' }],
    },
    {
      id: 'rejects',
      label: 'Or it refuses — and this is the error you get FAST',
      pattern: 'group',
      sub: 'analysis runs as you build the plan, long before any action, which is why a typo fails immediately',
      cols: 3,
      children: [
        { id: 'r-col', label: 'no such column', pattern: 'warn', sub: 'cannot resolve `dst`' },
        { id: 'r-tbl', label: 'no such table', pattern: 'warn', sub: 'Table or view not found' },
        { id: 'r-amb', label: 'ambiguous', pattern: 'warn', sub: 'both sides of a join have `id`' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'after', label: 'the analyzer, using the catalog' },
    { source: 'after', target: 'rejects' },
  ],
}

export const rulesToFixpoint: Scene = {
  id: 'cat-rules',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'rule',
      label: 'Rule = tree → tree',
      pattern: 'service',
      icon: 'repeat',
      sub: 'pattern-match a shape, return a replacement',
    },
    {
      id: 'example',
      label: 'One rule firing three times, on one expression',
      pattern: 'group',
      sub: 'ConstantFolding: wherever both operands are literals, evaluate them now instead of per row',
      flow: 'LR',
      children: [
        { id: 'f-1', label: '(2 + 3) * cnt > 100', pattern: 'warn', sub: 'as written' },
        { id: 'f-2', label: '5 * cnt > 100', pattern: 'service', sub: 'folded once' },
        { id: 'f-3', label: 'no literals left', pattern: 'service', sub: 'the rule stops changing it' },
      ],
      edges: [
        { source: 'f-1', target: 'f-2' },
        { source: 'f-2', target: 'f-3' },
      ],
    },
    {
      id: 'batch',
      label: 'Rules run in batches, to a fixed point',
      pattern: 'group',
      sub: 'a batch repeats until a pass changes nothing — because one rule firing often exposes work for another',
      cols: 2,
      children: [
        { id: 'ba-why', label: 'why repeat', pattern: 'network', sub: 'folding a constant can enable a pushdown' },
        { id: 'ba-stop', label: 'and why it stops', pattern: 'network', sub: 'a pass with no change, or maxIterations' },
      ],
    },
  ],
  edges: [
    { source: 'rule', target: 'example' },
    { source: 'example', target: 'batch' },
  ],
}

export const predicatePushdown: Scene = {
  id: 'cat-pushdown',
  padding: 0.12,
  flow: 'LR',
  nodes: [
    {
      id: 'before',
      label: 'Before — the filter is above the join',
      pattern: 'group',
      sub: 'as written: join everything, then discard. Read bottom-up.',
      children: [
        { id: 'p-f', label: 'Filter (country#7 = IN)', pattern: 'warn', sub: 'runs on the JOINED rows' },
        { id: 'p-j', label: 'Join (user#3 = user#9)', pattern: 'service', sub: 'all 4B rows × all users' },
        { id: 'p-r1', label: 'Relation flights', pattern: 'storage', sub: '4B rows' },
      ],
      edges: [
        { source: 'p-r1', target: 'p-j' },
        { source: 'p-j', target: 'p-f' },
      ],
    },
    {
      id: 'after',
      label: 'After — PushDownPredicate fired',
      pattern: 'group',
      sub: 'the filter moved BELOW the join and INTO the scan, so the rows never reach the join at all',
      children: [
        { id: 'q-j', label: 'Join (user#3 = user#9)', pattern: 'service', sub: 'now joins 40M rows, not 4B' },
        { id: 'q-r1', label: 'Relation flights', pattern: 'service', sub: 'PushedFilters: [country = IN]' },
      ],
      edges: [{ source: 'q-r1', target: 'q-j' }],
    },
    {
      id: 'legal',
      label: 'Why it is allowed',
      pattern: 'service',
      icon: 'check',
      sub: 'on an INNER join the answer is provably identical',
    },
  ],
  edges: [
    { source: 'before', target: 'after', label: 'PushDownPredicate' },
    { source: 'after', target: 'legal' },
  ],
}

export const columnPruning: Scene = {
  id: 'cat-pruning',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'query',
      label: 'The query: 3 columns',
      pattern: 'network',
      icon: 'filecode',
      sub: 'SELECT dest, sum(cnt) … WHERE country = "IN"',
    },
    {
      id: 'table',
      label: 'The table has two hundred',
      pattern: 'group',
      sub: 'a wide event table — the other 197 columns are never mentioned anywhere in the plan',
      cols: 4,
      children: [
        { id: 't-used1', label: 'dest', pattern: 'service', sub: 'used' },
        { id: 't-used2', label: 'cnt', pattern: 'service', sub: 'used' },
        { id: 't-used3', label: 'country', pattern: 'service', sub: 'used' },
        { id: 't-rest', label: '…197 more', pattern: 'warn', sub: 'never mentioned' },
      ],
    },
    {
      id: 'result',
      label: 'What the scan node ends up saying',
      pattern: 'group',
      sub: 'ReadSchema is the honest record of what will actually be read off disk',
      cols: 2,
      children: [
        { id: 're-schema', label: 'ReadSchema: 3 fields', pattern: 'service', sub: 'struct<dest,cnt,country>' },
        { id: 're-why', label: 'columnar formats deliver', pattern: 'service', sub: 'Parquet skips the other 197 entirely' },
      ],
    },
  ],
  edges: [
    { source: 'query', target: 'table', label: 'ColumnPruning' },
    { source: 'table', target: 'result' },
  ],
}

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

export const theCostModel: Scene = {
  id: 'cat-cost-model',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'inputs',
      label: 'What the choice is made from',
      pattern: 'group',
      sub: 'estimated sizes — and "estimated" is the load-bearing word in this entire course',
      cols: 3,
      children: [
        { id: 'i-stats', label: 'catalog statistics', pattern: 'network', sub: 'if ANALYZE TABLE ever ran' },
        { id: 'i-files', label: 'file sizes', pattern: 'network', sub: 'compressed bytes on disk' },
        { id: 'i-guess', label: 'and heuristics', pattern: 'warn', sub: 'a filter keeps…some fraction?' },
      ],
    },
    {
      id: 'decide',
      label: 'One candidate wins',
      pattern: 'service',
      icon: 'check',
      sub: 'e.g. the right side estimates under 10 MB → BroadcastHashJoin',
    },
    {
      id: 'wrong',
      label: 'When the estimate is wrong',
      pattern: 'group',
      sub: 'a bad estimate does not make Spark choose badly sometimes — it makes it choose badly on every run, identically',
      cols: 2,
      children: [
        { id: 'w-fix', label: 'ANALYZE TABLE', pattern: 'service', sub: 'fixes the cause, cheaply' },
        { id: 'w-aqe', label: 'or let AQE re-decide', pattern: 'service', sub: 'with real numbers, after a shuffle' },
      ],
    },
  ],
  edges: [
    { source: 'inputs', target: 'decide' },
    { source: 'decide', target: 'wrong' },
  ],
}

export const downToRdds: Scene = {
  id: 'cat-to-rdds',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'physical',
      label: 'The selected physical plan',
      pattern: 'service',
      icon: 'gitmerge',
      sub: 'still a tree of operators, not yet anything runnable',
    },
    {
      id: 'codegen',
      label: 'Whole-stage code generation',
      pattern: 'group',
      sub: 'a run of operators is compiled into ONE generated Java method — no operator-to-operator calls left',
      cols: 2,
      children: [
        { id: 'cg-what', label: 'one fused loop', pattern: 'network', sub: 'scan + filter + project, together' },
        { id: 'cg-see', label: 'the ★ in the plan', pattern: 'network', sub: 'marks a codegen stage' },
      ],
    },
    {
      id: 'rdds',
      label: 'And then: RDDs',
      pattern: 'storage',
      icon: 'layers',
      sub: 'same partitions, tasks and lineage as everything else',
    },
  ],
  edges: [
    { source: 'physical', target: 'codegen' },
    { source: 'codegen', target: 'rdds', label: 'Spark is a compiler' },
  ],
}

export const readingAPlan: Scene = {
  id: 'cat-reading-plan',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'plan.txt',
      minCols: 76,
      label: [
        '== Parsed Logical Plan ==          # unresolved: names only',
        "'Project ['dest, 'total]",
        "+- 'Filter ('country = IN)",
        "   +- 'UnresolvedRelation [flights]",
        '',
        '== Analyzed Logical Plan ==        # names bound, types known',
        'Project [dest#7, total#42L]',
        '+- Filter (country#9 = IN)',
        '   +- Relation flights[dest#7,country#9,cnt#11L] parquet',
        '',
        '== Optimized Logical Plan ==       # rules have fired',
        'Aggregate [dest#7], [dest#7, sum(cnt#11L) AS total#42L]',
        '+- Project [dest#7, cnt#11L]              <-- pruned',
        '   +- Filter (isnotnull(country#9) AND (country#9 = IN))',
        '      +- Relation flights[...] parquet',
        '',
        '== Physical Plan ==                # HOW, not what',
        '*(2) HashAggregate(keys=[dest#7], ...)    <-- * = codegen',
        '+- Exchange hashpartitioning(dest#7, 200) <-- the shuffle',
        '   +- *(1) HashAggregate(keys=[dest#7], ...)  <-- partial',
        '      +- *(1) Filter (country#9 = IN)',
        '         +- FileScan parquet [dest#7,country#9,cnt#11L]',
        '              PushedFilters: [EqualTo(country,IN)]',
        '              ReadSchema: struct<dest,country,cnt>',
      ].join('\n'),
    },
  ],
  edges: [],
}

export const catalystScenes: Scene[] = [
  oneFrontDoor,
  expressionTree,
  unresolvedPlan,
  theCatalog,
  theAnalyzer,
  rulesToFixpoint,
  predicatePushdown,
  columnPruning,
  physicalCandidates,
  theCostModel,
  downToRdds,
  readingAPlan,
]
