import type { Scene } from '@graphlearning/flow'

// Course 10 (formats) scenes. The claim the course builds toward is that "Parquet is fast" is not a
// property of Parquet — it is a property of what Spark is able to SKIP. So every scene after §2 is
// about a different thing the reader gets to not read: columns, row groups, pages, whole directories.

import { rowVsColumn } from './row-vs-column'
import { insideAParquetFile } from './inside-a-parquet-file'
import { theFooter } from './the-footer'
import { columnPruning } from './column-pruning'
import { predicatePushdown } from './predicate-pushdown'
import { encodingCompression } from './encoding-compression'
import { partitionedDirectories } from './partitioned-directories'
import { twoKindsOfPruning } from './two-kinds-of-pruning'
import { smallFileProblem } from './small-file-problem'
import { schemaEvolution } from './schema-evolution'
import { csvAndJson } from './csv-and-json'

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
