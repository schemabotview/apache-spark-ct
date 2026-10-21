import type { Scene } from '@graphlearning/flow'
import { writeParquet } from './parquet'
import { partitionedOutput } from './partitioned'
import { bringToDriver } from './collect'
import { taskSideEffects } from './side-effects'
import { wholeBatchJob } from './whole-job'

export const writeScenes: Scene[] = [writeParquet, partitionedOutput, bringToDriver, taskSideEffects, wholeBatchJob]
