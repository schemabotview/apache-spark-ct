import type { Section } from '../types'

export const theStageCut: Section = {
  id: 'the-stage-cut',
  title: 'The stage boundary is the shuffle',
  scene: 'shuffle-stage-cut',
  focus: 'exchange',
  slide: `## The stage boundary *is* the shuffle

Stages aren't a scheduling detail Spark invented. **Count the shuffles and you have counted the stages.**

### One rule
- Spark packs **as much as possible** into one stage
- It starts a new one **only** after a shuffle — never anywhere else
- \`n\` shuffles → \`n + 1\` stages. That's the whole algorithm.

### What a boundary costs you
| | |
|---|---|
| **Pipelining ends** | narrow ops fused into one pass; the shuffle breaks the fusion |
| **Materialisation** | every row is written to disk before anything downstream starts |
| **A barrier** | Stage 1 cannot begin until the *slowest* task of Stage 0 finishes |

### Find them without guessing
\`\`\`
df.explain()   →   every "Exchange" is a stage boundary
\`\`\`
No \`Exchange\` in the plan means no shuffle — and nothing in this course applies.`,
  narration:
    "Once you know what a wide dependency is, stages stop being mysterious. People tend to think of a stage as some scheduling concept Spark invented, with its own rules you have to learn. It isn't. A stage is just the run of work between two shuffles. That's the entire definition. Spark's planner packs as much as it possibly can into one stage — scan, filter, project, another filter, all fused together into a single pass over each partition — and the only thing that ever makes it stop and start a new one is a shuffle. So if your job has one shuffle, it has two stages. Three shuffles, four stages. You can count them off the plan without running anything. And that boundary is expensive in three separate ways that are worth separating. First, the pipelining ends. All that fusing of narrow operations into one pass stops dead at the line. Second, everything gets materialised — every row that Stage 0 produced is written out to disk before a single task of Stage 1 begins. We'll spend the next section on exactly how. And third, it's a barrier. Stage 1 cannot start until the slowest task in Stage 0 has finished. Not the average task. The slowest one. Hold on to that, because in a few sections it's going to explain why one bad key can make an entire cluster sit idle for an hour. The practical takeaway is small: run explain on your DataFrame and look for the word Exchange. Each one is a stage boundary. If there's no Exchange, there's no shuffle, and none of this applies to you.",
}
