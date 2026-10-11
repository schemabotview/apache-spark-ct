import type { Course } from '../types'
import { workloadLimits } from './01-workload-limits'
import { scaleUpVsScaleOut } from './02-scale-up-vs-scale-out'
import { partitioningAndLocality } from './03-partitioning-and-locality'
import { mapreduceToSpark } from './04-mapreduce-to-spark'
import { retailPipeline } from './05-retail-pipeline'

// Chapter 1 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
export const foundations: Course = {
  id: 'foundations',
  title: 'Foundations of Distributed Data Processing',
  sections: [workloadLimits, scaleUpVsScaleOut, partitioningAndLocality, mapreduceToSpark, retailPipeline],
}
