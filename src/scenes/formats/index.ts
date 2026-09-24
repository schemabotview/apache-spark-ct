import type { Scene } from '@graphlearning/flow'

// Course 10 (formats) scenes. The claim the course builds toward is that "Parquet is fast" is not a
// property of Parquet — it is a property of what Spark is able to SKIP. So every scene after §2 is
// about a different thing the reader gets to not read: columns, row groups, pages, whole directories.

export const rowVsColumn: Scene = {
  id: 'fmt-row-vs-column',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'row',
      label: 'Row-wise — all of row 1, then all of row 2',
      pattern: 'group',
      sub: 'CSV, JSON, Avro, and every OLTP database — built for "give me this one record, all of it"',
      flow: 'LR',
      children: [
        { id: 'r1', label: 'r1: id, dest, cnt…', pattern: 'network', sub: 'all 200 columns' },
        { id: 'r2', label: 'r2: id, dest, cnt…', pattern: 'network', sub: 'all 200 columns' },
        { id: 'r3', label: 'r3: id, dest, cnt…', pattern: 'network', sub: 'all 200 columns' },
      ],
    },
    {
      id: 'col',
      label: 'Columnar — all of column 1, then all of column 2',
      pattern: 'group',
      sub: 'Parquet and ORC — built for "give me these three columns, for all ten billion rows"',
      flow: 'LR',
      children: [
        { id: 'c1', label: 'every id', pattern: 'service', sub: 'contiguous' },
        { id: 'c2', label: 'every dest', pattern: 'service', sub: 'contiguous' },
        { id: 'c3', label: 'every cnt', pattern: 'service', sub: 'contiguous' },
      ],
    },
    {
      id: 'why',
      label: 'Which shape matches an analytical query',
      pattern: 'group',
      sub: 'analytics reads few columns of many rows — the opposite of what a row layout is good at',
      cols: 2,
      children: [
        { id: 'w-skip', label: 'skip 197 columns', pattern: 'service', sub: 'never read, not read-then-discard' },
        { id: 'w-comp', label: 'and compress better', pattern: 'service', sub: 'like values sit next to like values' },
      ],
    },
  ],
  edges: [
    { source: 'row', target: 'col' },
    { source: 'col', target: 'why' },
  ],
}

export const insideAParquetFile: Scene = {
  id: 'fmt-inside-parquet',
  padding: 0.12,
  flow: 'TB',
  nodes: [
    {
      id: 'file',
      label: 'One Parquet file',
      pattern: 'group',
      sub: 'hybrid, not purely columnar: split by rows first, then columnar INSIDE each split',
      children: [
        {
          id: 'rg1',
          label: 'Row group 1 — ~128 MB of rows',
          pattern: 'service',
          sub: 'a horizontal slice, self-contained: it can be read without any other row group',
          flow: 'LR',
          children: [
            { id: 'rg1-a', label: 'chunk: dest', pattern: 'network', sub: 'pages · ~1 MB each' },
            { id: 'rg1-b', label: 'chunk: country', pattern: 'network', sub: 'pages · ~1 MB each' },
            { id: 'rg1-c', label: 'chunk: cnt', pattern: 'network', sub: 'pages · ~1 MB each' },
          ],
        },
        { id: 'rg2', label: 'Row group 2', pattern: 'service', sub: 'the same three column chunks, for the next slice of rows' },
        { id: 'footer', label: 'The footer', pattern: 'warn', sub: 'the schema, and statistics for every chunk above' },
      ],
      edges: [
        { source: 'rg1', target: 'rg2' },
        { source: 'rg2', target: 'footer' },
      ],
    },
    {
      id: 'why',
      label: 'Why hybrid',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'a row group is skippable whole — and one task reads one',
    },
  ],
  edges: [{ source: 'file', target: 'why' }],
}

