import type { Scene } from '@graphlearning/flow'
import { localAppLifecycle } from './local-app-lifecycle'
import { driverExecutors } from './driver-executors'
import { classicVsConnect } from './classic-vs-connect'
import { lazyPlan } from './lazy-plan'
import { partitionsToTasks } from './partitions-to-tasks'
import { narrowVsWide } from './narrow-vs-wide'
import { jobStageTask } from './job-stage-task'
import { taskRecovery } from './task-recovery'

// One bundle per course folder, spread into src/scenes/index.ts.
export const architectureScenes: Scene[] = [
  localAppLifecycle,
  driverExecutors,
  classicVsConnect,
  lazyPlan,
  partitionsToTasks,
  narrowVsWide,
  jobStageTask,
  taskRecovery,
]
