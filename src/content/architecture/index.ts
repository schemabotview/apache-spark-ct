import type { Course } from '../types'
import { localApplication } from './01-local-application'
import { driverAndExecutors } from './02-driver-and-executors'
import { classicVsConnect } from './03-classic-vs-connect'
import { lazyEvaluation } from './04-lazy-evaluation'
import { partitionsAndTasks } from './05-partitions-and-tasks'
import { narrowAndWide } from './06-narrow-and-wide'
import { jobsStagesTasks } from './07-jobs-stages-tasks'
import { traceAndRecompute } from './08-trace-and-recompute'

// Chapter 2 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
export const architecture: Course = {
  id: 'architecture',
  title: 'Spark Architecture and Execution Model',
  sections: [
    localApplication,
    driverAndExecutors,
    classicVsConnect,
    lazyEvaluation,
    partitionsAndTasks,
    narrowAndWide,
    jobsStagesTasks,
    traceAndRecompute,
  ],
}
