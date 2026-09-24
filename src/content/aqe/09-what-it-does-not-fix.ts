import type { Section } from '../types'

export const whatItDoesNotFix: Section = {
  id: 'what-it-does-not-fix',
  title: 'What it does not fix',
  scene: 'aqe-limits',
  focus: 'others',
  slide: `## What it doesn't fix

### It right-sizes a shuffle. It never removes one.
Broadcasting, bucketing and reusing partitioning are all still worth more than anything here — they delete the shuffle; AQE makes a shuffle you're having anyway less bad.

### Three it can't reach
| | |
|---|---|
| **A single hot key** | one partition, nothing to cut along |
| **A job with no shuffle** | no boundary, so no re-plan |
| **The first stage** | nothing has been measured yet |

All three are the same limit: AQE only acts **at a shuffle boundary**, using what that shuffle measured.

### And it isn't a substitute for statistics
| | |
|---|---|
| \`ANALYZE TABLE\` | makes the **first** plan right |
| **AQE** | corrects a **wrong** one |

Both are worth having. AQE fixes things after the fact and costs a re-plan per stage; good statistics mean there was nothing to fix.

> It's a correction mechanism, not a planning strategy. Treating it as one is how people end up with jobs that are adequate rather than fast.`,
  narration:
    "Let's be clear about the limits, because adaptive execution gets described as though it solves performance, and it doesn't. First and most important: it right-sizes a shuffle, it never removes one. Broadcasting a small table, bucketing a table you join repeatedly, not throwing away partitioning you already have — all of those delete a shuffle entirely, and all of them are worth more than anything in this course. AQE makes a shuffle you were going to have anyway less bad. That's valuable, and it's a smaller category of win. Three things it can't reach, and they're all the same limit viewed from different angles. A single hot key can't be split, because one key's rows must all meet in one place and there's no boundary inside it to cut along. A job with no shuffle gets no adaptive behaviour at all, because there's no boundary at which to re-plan. And the first stage of any job can't benefit, because nothing has been measured yet — the first stage runs on estimates, always. The common thread: AQE only ever acts at a shuffle boundary, using what that shuffle measured. No boundary, no measurement, no help. And finally, it's not a substitute for computing statistics, though people treat it as one. Running ANALYZE TABLE means the first plan was right. AQE means a wrong plan gets corrected — after a stage has already run under it, and at the cost of a re-planning step per stage. Both are worth having and they're not alternatives. Treating AQE as a planning strategy rather than a correction mechanism is how people end up with jobs that are adequate instead of fast.",
}
