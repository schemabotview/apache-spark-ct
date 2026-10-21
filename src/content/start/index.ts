import type { Course } from '../types'
import { theFinishedProject } from './01-the-finished-project'
import { aNewProject } from './02-a-new-project'
import { theFirstSparkSession } from './03-the-first-sparksession'
import { theRepl } from './04-the-repl'
import { anAnalysisException } from './05-an-analysisexception'
import { anErrorInsideAJob } from './06-an-error-inside-a-job'

export const start: Course = {
  id: 'start',
  title: 'Start the project',
  sections: [theFinishedProject, aNewProject, theFirstSparkSession, theRepl, anAnalysisException, anErrorInsideAJob],
}
