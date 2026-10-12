import type { Course } from '../types'
import { codeToPlans } from './01-code-to-plans'
import { analysis } from './02-analysis'
import { optimisationAndStrategy } from './03-optimisation-and-strategy'
import { codegenAndMemory } from './04-codegen-and-memory'
import { exchangesAndStages } from './05-exchanges-and-stages'
import { workedPlanAndTrace } from './06-worked-plan-and-trace'

// Chapter 5 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
// Plans and the execution trace come from PySpark 4.0.1 (local[4]) on 1,000,000 generated orders.
export const queryPlans: Course = {
  id: 'query-plans',
  title: 'Query Plans and Execution Internals',
  sections: [codeToPlans, analysis, optimisationAndStrategy, codegenAndMemory, exchangesAndStages, workedPlanAndTrace],
}
