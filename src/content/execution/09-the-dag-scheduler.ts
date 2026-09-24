import type { Section } from '../types'

export const dagScheduler: Section = {
  id: 'the-dag-scheduler',
  title: 'Two schedulers, not one',
  scene: 'exec-dag-scheduler',
  focus: 'lost',
  slide: `## Two schedulers, not one

They're often spoken of as one thing. They're two, and they think at different levels.

### DAG scheduler — thinks in **stages**
- Cuts the plan into stages at every shuffle
- Orders them by what depends on what
- **Skips** stages whose shuffle files are still on disk — this is why the UI says *"skipped"*

### Task scheduler — thinks in **tasks**
- Places tasks in slots, preferring local data
- Retries failures, up to four times
- Launches speculative copies against stragglers

### Where the division shows
\`FetchFailedException\` — a reduce task can't fetch its shuffle input, because the executor that wrote it is gone.

The task scheduler can't fix this: retrying the *task* won't help, the data isn't there. So the **DAG scheduler resubmits the whole map stage** to regenerate the files.

> That's why one lost executor can cause a stage you thought was finished to run again.`,
  narration:
    "People talk about the Spark scheduler as though it's one thing. It's two, and they think at completely different levels. The DAG scheduler thinks in stages. It takes your physical plan, cuts it into stages at every shuffle, and works out the order they have to run in based on what depends on what. It also does something you've probably seen without understanding: it skips stages. If the shuffle files from a previous run are still sitting on disk, the DAG scheduler knows it doesn't need to recompute that stage, and marks it skipped in the UI. People often think skipped means something went wrong. It means something went right. The task scheduler thinks in tasks. Given a stage, it places individual tasks into individual slots, preferring executors that already hold the relevant data. It retries failures up to four times. And it launches speculative copies against stragglers. Now here's where the division between them becomes visible, and it's worth recognising because the error is common. FetchFailedException. A reduce task tries to fetch its shuffle input and can't, because the executor that wrote those files has died or been reclaimed. The task scheduler cannot fix this. Retrying the task is pointless — the data genuinely isn't there any more, and retrying will fail the same way. So it escalates. The DAG scheduler resubmits the entire map stage to regenerate the missing shuffle files. That's why one lost executor can cause a stage you were sure had finished to suddenly run again, and why FetchFailed in your logs is a signal about executor stability rather than about the task that reported it.",
}
