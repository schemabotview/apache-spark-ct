import type { Scene } from '@graphlearning/flow'

// Course 14 (lakehouse) scenes — the spine's closer, and the one that answers the gap course 1 §7
// opened: Spark deliberately owns no storage, and "no owner means no guarantees".
//
// COURSE-PLAN.md §5 flags this as a single-derived-source course: the only coverage in the four
// books is one chapter of the 2E study notes. Grounded against the Delta and Iceberg specifications.
// The course deliberately teaches the MECHANISM (a log beside the data) rather than any one vendor's
// product, and §12 is honest about what actually differs between the three.

export const folderIsNotATable: Scene = {
  id: 'lake-folder-not-table',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'have',
      label: 'What you have: a directory of Parquet files',
      pattern: 'group',
      sub: 'excellent at being read — and that is the whole of what it is good at',
      cols: 2,
      children: [
        { id: 'h-fast', label: 'fast to scan', pattern: 'service', sub: 'columnar, pruned, compressed' },
        { id: 'h-open', label: 'readable by anything', pattern: 'service', sub: 'no vendor in the way' },
      ],
    },
    {
      id: 'missing',
      label: 'What a table has that this does not',
      pattern: 'group',
      sub: 'every one of these is something a database gave you for free, and you have quietly stopped having',
      cols: 4,
      children: [
        { id: 'm-atomic', label: 'atomic writes', pattern: 'warn', sub: 'all of it, or none' },
        { id: 'm-iso', label: 'isolation', pattern: 'warn', sub: 'a reader never sees a half-write' },
        { id: 'm-schema', label: 'schema enforcement', pattern: 'warn', sub: 'a bad write is rejected' },
        { id: 'm-history', label: 'history', pattern: 'warn', sub: 'what did this look like on Tuesday?' },
      ],
    },
    {
      id: 'why',
      label: 'Structural, not an oversight',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'object storage has no transactions, and no coordinator',
    },
  ],
  edges: [
    { source: 'have', target: 'missing' },
    { source: 'missing', target: 'why' },
  ],
}

export const thePartialWrite: Scene = {
  id: 'lake-partial-write',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'job',
      label: 'A job writing 200 files',
      pattern: 'group',
      sub: 'each task writes its own file, independently, and there is no moment when they all become visible together',
      cols: 3,
      children: [
        { id: 'j-1', label: '140 written', pattern: 'service', sub: 'and already visible' },
        { id: 'j-2', label: 'then it dies', pattern: 'warn', sub: 'OOM, eviction, a bad row' },
        { id: 'j-3', label: '60 never written', pattern: 'warn', sub: 'and nothing records that' },
      ],
    },
    {
      id: 'reader',
      label: 'A reader sees 140 files',
      pattern: 'warn',
      icon: 'eye',
      sub: 'a complete-looking table with 70% of the data, and no way to tell',
    },
    {
      id: 'worse',
      label: 'And the recovery is worse than the failure',
      pattern: 'group',
      sub: 'rerunning appends a second copy of the 140 — so now the table is wrong in a new way',
      cols: 2,
      children: [
        { id: 'w-dupes', label: 're-run → duplicates', pattern: 'warn', sub: 'the first 140, twice' },
        { id: 'w-clean', label: 'clean up → by hand', pattern: 'warn', sub: 'which files were this run’s?' },
      ],
    },
  ],
  edges: [
    { source: 'job', target: 'reader' },
    { source: 'reader', target: 'worse' },
  ],
}

export const theListingProblem: Scene = {
  id: 'lake-listing',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'assume',
      label: 'A directory listing feels free, and on object storage it is not',
      pattern: 'group',
      sub: 'S3 has no directories at all — the slashes in a key are a convention, and a "listing" is a paged API scan',
      cols: 2,
      children: [
        { id: 'a-fs', label: 'a filesystem', pattern: 'service', sub: 'a directory is a real structure' },
        { id: 'a-obj', label: 'object storage', pattern: 'warn', sub: 'a flat keyspace · prefix scans' },
      ],
    },
    {
      id: 'cost',
      label: 'So finding out what a table contains is itself expensive',
      pattern: 'group',
      sub: 'and it happens on the driver, single-threaded, before a single executor is given anything to do',
      cols: 3,
      children: [
        { id: 'c-api', label: '1000 keys per call', pattern: 'warn', sub: 'a million files = 1000 round trips' },
        { id: 'c-driver', label: 'on the driver', pattern: 'warn', sub: 'the cluster sits idle, paid for' },
        { id: 'c-part', label: 'and then per partition', pattern: 'warn', sub: 'directory discovery, on top' },
      ],
    },
    {
      id: 'idea',
      label: 'Which suggests the fix',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'stop asking storage what the table contains. Write it down.',
    },
  ],
  edges: [
    { source: 'assume', target: 'cost' },
    { source: 'cost', target: 'idea' },
  ],
}

