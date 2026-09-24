import type { Scene } from '@graphlearning/flow'

// Course 8 (pyspark-boundary) scenes.
//
// This course exists because of one figure. COURSE-PLAN.md §2 rates the Databricks excerpt's p.123
// diagram — driver holding a Scala UDF and a Python UDF, three executors, each JVM paired with a
// worker Python process, three numbered steps — as the best drawing in the whole document, and notes
// that the spine had no home for the Python↔JVM boundary until it was looked at.
//
// PAIRED-PROCESS NESTING is the second diagram class COURSE-PLAN.md flagged as unproven. VERDICT,
// from the rendered frames on 2026-09-24: it works, and better than an edge-drawn version would.
// The engine renders a parent with children as a containing box, so an executor holding a JVM child
// and a Python child reads immediately as "these two are on the same machine" — the containment IS
// the claim. Colour carries the rest: the JVM `network`, the Python worker `warn`, so the expensive
// half of the pair is visible before any text is read. §1 and §4 both use it.

export const twoProcesses: Scene = {
  id: 'pyb-two-processes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cluster',
      label: 'What is actually running on one worker node',
      pattern: 'group',
      sub: 'not one process with two languages in it — two operating-system processes that talk over a socket',
      cols: 2,
      children: [
        {
          id: 'ex-a',
          label: 'Executor A',
          pattern: 'service',
          sub: 'one machine, two processes',
          cols: 2,
          children: [
            { id: 'a-jvm', label: 'the JVM', pattern: 'network', sub: 'the engine · your data lives here' },
            { id: 'a-py', label: 'a Python process', pattern: 'warn', sub: 'idle until you need it' },
          ],
        },
        {
          id: 'ex-b',
          label: 'Executor B',
          pattern: 'service',
          sub: 'same arrangement, every node',
          cols: 2,
          children: [
            { id: 'b-jvm', label: 'the JVM', pattern: 'network', sub: 'the engine · your data lives here' },
            { id: 'b-py', label: 'a Python process', pattern: 'warn', sub: 'idle until you need it' },
          ],
        },
      ],
    },
    {
      id: 'claim',
      label: 'Your rows are in the JVM',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'every question in this course is: does a row have to leave it?',
    },
  ],
  edges: [{ source: 'cluster', target: 'claim' }],
}

export const py4j: Scene = {
  id: 'pyb-py4j',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'driver',
      label: 'The driver, which is also two processes',
      pattern: 'group',
      sub: 'your script runs in Python; the plan it builds lives in the JVM beside it',
      cols: 2,
      children: [
        { id: 'd-py', label: 'your Python script', pattern: 'warn', sub: 'df.filter(…).groupBy(…)' },
        { id: 'd-jvm', label: 'the driver JVM', pattern: 'network', sub: 'where the real plan object is' },
      ],
    },
    {
      id: 'gateway',
      label: 'Py4J',
      pattern: 'service',
      icon: 'plug',
      sub: 'a socket gateway · Python holds handles to Java objects',
    },
    {
      id: 'scale',
      label: 'Why this costs nothing',
      pattern: 'group',
      sub: 'one message per API call you write, not per row — a hundred-line script is a few hundred messages',
      cols: 2,
      children: [
        { id: 's-count', label: 'messages ≈ your lines', pattern: 'service', sub: 'and you write few of them' },
        { id: 's-driver', label: 'driver-side only', pattern: 'service', sub: 'Py4J never touches an executor' },
      ],
    },
  ],
  edges: [
    { source: 'driver', target: 'gateway' },
    { source: 'gateway', target: 'scale' },
  ],
}

