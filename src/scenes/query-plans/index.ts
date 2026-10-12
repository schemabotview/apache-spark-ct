import type { Scene } from '@graphlearning/flow'
import { planPhases } from './plan-phases'
import { analysisPhase } from './analysis-phase'
import { optimiseAndChoose } from './optimise-and-choose'
import { codegenAndMemory } from './codegen-and-memory'
import { exchangeStages } from './exchange-stages'
import { planAndTrace } from './plan-and-trace'

// One bundle per course folder, spread into src/scenes/index.ts.
export const queryPlansScenes: Scene[] = [
  planPhases,
  analysisPhase,
  optimiseAndChoose,
  codegenAndMemory,
  exchangeStages,
  planAndTrace,
]
