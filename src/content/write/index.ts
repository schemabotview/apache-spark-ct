import type { Course } from '../types'
import { writingParquet } from './01-writing-parquet'
import { partitionedOutput } from './02-partitioned-output'
import { bringingResults } from './03-bringing-results-to-the-driver'
import { sideEffectsInTasks } from './04-side-effects-in-tasks'
import { theWholeBatchJob } from './05-the-whole-batch-job'

export const write: Course = {
  id: 'write',
  title: 'Write the results',
  sections: [writingParquet, partitionedOutput, bringingResults, sideEffectsInTasks, theWholeBatchJob],
}
