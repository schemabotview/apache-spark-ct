import type { Section } from '../types'

export const skewSplit: Section = {
  id: 'skew-split',
  title: 'Splitting a skewed partition',
  scene: 'aqe-skew-split',
  focus: 'split',
  slide: `## Splitting skew

### A partition is skewed only if **both** tests pass
| | |
|---|---|
| \`skewedPartitionFactor\` | more than **5×** the median |
| \`skewedPartitionThresholdInBytes\` | **and** more than **256 MB** |

Either alone gives false positives — on a tiny stage, or on a uniformly large one.

### The fix: split one side, replicate the other
Splitting alone would **lose matches**. If the big partition becomes 5 pieces, each piece still needs the rows it joins against — so the counterpart partition is **copied to all 5.**

One 90-minute task becomes five 18-minute tasks.

### Where it stops
| | |
|---|---|
| **A single hot key** | one partition, **nothing to cut along** |
| **Joins only** | sort-merge and shuffled hash |

> If 40% of your rows are \`user_id = NULL\`, all of them must still meet in one place. AQE can't help, and neither can anything else.`,
  narration:
    "The third re-plan is skew handling, and it's the one where it's most important to be precise about the limits. First, detection. A partition is considered skewed only if both of two tests pass. It must be more than five times the median partition size — that's skewedPartitionFactor. And it must be more than two hundred and fifty-six megabytes in absolute terms. Both, not either. And the reason for both is that either one alone produces false positives. On a tiny stage, one partition being five times the median might mean fifty kilobytes against ten — technically skewed, completely irrelevant. On a uniformly large stage, everything is over two hundred and fifty-six megabytes and nothing is actually skewed. Together they identify genuine outliers. Now the fix. Split the skewed partition into pieces. But you can't just split it, because the join would lose matches — each piece only holds some of the rows for its keys, and it still needs the rows on the other side to join against. So the counterpart partition on the other side of the join gets replicated, copied to every piece. Five pieces means five copies of the matching partition. That's a real cost, and it's why this only triggers when the skew is severe enough to be worth it. One ninety-minute task becomes five eighteen-minute tasks, running in parallel. Now the limit, and it's absolute. A single hot key cannot be split. If forty percent of your rows have a null user id, every one of those rows must end up in the same place for the aggregate to be correct. There's no boundary inside that key to cut along. AQE can't help with that, and neither can anything else — that's a data problem, not a planning problem.",
}
