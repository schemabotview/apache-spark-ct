import type { Section } from '../types'

export const slots: Section = {
  id: 'slots',
  title: 'Slots, waves, and the arithmetic worth doing',
  scene: 'exec-slots',
  focus: 'ragged',
  slide: `## Slots and waves

Tasks queue. They don't run in parallel past the number of cores you actually have.

\`\`\`
200 tasks over 100 slots  →  2 waves, every slot busy
201 tasks over 100 slots  →  3 waves
\`\`\`

That third wave is **one task and 99 idle cores**, for the full duration of a task. One extra partition cost you 50% more wall-clock time.

### The arithmetic worth doing before any tuning
| | |
|---|---|
| \`executors × cores\` | every slot you will ever have |
| \`partitions\` | should be a **multiple** of that |

2–4× the slot count is the usual advice: enough that a slow partition doesn't leave a long ragged tail, few enough that scheduling overhead stays small.

> It's free, it takes ten seconds, and it's frequently the whole problem.`,
  narration:
    "Here's a piece of arithmetic that costs nothing and frequently explains an entire performance problem. Tasks queue. They do not run in parallel beyond the number of cores you actually have. So if your stage has two hundred tasks and your cluster has a hundred slots, those tasks run in two waves. First hundred, then the next hundred. Every slot busy throughout. That's ideal. Now add one partition. Two hundred and one tasks over a hundred slots. That's three waves — and the third wave contains exactly one task, while ninety-nine cores sit completely idle for the full duration of that task. You added half a percent more data and made the stage fifty percent longer in wall-clock time. That's the ragged tail, and it's a real and common effect. So before you tune anything else, do this. Multiply your executors by your cores per executor. That's every slot you will ever have — the hard ceiling on parallelism. Then look at your partition count and ask whether it's a sensible multiple of that number. The usual advice is somewhere between two and four times the slot count. Why more than one times? Because if every task took exactly the same time, one wave would be perfect — but they don't. Some partitions are bigger, some machines are slower. With two to four tasks per slot, a slow one gets absorbed by the others finishing early and picking up more work. Go much higher and scheduling overhead starts to dominate; you'll see tasks completing in single-digit milliseconds, which means you're spending more time dispatching work than doing it.",
}
