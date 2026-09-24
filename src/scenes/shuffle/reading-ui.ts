import type { Scene } from '@graphlearning/flow'

// §10 reading-the-ui — the closer, and a TABLE because the section's content is a comparison across
// a fixed set of metrics. Two columns: what a healthy shuffle looks like and what the same row says
// when something is wrong. The right-hand column is the useful half — every line is a symptom the
// previous nine sections have already explained, so this frame doubles as the course's recap and
// the thing to keep on screen while looking at a real job.
export const readingUi: Scene = {
  id: 'shuffle-reading-ui',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'first',
      label: 'Start with the plan',
      pattern: 'network',
      icon: 'search',
      sub: 'df.explain() — no Exchange, no shuffle',
    },
    {
      id: 'metrics',
      kind: 'table',
      pattern: 'service',
      label: 'The Stages tab, for the stage on the read side of an Exchange',
      sub: 'every row here is a symptom one of the last nine sections explained',
      headers: ['Metric', 'Healthy', 'What it means when it is not'],
      values: [
        ['Shuffle Read', 'close to Shuffle Write', 'far larger — you are re-shuffling data you already shuffled'],
        ['Duration (max vs median)', 'within ~2×', '100× — skew: one key, one task (§7)'],
        ['Spill (memory) / (disk)', 'zero', 'non-zero — partitions too big for execution memory (§5, §6)'],
        ['Tasks', 'a multiple of total cores', 'exactly 200 — nobody sized it, it is the default (§6)'],
        ['GC Time', 'a few % of duration', 'a third of duration — the task is thrashing, not computing'],
        ['Stages marked "skipped"', 'expected on a re-run', 'this is shuffle persistence working, not a bug (§4)'],
      ],
    },
  ],
  edges: [{ source: 'first', target: 'metrics', label: 'only then, the Stages tab' }],
}
