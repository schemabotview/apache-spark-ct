import type { Course } from '../types'
import { rowVsColumn } from './01-row-vs-column'
import { insideAParquetFile } from './02-inside-a-parquet-file'
import { theFooter } from './03-the-footer'
import { columnPruning } from './04-column-pruning'
import { predicatePushdown } from './05-predicate-pushdown'
import { encodingCompression } from './06-encoding-and-compression'
import { partitionedDirectories } from './07-partitioned-directories'
import { twoKindsOfPruning } from './08-two-kinds-of-pruning'
import { smallFileProblem } from './09-the-small-file-problem'
import { schemaEvolution } from './10-schema-evolution'
import { csvAndJson } from './11-csv-and-json'

// Course 10 of the spine. The claim it builds toward is that "Parquet is fast" is not a property of
// Parquet — it is a property of what the reader gets to SKIP. §§1–3 are the structure that makes
// skipping possible (columnar, hybrid row groups, the footer as the map). §§4–7 are four different
// things that get skipped. §8 collects them into one ladder and states the claim. §§9–11 are the
// three ways it stops working: files too small to amortise the metadata, a schema that moved, and a
// text format with no metadata at all.
export const formats: Course = {
  id: 'formats',
  title: 'Why Parquet is fast',
  sections: [
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
  ],
}