export const theTransactionLog: Scene = {
  id: 'lake-transaction-log',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'layout',
      label: 'The data does not move — a log is added beside it',
      pattern: 'group',
      sub: 'still Parquet, still readable by anything; what changes is that something now says which files count',
      flow: 'LR',
      children: [
        { id: 'l-data', label: 'part-0000.parquet …', pattern: 'storage', sub: 'exactly as before' },
        { id: 'l-log', label: '_delta_log/', pattern: 'service', sub: '000.json · 001.json · 002.json' },
      ],
    },
    {
      id: 'entries',
      label: 'And each entry is an ordered list of what changed',
      pattern: 'group',
      sub: 'not the data — a record of intent: these files joined the table, these left it, under this schema',
      cols: 3,
      children: [
        { id: 'e-add', label: 'add', pattern: 'service', sub: 'this file is now part of the table' },
        { id: 'e-remove', label: 'remove', pattern: 'warn', sub: 'this one no longer is' },
        { id: 'e-meta', label: 'metadata', pattern: 'network', sub: 'the schema, and the partitioning' },
      ],
    },
    {
      id: 'definition',
      label: 'The LOG is the table',
      pattern: 'service',
      icon: 'bookOpen',
      sub: 'a file with no add entry is invisible, however real it is on disk',
    },
  ],
  edges: [
    { source: 'layout', target: 'entries' },
    { source: 'entries', target: 'definition' },
  ],
}

export const aCommit: Scene = {
  id: 'lake-commit',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'steps',
      label: 'Writing, in two phases',
      pattern: 'group',
      sub: 'the files can be written slowly and carelessly, because until the last step they are not part of anything',
      cols: 1,
      children: [
        { id: 's-1', label: '1 · write the files', pattern: 'network', sub: 'minutes · invisible to every reader' },
        { id: 's-2', label: '2 · append ONE log entry', pattern: 'service', sub: 'and the whole write becomes visible at once' },
      ],
    },
    {
      id: 'atomic',
      label: 'Which makes step 2 the atomic moment',
      pattern: 'group',
      sub: 'whether it succeeds comes down to one thing: can two writers both create 003.json?',
      cols: 2,
      children: [
        { id: 'a-win', label: 'one writer wins', pattern: 'service', sub: 'the entry exists · the write is committed' },
        { id: 'a-lose', label: 'the other retries', pattern: 'network', sub: 'against the new version — optimistic concurrency' },
      ],
    },
    {
      id: 'crash',
      label: 'A crash is now dull',
      pattern: 'service',
      icon: 'shield',
      sub: 'no entry written → the orphan files are not in the table',
    },
  ],
  edges: [
    { source: 'steps', target: 'atomic' },
    { source: 'atomic', target: 'crash' },
  ],
}

export const snapshotIsolation: Scene = {
  id: 'lake-snapshot',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'read',
      label: 'A reader resolves the version once, at the start',
      pattern: 'group',
      sub: 'read the log to version N, take the set of files it describes, and use that set for the whole query',
      cols: 2,
      children: [
        { id: 'r-pin', label: 'pins version 7', pattern: 'service', sub: 'a fixed set of files' },
        { id: 'r-scan', label: 'and reads only those', pattern: 'service', sub: 'for the entire query' },
      ],
    },
    {
      id: 'meanwhile',
      label: 'A writer commits v8',
      pattern: 'network',
      icon: 'edit',
      sub: 'and the running reader never sees any of it',
    },
    {
      id: 'why',
      label: 'Which is what actually makes the table usable',
      pattern: 'group',
      sub: 'writers stop needing a window when nobody is reading — the thing every nightly pipeline is scheduled around',
      cols: 2,
      children: [
        { id: 'w-consistent', label: 'a consistent answer', pattern: 'service', sub: 'never half of two versions' },
        { id: 'w-nolock', label: 'and no locking', pattern: 'service', sub: 'readers never block a writer' },
      ],
    },
  ],
  edges: [
    { source: 'read', target: 'meanwhile' },
    { source: 'meanwhile', target: 'why' },
  ],
}

