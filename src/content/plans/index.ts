import type { Course } from '../types'
import { fromCodeToPlans } from './01-from-code-to-plans'
import { analysisSection } from './02-analysis'
import { optimisationAndStrategy } from './03-optimisation-and-strategy'
import { codegenAndMemory } from './04-code-generation-and-memory'
import { exchangesAndStages } from './05-exchanges-and-stages'
import { aPlanAndItsTrace } from './06-a-plan-and-its-trace'

export const plans: Course = {
  id: 'plans',
  title: 'Read the plan',
  sections: [fromCodeToPlans, analysisSection, optimisationAndStrategy, codegenAndMemory, exchangesAndStages, aPlanAndItsTrace],
}
