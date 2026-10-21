import type { Scene } from '@graphlearning/flow'
import { projectTour } from './tour'
import { newProject } from './new-project'
import { firstSession } from './first-session'
import { replBeside } from './repl'
import { analysisError } from './analysis-error'
import { jobError } from './job-error'

export const startScenes: Scene[] = [projectTour, newProject, firstSession, replBeside, analysisError, jobError]
