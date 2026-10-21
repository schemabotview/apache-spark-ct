import type { Scene } from '@graphlearning/flow'
import { dataframeRows } from './dataframe'
import { readJson } from './json'
import { explicitSchema } from './schema'
import { readCsv } from './csv'
import { sources } from './parquet'

export const readScenes: Scene[] = [dataframeRows, readJson, explicitSchema, readCsv, sources]
