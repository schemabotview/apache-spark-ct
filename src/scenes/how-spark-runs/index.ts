import type { Scene } from '@graphlearning/flow'
import { firstJob } from './first-job'
import { cluster } from './cluster'
import { connect } from './connect'
import { lazy } from './lazy'
import { partitions } from './partitions'
import { narrowWide } from './narrow-wide'
import { stages } from './stages'
import { recompute } from './recompute'

export const howSparkRunsScenes: Scene[] = [firstJob, cluster, connect, lazy, partitions, narrowWide, stages, recompute]
