import type { Scene } from '@graphlearning/flow'
import { codeToPlans } from './plans'
import { planAnalysis } from './analysis'
import { optimiseStrategy } from './joins'
import { codegenMemory } from './codegen'
import { exchangesStages } from './stages'
import { planTrace } from './trace'

export const plansScenes: Scene[] = [codeToPlans, planAnalysis, optimiseStrategy, codegenMemory, exchangesStages, planTrace]
