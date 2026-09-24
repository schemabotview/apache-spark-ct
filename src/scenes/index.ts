import type { Scene } from '@graphlearning/flow'
import { originsScenes } from './origins'
import { topologyScenes } from './topology'
import { rddScenes } from './rdd'
import { executionScenes } from './execution'
import { shuffleScenes } from './shuffle'
import { catalystScenes } from './catalyst'
import { tungstenScenes } from './tungsten'
import { pysparkBoundaryScenes } from './pyspark-boundary'
import { joinsScenes } from './joins'
import { formatsScenes } from './formats'
import { memoryScenes } from './memory'
import { aqeScenes } from './aqe'
import { streamingScenes } from './streaming'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous — and a scene is content-agnostic by design, so one may be shared across sections and
// across courses.
//
// Courses are added here as each is authored, in build order (shuffle first — see
// src/content/index.ts).
const ALL: Scene[] = [...originsScenes, ...topologyScenes, ...rddScenes, ...executionScenes, ...shuffleScenes, ...catalystScenes, ...tungstenScenes, ...pysparkBoundaryScenes, ...joinsScenes, ...formatsScenes, ...memoryScenes, ...aqeScenes, ...streamingScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