export const theFooter: Scene = {
  id: 'fmt-footer',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'read',
      label: 'Start at the END',
      pattern: 'service',
      icon: 'bookOpen',
      sub: 'the last 8 bytes say how far back the footer starts',
    },
    {
      id: 'holds',
      label: 'What the footer holds',
      pattern: 'group',
      sub: 'everything needed to decide what NOT to read, available before any data is touched',
      cols: 2,
      children: [
        { id: 'h-schema', label: 'the schema', pattern: 'network', sub: 'names, types, nesting' },
        { id: 'h-offsets', label: 'offsets', pattern: 'network', sub: 'where each chunk begins' },
        { id: 'h-stats', label: 'min / max per chunk', pattern: 'service', sub: 'the pushdown lives on this' },
        { id: 'h-nulls', label: 'null counts', pattern: 'service', sub: 'and distinct counts, sometimes' },
      ],
    },
    {
      id: 'consequence',
      label: 'So it is not streamable',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'a truncated file is unreadable, not partly readable',
    },
  ],
  edges: [
    { source: 'read', target: 'holds' },
    { source: 'holds', target: 'consequence' },
  ],
}

export const columnPruning: Scene = {
  id: 'fmt-column-pruning',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ask',
      label: 'SELECT dest, cnt',
      pattern: 'network',
      icon: 'filecode',
      sub: 'two attributes named → two chunks fetched, of 200',
    },
    {
      id: 'reads',
      label: 'What the reader actually fetches',
      pattern: 'group',
      sub: 'offsets from the footer point straight at the two chunks — everything else is seeked past',
      cols: 4,
      children: [
        { id: 'rd-1', label: 'chunk: dest', pattern: 'service', sub: 'read' },
        { id: 'rd-2', label: 'chunk: cnt', pattern: 'service', sub: 'read' },
        { id: 'rd-3', label: '198 other chunks', pattern: 'warn', sub: 'never touched' },
        { id: 'rd-4', label: 'bytes read: ~1%', pattern: 'service', sub: 'not 100% then filtered' },
      ],
    },
    {
      id: 'star',
      label: 'The real cost of *',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'it is not verbosity — it is a 100× increase in bytes read',
    },
  ],
  edges: [
    { source: 'ask', target: 'reads' },
    { source: 'reads', target: 'star' },
  ],
}

export const predicatePushdown: Scene = {
  id: 'fmt-predicate-pushdown',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'filter',
      label: 'WHERE cnt > 5000',
      pattern: 'network',
      icon: 'filter',
      sub: 'answered from statistics, before any row is read',
    },
    {
      id: 'groups',
      label: 'The footer already says what is in each row group',
      pattern: 'group',
      sub: 'compare the predicate against min and max — and two of these three need not be opened at all',
      cols: 3,
      children: [
        { id: 'g-1', label: 'group 1 · max 400', pattern: 'warn', sub: 'skipped — nothing can match' },
        { id: 'g-2', label: 'group 2 · max 120', pattern: 'warn', sub: 'skipped — nothing can match' },
        { id: 'g-3', label: 'group 3 · max 9000', pattern: 'service', sub: 'read it — something might' },
      ],
    },
    {
      id: 'sorted',
      label: 'Which is why sortedness is worth money',
      pattern: 'group',
      sub: 'statistics only exclude a group when its range is narrow — and sorting is what makes ranges narrow',
      cols: 2,
      children: [
        { id: 's-rand', label: 'unsorted', pattern: 'warn', sub: 'every group spans 0…9999 — nothing skips' },
        { id: 's-sort', label: 'sorted on the filter column', pattern: 'service', sub: 'each group a tight range' },
      ],
    },
  ],
  edges: [
    { source: 'filter', target: 'groups' },
    { source: 'groups', target: 'sorted' },
  ],
}

export const encodingCompression: Scene = {
  id: 'fmt-encoding',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'two',
      label: 'Two different steps people say in one breath',
      pattern: 'group',
      sub: 'encoding understands the data and is type-aware; compression does not and is not',
      cols: 2,
      children: [
        { id: 't-enc', label: 'encoding', pattern: 'service', sub: 'a smarter representation of the values' },
        { id: 't-comp', label: 'compression', pattern: 'network', sub: 'generic squeezing, applied after' },
      ],
    },
    {
      id: 'encodings',
      label: 'The encodings that do the real work',
      pattern: 'group',
      sub: 'each exploits a property a COLUMN has and a row never does — repetition, ordering, narrow range',
      cols: 3,
      children: [
        { id: 'e-dict', label: 'dictionary', pattern: 'service', sub: '"United States" → 0, stored once' },
        { id: 'e-rle', label: 'run-length', pattern: 'service', sub: '0,0,0,0,0 → (0 × 5)' },
        { id: 'e-delta', label: 'delta', pattern: 'service', sub: 'store differences, not values' },
      ],
    },
    {
      id: 'codecs',
      label: 'And then a codec on top',
      pattern: 'group',
      sub: 'snappy is the default because decompression speed usually matters more than ratio',
      cols: 3,
      children: [
        { id: 'c-snappy', label: 'snappy', pattern: 'service', sub: 'fast · splittable · the default' },
        { id: 'c-zstd', label: 'zstd', pattern: 'network', sub: 'smaller, nearly as fast — worth testing' },
        { id: 'c-gzip', label: 'gzip', pattern: 'warn', sub: 'smallest, slowest to read' },
      ],
    },
  ],
  edges: [
    { source: 'two', target: 'encodings' },
    { source: 'encodings', target: 'codecs' },
  ],
}

