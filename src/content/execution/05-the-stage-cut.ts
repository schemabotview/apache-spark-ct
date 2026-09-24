import type { Section } from '../types'

export const theStageCut: Section = {
  id: 'the-stage-cut',
  title: 'Stages break at shuffles, and nowhere else',
  scene: 'exec-stage-cut',
  focus: 'cut',
  slide: `## Stages break at shuffles

Spark packs **as much as it possibly can** into one stage. Exactly one thing makes it stop: a shuffle.

\`\`\`
scan → filter → project        ← all one stage
    ↓ Exchange                 ← the boundary
aggregate → write              ← the next stage
\`\`\`

### The barrier is the expensive part
Stage 1 cannot begin until Stage 0 is **entirely** done. Not mostly. Entirely.

The slowest task in Stage 0 holds up **every** task in Stage 1. One straggler stalls the whole cluster — which is why skew hurts so much more than it looks like it should.

### Three costs at every boundary
- **Pipelining ends** — the fusion stops here
- **Materialisation** — every row is written to local disk first
- **The barrier** — everything waits for the slowest task

> \`n\` shuffles → \`n + 1\` stages. That's the whole algorithm.`,
  narration:
    "Stages aren't a scheduling concept Spark invented with its own rules to learn. A stage is just the run of work between two shuffles. Spark's planner packs as much as it possibly can into one stage — scan, filter, project, another filter, all fused into a single pass over each partition — and the only thing that ever makes it stop and start a new one is a shuffle. So if your job has one shuffle it has two stages. Four shuffles, five stages. You can count them off the plan without running anything. Now, three things cost you at every boundary, and they're worth separating. First, pipelining ends. All that fusing of narrow operations into one pass stops dead at the line. Second, materialisation — every row that the stage produced is written out to local disk before a single task of the next stage begins. And third, the barrier, which is the one people underestimate. Stage one cannot start until stage zero is entirely finished. Not mostly finished. Entirely. Think about what that means with two hundred tasks. A hundred and ninety-nine of them complete in ten seconds. One of them, because it got a partition with far more rows in it, takes forty minutes. For those forty minutes your entire cluster is doing nothing, waiting. Every executor idle, every slot empty, because the next stage cannot legally begin. That's why skew hurts so much more than it seems like it should — it isn't that one task is slow, it's that one slow task idles everything else. So: count the shuffles, and you have counted the stages, and you know where every barrier in your job is.",
}
