import type { Course } from '../types'
import {
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
} from './sections'

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
