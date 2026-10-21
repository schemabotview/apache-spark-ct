import type { Scene } from '@graphlearning/flow'
import { workload } from './workload'
import { scale } from './scale'
import { partitions } from './partitions'
import { history } from './history'
import { build } from './build'

export const whySparkScenes: Scene[] = [workload, scale, partitions, history, build]