export const timeTravel: Scene = {
  id: 'lake-time-travel',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'how',
      label: 'Not a feature — the same replay, stopped early',
      pattern: 'group',
      sub: 'the log is an ordered list, so replaying it to entry 5 instead of entry 12 gives the file set as of version 5',
      cols: 2,
      children: [
        { id: 'h-now', label: 'replay to the end', pattern: 'service', sub: 'today’s table' },
        { id: 'h-then', label: 'replay to entry 5', pattern: 'service', sub: 'Tuesday’s table' },
      ],
    },
    {
      id: 'uses',
      label: 'What it is actually for',
      pattern: 'group',
      sub: 'the debugging use is the one that pays for itself the first time a number changes and nobody knows why',
      cols: 3,
      children: [
        { id: 'u-debug', label: 'what changed?', pattern: 'network', sub: 'diff two versions, exactly' },
        { id: 'u-rollback', label: 'undo a bad write', pattern: 'network', sub: 'restore a previous version' },
        { id: 'u-repro', label: 'reproduce a model', pattern: 'network', sub: 'train on the data as it was' },
      ],
    },
    {
      id: 'cost',
      label: 'And it is not free',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'old versions exist because their files were never deleted — §11',
    },
  ],
  edges: [
    { source: 'how', target: 'uses' },
    { source: 'uses', target: 'cost' },
  ],
}

export const schemaEnforcement: Scene = {
  id: 'lake-schema',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Without a log: whatever you write becomes the table',
      pattern: 'group',
      sub: 'nothing is checked, so the error surfaces weeks later, in a query, as nulls nobody can explain',
      cols: 2,
      children: [
        { id: 'b-write', label: 'a column type changes', pattern: 'warn', sub: 'and the write succeeds' },
        { id: 'b-read', label: 'nulls appear, later', pattern: 'warn', sub: 'far from the job that caused it' },
      ],
    },
    {
      id: 'after',
      label: 'With a log: the schema is IN it, and the write is checked',
      pattern: 'group',
      sub: 'the failure moves to the moment it is caused, which is the whole of what enforcement buys',
      cols: 2,
      children: [
        { id: 'a-reject', label: 'a mismatched write fails', pattern: 'service', sub: 'at write time, loudly' },
        { id: 'a-evolve', label: 'unless you allow it', pattern: 'network', sub: 'mergeSchema, deliberately' },
      ],
    },
    {
      id: 'more',
      label: 'And the log can hold more than a schema',
      pattern: 'group',
      sub: 'constraints are the thing people arrive for and the thing they did not know they could have',
      cols: 2,
      children: [
        { id: 'm-null', label: 'NOT NULL', pattern: 'service', sub: 'enforced on every write' },
        { id: 'm-check', label: 'CHECK constraints', pattern: 'service', sub: 'amount > 0, and it means it' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'after' },
    { source: 'after', target: 'more' },
  ],
}

export const updatesAndDeletes: Scene = {
  id: 'lake-updates',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'problem',
      label: 'Parquet is immutable',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'no byte changes in place — the file must be replaced',
    },
    {
      id: 'cow',
      label: 'Copy-on-write — rewrite the whole file',
      pattern: 'group',
      sub: 'read the file containing the row, write a new one with the change, then add the new and remove the old in ONE entry',
      cols: 2,
      children: [
        { id: 'c-read', label: 'fast to read after', pattern: 'service', sub: 'nothing to reconcile' },
        { id: 'c-write', label: 'slow to write', pattern: 'warn', sub: 'one row changed → one file rewritten' },
      ],
    },
    {
      id: 'mor',
      label: 'Merge-on-read — write the change beside it',
      pattern: 'group',
      sub: 'record that a row is deleted, or write the new version alongside, and let the reader reconcile them',
      cols: 2,
      children: [
        { id: 'm-write', label: 'fast to write', pattern: 'service', sub: 'nothing is rewritten' },
        { id: 'm-read', label: 'slower to read', pattern: 'warn', sub: 'every read applies the deltas' },
      ],
    },
  ],
  edges: [
    { source: 'problem', target: 'cow' },
    { source: 'cow', target: 'mor', label: 'the other trade' },
  ],
}

