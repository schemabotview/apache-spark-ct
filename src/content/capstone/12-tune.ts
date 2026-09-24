import type { Section } from '../types'

export const tune: Section = {
  id: 'tune',
  title: 'Run · Observe & tune',
  scene: 'cap-tune',
  slide: `## Run · Observe & tune

With it running, open the **Spark UI**, confirm **AQE** is doing its job, **cache** the reused dimension, and watch for a **skewed** key.

### What’s happening
- **AQE** coalesces shuffle partitions and re-plans joins **at runtime** — on by default since 3.2
- **Skew-join** handling splits a hot key so one giant task can’t stall the stage
- \`cache()\` the product dim — read every batch; the **Spark UI** shows the win

**Exercises:** AQE · skew · caching · reading the Spark UI`,
  narration:
    'A pipeline that runs is not the same as a pipeline that runs well, so the final step is to observe and tune — and this is the step people skip. Your first move is always the same: open the Spark UI and look at the stages. It shows you which stages are slow, where the shuffles are, and whether any task is taking far longer than its peers — the classic sign of skew, where one key holds far more rows than the others and a single task ends up doing most of the work. Then you reach for the high-leverage fixes. The biggest is Adaptive Query Execution, AQE. The idea is that the plan Spark compiles before running is built on estimates, and estimates about data are often wrong; AQE lets Spark re-plan at runtime using the partition sizes it actually observes at each shuffle. It coalesces a couple of hundred tiny shuffle partitions down to a sensible few, it can switch a sort-merge join to a broadcast join mid-flight once it learns one side is genuinely small, and with skew-join handling it detects an oversized partition — one wildly popular product, say — and splits it so a single straggler task can’t hold up the whole stage. Worth being precise about one thing: since Spark three-point-two, AQE and both of those behaviours are enabled by default. So on any modern cluster the job is not to turn them on, it is to know what they are already doing to your plan and to read the final plan rather than the compiled one. Then a simple, classic win that AQE will not do for you: the product dimension is read on every batch run, so we cache it in memory once, and the Spark UI’s storage tab confirms the reuse. The habit to take away is the order — read the UI first, then change one thing. The shuffles, the stage boundaries and the memory picture are all visible there, so you tune what you can see instead of what you guess. Our Lambda pipeline is complete, deployed, and fast. Let’s step back and see the whole thing.',
}