export const partitionedDirectories: Scene = {
  id: 'fmt-partitioned-dirs',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'layout',
      label: 'The directory names ARE an index',
      pattern: 'group',
      sub: 'written by partitionBy("year","month") — and the values are not stored in the files at all',
      flow: 'LR',
      children: [
        { id: 'd-1', label: 'year=2024/month=01', pattern: 'storage', sub: 'part-0000.parquet …' },
        { id: 'd-2', label: 'year=2024/month=02', pattern: 'storage', sub: 'part-0000.parquet …' },
        { id: 'd-3', label: 'year=2026/month=09', pattern: 'storage', sub: 'part-0000.parquet …' },
      ],
    },
    {
      id: 'free',
      label: 'Which makes the column free, twice over',
      pattern: 'group',
      sub: 'it costs no bytes on disk, and a filter on it is answered by listing paths rather than reading data',
      cols: 2,
      children: [
        { id: 'f-space', label: 'not stored', pattern: 'service', sub: 'inferred from the path' },
        { id: 'f-skip', label: 'whole directories skipped', pattern: 'service', sub: 'before a file is opened' },
      ],
    },
    {
      id: 'wrong',
      label: 'And how it goes wrong',
      pattern: 'group',
      sub: 'a partition column must be low-cardinality — the failure is thousands of directories with one tiny file each',
      cols: 2,
      children: [
        { id: 'wr-high', label: 'partitioning by user_id', pattern: 'warn', sub: 'a million directories' },
        { id: 'wr-nofilter', label: 'or nobody filters on it', pattern: 'warn', sub: 'all cost, no benefit' },
      ],
    },
  ],
  edges: [
    { source: 'layout', target: 'free' },
    { source: 'free', target: 'wrong' },
  ],
}

export const twoKindsOfPruning: Scene = {
  id: 'fmt-two-prunings',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ladder',
      label: 'Four things the reader gets to skip, coarsest first',
      pattern: 'group',
      sub: 'each rung is cheaper than the one below it, because it is decided with less information read',
      children: [
        { id: 'p-dir', label: '1 · whole directories', pattern: 'service', sub: 'partition pruning — from the path alone' },
        { id: 'p-file', label: '2 · whole files', pattern: 'service', sub: 'from the footer, without reading data' },
        { id: 'p-group', label: '3 · row groups', pattern: 'network', sub: 'from min/max in the footer' },
        { id: 'p-page', label: '4 · pages', pattern: 'network', sub: 'from the page index, if present' },
      ],
      edges: [
        { source: 'p-dir', target: 'p-file' },
        { source: 'p-file', target: 'p-group' },
        { source: 'p-group', target: 'p-page' },
      ],
    },
    {
      id: 'left',
      label: 'And only then, what is left',
      pattern: 'warn',
      icon: 'filter',
      sub: 'the filter finally runs on rows — on whatever survived all four',
    },
  ],
  edges: [{ source: 'ladder', target: 'left' }],
}

