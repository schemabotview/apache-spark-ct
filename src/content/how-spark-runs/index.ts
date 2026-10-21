import type { Course } from '../types'
import { whatHappens } from './01-what-happens-when-you-run-a-job'
import { driverAndExecutors } from './02-driver-executors-and-the-cluster-manager'
import { classicAndConnect } from './03-classic-spark-and-spark-connect'
import { lazyEvaluation } from './04-transformations-actions-and-lazy-evaluation'
import { partitionsAndTasks } from './05-partitions-and-parallel-tasks'
import { narrowAndWide } from './06-narrow-and-wide-dependencies'
import { jobsStagesTasks } from './07-jobs-stages-and-tasks'
import { failedTask } from './08-a-failed-task-recomputed'

export const howSparkRuns: Course = {
  id: 'how-spark-runs',
  title: 'How Spark runs your code',
  sections: [whatHappens, driverAndExecutors, classicAndConnect, lazyEvaluation, partitionsAndTasks, narrowAndWide, jobsStagesTasks, failedTask],
}