export const compaction: Scene = {
  id: 'lake-compaction',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'cause',
      label: 'The small-file problem, now arriving faster',
      pattern: 'group',
      sub: 'a log makes frequent writes SAFE, which means people do them — and every commit adds files',
      cols: 2,
      children: [
        { id: 'ca-stream', label: 'a streaming write', pattern: 'warn', sub: 'files every trigger, forever' },
        { id: 'ca-merge', label: 'and every MERGE', pattern: 'warn', sub: 'rewrites files into more files' },
      ],
    },
    {
      id: 'fix',
      label: 'Compaction is a normal commit with an unusual content',
      pattern: 'group',
      sub: 'read many small files, write few large ones, and record both facts in one log entry',
      cols: 3,
      children: [
        { id: 'f-read', label: 'read 1000 small', pattern: 'network', sub: 'the current file set' },
        { id: 'f-write', label: 'write 10 large', pattern: 'service', sub: 'the same rows' },
        { id: 'f-commit', label: 'one entry: add + remove', pattern: 'service', sub: 'atomic, as ever' },
      ],
    },
    {
      id: 'safe',
      label: 'And readers are undisturbed',
      pattern: 'service',
      icon: 'shield',
      sub: 'a running query keeps its version — nothing is deleted yet',
    },
  ],
  edges: [
    { source: 'cause', target: 'fix' },
    { source: 'fix', target: 'safe' },
  ],
}

export const vacuum: Scene = {
  id: 'lake-vacuum',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'why',
      label: 'Nothing has been deleted',
      pattern: 'service',
      icon: 'archive',
      sub: 'remove takes a file out of the TABLE, not off the disk',
    },
    {
      id: 'vacuum',
      label: 'VACUUM is the only thing that actually deletes',
      pattern: 'group',
      sub: 'it removes files no live version references, older than a retention threshold — 7 days by default',
      cols: 2,
      children: [
        { id: 'v-keeps', label: 'keeps the retention window', pattern: 'service', sub: 'so recent versions still resolve' },
        { id: 'v-deletes', label: 'deletes what is older', pattern: 'warn', sub: 'and those versions stop existing' },
      ],
    },
    {
      id: 'danger',
      label: 'Which is the one irreversible operation here',
      pattern: 'group',
      sub: 'the retention default is not timidity — it is protecting a query that started before the vacuum did',
      cols: 2,
      children: [
        { id: 'd-short', label: 'shortening retention', pattern: 'warn', sub: 'can break a running long query' },
        { id: 'd-gone', label: 'and time travel ends', pattern: 'warn', sub: 'at whatever you vacuumed to' },
      ],
    },
  ],
  edges: [
    { source: 'why', target: 'vacuum' },
    { source: 'vacuum', target: 'danger' },
  ],
}

export const theThree: Scene = {
  id: 'lake-the-three',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'Delta, Iceberg, Hudi — what actually differs',
      sub: 'all three are a log beside Parquet · everything in this course applies to all of them',
      headers: ['', 'Shape of the metadata', 'Where it came from'],
      values: [
        ['Delta Lake', 'a JSON log, periodically checkpointed to Parquet', 'Databricks · closest to Spark by default'],
        ['Apache Iceberg', 'a tree of manifests — snapshot → manifest list → files', 'Netflix · built for very large tables and engine neutrality'],
        ['Apache Hudi', 'a timeline, with record-level indexes', 'Uber · built around upserts and incremental pulls'],
      ],
    },
    {
      id: 'advice',
      label: 'And the honest advice',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'the mechanism matters; the choice rarely does',
    },
  ],
  edges: [{ source: 'table', target: 'advice' }],
}

export const lakehouseScenes: Scene[] = [
  folderIsNotATable,
  thePartialWrite,
  theListingProblem,
  theTransactionLog,
  aCommit,
  snapshotIsolation,
  timeTravel,
  schemaEnforcement,
  updatesAndDeletes,
  compaction,
  vacuum,
  theThree,
]
