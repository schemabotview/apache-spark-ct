import type { Scene } from '@graphlearning/flow'

// §3.8 — the four abstractions side by side as reference cards. Typed Datasets are Scala/Java only;
// the 4.0.1 SQL guide states Python has no Dataset API.
export const abstractionChoice: Scene = {
  id: 'abstraction-choice',
  title: 'Four abstractions, one engine',
  flow: 'TB',
  nodes: [
    {
      id: 'abstraction-cards',
      label: 'What each one gives you',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'rdd-card',
          kind: 'list',
          framed: true,
          label: 'RDD',
          sub: 'functions over objects',
          icon: 'boxes',
          pattern: 'warn',
          items: ['Any Python object, any function', 'No schema: the optimizer cannot look inside', 'Low-level control of partitions', 'Not available over Spark Connect'],
        },
        {
          id: 'dataframe-card',
          kind: 'list',
          framed: true,
          label: 'DataFrame',
          sub: 'named, typed columns',
          icon: 'table',
          pattern: 'service',
          items: ['Optimized plans, pushdown, pruning', 'Built-ins run inside the engine', 'Python, Scala, Java and R', 'This course’s main API'],
        },
        {
          id: 'sql-card',
          kind: 'list',
          framed: true,
          label: 'SQL',
          sub: 'the same engine, as text',
          icon: 'search',
          pattern: 'network',
          items: ['Same plans as DataFrames', 'Views and tables by name', 'Readable by analysts and tools', 'Mix freely with DataFrame code'],
        },
        {
          id: 'dataset-card',
          kind: 'list',
          framed: true,
          label: 'Typed Dataset',
          sub: 'Scala and Java only',
          icon: 'braces',
          pattern: 'external',
          items: ['Objects checked at compile time', 'No Python Dataset API', 'Typed lambdas are opaque, like RDDs', 'A DataFrame is Dataset[Row]'],
        },
      ],
    },
  ],
  edges: [],
}