export const smallFileProblem: Scene = {
  id: 'fmt-small-files',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'How a million tiny files happen',
      pattern: 'group',
      sub: 'nobody chooses this — it is what a streaming job or an over-partitioned write does by default',
      cols: 2,
      children: [
        { id: 'ca-stream', label: 'a job writing every minute', pattern: 'warn', sub: 'one file per partition, per run' },
        { id: 'ca-parts', label: '200 partitions × 365 days', pattern: 'warn', sub: 'by design, and nobody noticed' },
      ],
    },
    {
      id: 'costs',
      label: 'Three costs, and the first is the worst',
      pattern: 'group',
      sub: 'the driver has to enumerate every file before any executor starts — on object storage that is an API call each',
      cols: 3,
      children: [
        { id: 'co-list', label: 'listing, on the driver', pattern: 'warn', sub: 'minutes before the job begins' },
        { id: 'co-task', label: 'one task per file, at least', pattern: 'warn', sub: 'scheduling a task to read 4 KB' },
        { id: 'co-foot', label: 'a footer read per file', pattern: 'warn', sub: 'the metadata outweighs the data' },
      ],
    },
    {
      id: 'fix',
      label: 'The fixes, in order of how often they are the right one',
      pattern: 'group',
      sub: 'aim for files in the region of 128 MB to 1 GB — the exact number matters far less than the order of magnitude',
      cols: 3,
      children: [
        { id: 'fx-part', label: 'repartition before write', pattern: 'service', sub: 'control the file count directly' },
        { id: 'fx-compact', label: 'compact on a schedule', pattern: 'service', sub: 'rewrite yesterday into few files' },
        { id: 'fx-less', label: 'partition by less', pattern: 'service', sub: 'day, not hour; drop a level' },
      ],
    },
  ],
  edges: [
    { source: 'cause', target: 'costs' },
    { source: 'costs', target: 'fix' },
  ],
}

export const schemaEvolution: Scene = {
  id: 'fmt-schema-evolution',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'safe',
      label: 'What you can change safely',
      pattern: 'group',
      sub: 'Parquet matches columns by NAME, not by position — which is what makes these safe',
      cols: 2,
      children: [
        { id: 'sa-add', label: 'add a column', pattern: 'service', sub: 'old files read it as null' },
        { id: 'sa-reorder', label: 'reorder columns', pattern: 'service', sub: 'position was never load-bearing' },
      ],
    },
    {
      id: 'unsafe',
      label: 'What you cannot',
      pattern: 'group',
      sub: 'each of these produces nulls or an error at read time, in files written before the change',
      cols: 3,
      children: [
        { id: 'un-rename', label: 'rename a column', pattern: 'warn', sub: 'it is a new column; the old is gone' },
        { id: 'un-type', label: 'narrow a type', pattern: 'warn', sub: 'long → int has nowhere to put the value' },
        { id: 'un-drop', label: 'drop and re-add', pattern: 'warn', sub: 'with a different type — worst of all' },
      ],
    },
    {
      id: 'merge',
      label: 'mergeSchema: off, rightly',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'it reads EVERY footer — ruinous for a million files',
    },
  ],
  edges: [
    { source: 'safe', target: 'unsafe' },
    { source: 'unsafe', target: 'merge' },
  ],
}

export const csvAndJson: Scene = {
  id: 'fmt-csv-json',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'missing',
      label: 'What a text format does not have',
      pattern: 'group',
      sub: 'every optimisation in this course rested on metadata — and a CSV has none of it',
      cols: 4,
      children: [
        { id: 'm-schema', label: 'no schema', pattern: 'warn', sub: 'everything is text' },
        { id: 'm-stats', label: 'no statistics', pattern: 'warn', sub: 'nothing to skip on' },
        { id: 'm-cols', label: 'no column layout', pattern: 'warn', sub: 'no pruning possible' },
        { id: 'm-index', label: 'no footer', pattern: 'warn', sub: 'read it or do not' },
      ],
    },
    {
      id: 'infer',
      label: 'inferSchema: an extra pass',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'read once to guess types, then again to load',
    },
    {
      id: 'do',
      label: 'So: declare the schema, and convert once',
      pattern: 'group',
      sub: 'CSV and JSON are interchange formats — fine at the edge of a system, wrong as a place to keep data',
      cols: 2,
      children: [
        { id: 'do-schema', label: 'pass an explicit schema', pattern: 'service', sub: 'one pass, and no wrong guesses' },
        { id: 'do-convert', label: 'land it, then convert', pattern: 'service', sub: 'read CSV once, write Parquet' },
      ],
    },
  ],
  edges: [
    { source: 'missing', target: 'infer' },
    { source: 'infer', target: 'do' },
  ],
}

export const formatsScenes: Scene[] = [
  rowVsColumn,
  insideAParquetFile,
  theFooter,
  columnPruning,
  predicatePushdown,
  encodingCompression,
  partitionedDirectories,
  twoKindsOfPruning,
  smallFileProblem,
  schemaEvolution,
  csvAndJson,
]
