import type { Course } from '../types'
import { dataframesAndRows } from './01-dataframes-and-rows'
import { readingJson } from './02-reading-json'
import { anExplicitSchema } from './03-an-explicit-schema'
import { readingCsv } from './04-reading-csv'
import { filesParquetJdbc } from './05-files-parquet-and-jdbc'

export const read: Course = {
  id: 'read',
  title: 'Read the data',
  sections: [dataframesAndRows, readingJson, anExplicitSchema, readingCsv, filesParquetJdbc],
}