export const dataframeIllusion: Scene = {
  id: 'pyb-illusion',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'wrote',
      label: 'What you wrote, in Python',
      pattern: 'network',
      icon: 'filecode',
      sub: 'df.filter(col("country") == "IN").groupBy("dest").count()',
    },
    {
      id: 'became',
      label: 'What it became',
      pattern: 'group',
      sub: 'the Python objects were builders — they described a plan and then had nothing more to do',
      cols: 3,
      children: [
        { id: 'b-plan', label: 'a plan in the JVM', pattern: 'service', sub: 'built over Py4J, once' },
        { id: 'b-opt', label: 'optimized by Catalyst', pattern: 'service', sub: 'the same rules as Scala' },
        { id: 'b-run', label: 'run as generated Java', pattern: 'service', sub: 'on the executors' },
      ],
    },
    {
      id: 'zero',
      label: 'Python in the data: zero',
      pattern: 'service',
      icon: 'check',
      sub: 'which is why pure DataFrame PySpark is not slower than Scala',
    },
  ],
  edges: [
    { source: 'wrote', target: 'became' },
    { source: 'became', target: 'zero' },
  ],
}

export const theUdfCrossing: Scene = {
  id: 'pyb-udf-crossing',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'driver',
      label: 'The driver serialises it',
      pattern: 'service',
      icon: 'package',
      sub: 'cloudpickle takes the function AND its closure',
    },
    {
      id: 'exec',
      label: 'On every executor, the row now leaves the JVM',
      pattern: 'group',
      sub: 'the Python process stops being idle — and the engine has no idea what your function does',
      cols: 2,
      children: [
        {
          id: 'e1',
          label: 'Executor A',
          pattern: 'service',
          sub: 'a socket between the two',
          cols: 2,
          children: [
            { id: 'e1-jvm', label: 'JVM', pattern: 'network', sub: 'holds the rows' },
            { id: 'e1-py', label: 'Python worker', pattern: 'warn', sub: 'runs your function' },
          ],
        },
        {
          id: 'e2',
          label: 'Executor B',
          pattern: 'service',
          sub: 'and again, here',
          cols: 2,
          children: [
            { id: 'e2-jvm', label: 'JVM', pattern: 'network', sub: 'holds the rows' },
            { id: 'e2-py', label: 'Python worker', pattern: 'warn', sub: 'runs your function' },
          ],
        },
      ],
    },
    {
      id: 'gotcha',
      label: 'The closure gotcha',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'a UDF referencing a big local dict ships that dict to every task',
    },
  ],
  edges: [
    { source: 'driver', target: 'exec', label: 'shipped to every executor' },
    { source: 'exec', target: 'gotcha' },
  ],
}

export const theRoundTrip: Scene = {
  id: 'pyb-round-trip',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'loop',
      label: 'What happens to one row',
      pattern: 'group',
      sub: 'and then again for the next row, and the next — a million times per partition',
      cols: 1,
      children: [
        { id: 'l-1', label: '1 · read in the JVM', pattern: 'network', sub: 'an UnsafeRow, compact bytes' },
        { id: 'l-2', label: '2 · serialise', pattern: 'warn', sub: 'pickle it into Python’s format' },
        { id: 'l-3', label: '3 · write to a socket', pattern: 'warn', sub: 'a real OS pipe, with syscalls' },
        { id: 'l-4', label: '4 · deserialise', pattern: 'warn', sub: 'build a Python object' },
        { id: 'l-5', label: '5 · your function', pattern: 'service', sub: 'the only step you wanted' },
        { id: 'l-6', label: '6 · all of it, backwards', pattern: 'warn', sub: 'pickle, socket, unpickle' },
      ],
      edges: [
        { source: 'l-1', target: 'l-2' },
        { source: 'l-2', target: 'l-3' },
        { source: 'l-3', target: 'l-4' },
        { source: 'l-4', target: 'l-5' },
        { source: 'l-5', target: 'l-6' },
      ],
    },
    {
      id: 'ratio',
      label: 'The ratio to remember',
      pattern: 'warn',
      icon: 'scale',
      sub: 'five steps of transport around one step of work',
    },
  ],
  edges: [{ source: 'loop', target: 'ratio' }],
}

