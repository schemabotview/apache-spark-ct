import type { Scene } from '@graphlearning/flow'
import { originsScenes } from './origins'
import { topologyScenes } from './topology'
import { rddScenes } from './rdd'
import { shuffleScenes } from './shuffle'
import { joinsScenes } from './joins'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous — and a scene is content-agnostic by design, so one may be shared across sections and
// across courses.
//
// Courses are added here as each is authored, in build order (shuffle first — see
// src/content/index.ts).
const ALL: Scene[] = [...originsScenes, ...topologyScenes, ...rddScenes, ...shuffleScenes, ...joinsScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
