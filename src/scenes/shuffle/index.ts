import type { Scene } from '@graphlearning/flow'
import { dependencies } from './dependencies'
import { stageCut } from './stage-cut'
import { mapWrite } from './map-write'
import { exchange } from './exchange'
import { reduceFetch } from './reduce-fetch'
import { partitionCount } from './partition-count'
import { skew } from './skew'
import { avoiding } from './avoiding'
import { aqeLoop } from './aqe-loop'
import { readingUi } from './reading-ui'

// Course 5 (shuffle) scenes — one per section, mirroring src/content/shuffle. Two of the ten are
// code cards (§6 partition-count, and the config band of §10's neighbour) and one is a table (§10);
// the other seven are node/edge diagrams, which is the shape this course is for.
export const shuffleScenes: Scene[] = [
  dependencies,
  stageCut,
  mapWrite,
  exchange,
  reduceFetch,
  partitionCount,
  skew,
  avoiding,
  aqeLoop,
  readingUi,
]

// ── HOUSE RULES for scenes in this repo, learned by looking at the rendered frames (2026-09-24) ──
// A LEAF card is a fixed width (~210px at capture scale). It does NOT grow to fit its text, so:
//   · label ≤ ~22 chars   — longer wraps past the card's top border
//   · sub   ≤ ~50 chars   — longer spills out of the bottom border, over whatever is below
// A GROUP node is full-width and its label/sub may run long — so anything that needs a sentence
// belongs on a group, or on the slide, never on a leaf.
// An inner group whose children are chained by edges stacks along the SCENE's flow: give it its own
// `flow: 'LR'` when the chain should read across rather than down, or the scene becomes a tall
// narrow ribbon and the type shrinks to fit it.
// `variant: 'tile'` renders a large icon with small text under it — use it for things being counted
// (tasks, partitions), never for things being read.
// Edge labels ride the midpoint of the edge: keep them ≤ ~40 chars and only where there is room,
// or they land on top of a node.