export const theMemoryProblem: Scene = {
  id: 'pyb-memory',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'budget',
      label: 'The executor’s memory, as Spark accounts for it',
      pattern: 'group',
      sub: 'Spark sizes, tracks and spills the JVM heap — it can do none of those things to a Python process',
      cols: 2,
      children: [
        { id: 'b-jvm', label: 'the JVM heap', pattern: 'service', sub: 'measured · spills when full' },
        { id: 'b-py', label: 'the Python process', pattern: 'warn', sub: 'unmeasured · cannot spill' },
      ],
    },
    {
      id: 'fail',
      label: 'So the failure arrives from outside Spark',
      pattern: 'group',
      sub: 'the container exceeds its limit and the kernel kills it — there is no Java exception to catch',
      cols: 3,
      children: [
        { id: 'f-oom', label: 'OOMKilled · exit 137', pattern: 'warn', sub: 'the kernel, not the JVM' },
        { id: 'f-nostack', label: 'no stack trace', pattern: 'warn', sub: 'nothing in the driver log explains it' },
        { id: 'f-conf', label: 'so budget for it', pattern: 'service', sub: 'memoryOverhead · pyspark.memory' },
      ],
    },
  ],
  edges: [{ source: 'budget', target: 'fail' }],
}

export const codegenLost: Scene = {
  id: 'pyb-codegen-lost',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'without',
      label: 'Without a UDF — one fused loop',
      pattern: 'group',
      sub: 'scan, filter and project compiled into a single generated Java method, marked *(1) in the plan',
      flow: 'LR',
      children: [
        { id: 'w-s', label: 'scan', pattern: 'service', sub: '*(1)', variant: 'tile' },
        { id: 'w-f', label: 'filter', pattern: 'service', sub: '*(1)', variant: 'tile' },
        { id: 'w-p', label: 'project', pattern: 'service', sub: '*(1)', variant: 'tile' },
      ],
      edges: [
        { source: 'w-s', target: 'w-f' },
        { source: 'w-f', target: 'w-p' },
      ],
    },
    {
      id: 'with',
      label: 'With one Python UDF in the middle',
      pattern: 'group',
      sub: 'BatchEvalPython has no * — it is a wall, and the loop that held three operators is now two loops',
      flow: 'LR',
      children: [
        { id: 'x-s', label: 'scan', pattern: 'service', sub: '*(1)', variant: 'tile' },
        { id: 'x-u', label: 'BatchEvalPython', pattern: 'warn', sub: 'no *', variant: 'tile' },
        { id: 'x-p', label: 'project', pattern: 'service', sub: '*(2)', variant: 'tile' },
      ],
      edges: [
        { source: 'x-s', target: 'x-u' },
        { source: 'x-u', target: 'x-p' },
      ],
    },
    {
      id: 'and',
      label: 'Opaque to Catalyst too',
      pattern: 'warn',
      icon: 'eyeOff',
      sub: 'a filter inside a UDF cannot be pushed down',
    },
  ],
  edges: [
    { source: 'without', target: 'with' },
    { source: 'with', target: 'and' },
  ],
}

export const arrow: Scene = {
  id: 'pyb-arrow',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'insight',
      label: 'Not a faster pickle',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'agree on ONE layout both sides read — stop converting',
    },
    {
      id: 'arrow',
      label: 'Apache Arrow — a columnar format neither side has to translate',
      pattern: 'group',
      sub: 'the JVM writes an Arrow batch; pandas and NumPy read that same memory · spark.sql.execution.arrow.pyspark.enabled',
      cols: 3,
      children: [
        { id: 'a-col', label: 'columnar, not row-wise', pattern: 'service', sub: 'a column at a time' },
        { id: 'a-batch', label: 'batched', pattern: 'service', sub: '10,000 rows, not one' },
        { id: 'a-shared', label: 'one layout, both sides', pattern: 'service', sub: 'no per-row conversion' },
      ],
    },
    {
      id: 'effect',
      label: 'What changes',
      pattern: 'group',
      sub: 'the transport cost stops scaling with your row count and starts scaling with your batch count',
      cols: 2,
      children: [
        { id: 'e-amortise', label: 'one crossing per 10k rows', pattern: 'service', sub: 'not one per row' },
        { id: 'e-vector', label: 'and your code vectorises', pattern: 'service', sub: 'NumPy on a whole column' },
      ],
    },
  ],
  edges: [
    { source: 'insight', target: 'arrow' },
    { source: 'arrow', target: 'effect' },
  ],
}

