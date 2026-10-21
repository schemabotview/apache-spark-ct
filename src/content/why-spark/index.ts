import type { Course } from '../types'
import { oneMachine } from './01-when-one-machine-is-not-enough'
import { scaleUpOrOut } from './02-scale-up-or-scale-out'
import { partitionsAndLocality } from './03-partitions-and-locality'
import { mapreduceToSpark } from './04-from-mapreduce-to-spark'
import { whatWeWillBuild } from './05-what-we-will-build'

export const whySpark: Course = {
  id: 'why-spark',
  title: 'Why Spark',
  sections: [oneMachine, scaleUpOrOut, partitionsAndLocality, mapreduceToSpark, whatWeWillBuild],
}