export const pandasUdfs: Scene = {
  id: 'pyb-pandas-udfs',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'udfs.py',
      minCols: 76,
      label: [
        'from pyspark.sql.functions import udf, pandas_udf',
        'import pandas as pd',
        '',
        '# 1. The slow one: called once PER ROW.',
        '@udf("double")',
        'def plus_one(v: float) -> float:',
        '    return v + 1.0',
        '',
        '# 2. The vectorised one: called once per ARROW BATCH,',
        '#    with ~10,000 rows in a pandas Series.',
        '@pandas_udf("double")',
        'def plus_one_fast(s: pd.Series) -> pd.Series:',
        '    return s + 1.0          # NumPy, on the whole column',
        '',
        '# The type hints are not documentation -- they are how',
        '# Spark decides which kind of UDF this is. Series -> Series',
        '# is a scalar UDF; Series -> scalar is an aggregate.',
        '',
        '@pandas_udf("double")',
        'def mean_udf(s: pd.Series) -> float:   # aggregate',
        '    return s.mean()',
        '',
        'df.groupBy("dest").agg(mean_udf("delay"))',
        '',
        '# Same answer as #1, same Python, one line different --',
        '# and typically an order of magnitude apart.',
      ].join('\n'),
    },
  ],
  edges: [],
}

export const iteratorAndMap: Scene = {
  id: 'pyb-iterator-map',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'Setup runs per batch',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'load a 2 GB model inside one, and it loads once per batch',
    },
    {
      id: 'iter',
      label: 'Iterator UDFs — set up once, then yield per batch',
      pattern: 'group',
      sub: 'Iterator[pd.Series] → Iterator[pd.Series]: everything before the loop runs once per PARTITION',
      cols: 2,
      children: [
        { id: 'i-setup', label: 'before the loop', pattern: 'service', sub: 'load the model · open a connection' },
        { id: 'i-yield', label: 'inside the loop', pattern: 'service', sub: 'yield one result per batch' },
      ],
    },
    {
      id: 'wider',
      label: 'And two that take whole frames',
      pattern: 'group',
      sub: 'when a Series is the wrong shape because your function needs several columns at once',
      cols: 2,
      children: [
        { id: 'w-map', label: 'mapInPandas', pattern: 'network', sub: 'DataFrame in, DataFrame out · any row count' },
        { id: 'w-cog', label: 'applyInPandas', pattern: 'network', sub: 'one group at a time — beware skew' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'iter' },
    { source: 'iter', target: 'wider' },
  ],
}

export const theDecision: Scene = {
  id: 'pyb-decision',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ladder',
      label: 'Try these in order, and stop at the first that works',
      pattern: 'group',
      sub: 'the ordering is not style — each rung down gives up something the engine was doing for you',
      children: [
        { id: 'r1', label: '1 · a built-in function', pattern: 'service', sub: 'stays in the JVM · fuses · optimizable' },
        { id: 'r2', label: '2 · a SQL expression', pattern: 'service', sub: 'still a tree Catalyst can read' },
        { id: 'r3', label: '3 · a pandas UDF', pattern: 'network', sub: 'leaves the JVM, but in batches' },
        { id: 'r4', label: '4 · a plain Python UDF', pattern: 'warn', sub: 'per row · the last resort' },
      ],
      edges: [
        { source: 'r1', target: 'r2' },
        { source: 'r2', target: 'r3' },
        { source: 'r3', target: 'r4' },
      ],
    },
    {
      id: 'check',
      label: 'And check which one you actually got',
      pattern: 'group',
      sub: 'the plan names it, so there is no need to guess whether the fast path was taken',
      cols: 2,
      children: [
        { id: 'c-batch', label: 'BatchEvalPython', pattern: 'warn', sub: 'the per-row path' },
        { id: 'c-arrow', label: 'ArrowEvalPython', pattern: 'service', sub: 'the vectorised path' },
      ],
    },
  ],
  edges: [{ source: 'ladder', target: 'check' }],
}

export const pysparkBoundaryScenes: Scene[] = [
  twoProcesses,
  py4j,
  dataframeIllusion,
  theUdfCrossing,
  theRoundTrip,
  theMemoryProblem,
  codegenLost,
  arrow,
  pandasUdfs,
  iteratorAndMap,
  theDecision,
]
