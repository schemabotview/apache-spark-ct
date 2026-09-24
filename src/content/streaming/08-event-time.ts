import type { Section } from '../types'

export const eventTime: Section = {
  id: 'event-time',
  title: 'Two clocks',
  scene: 'str-event-time',
  focus: 'rule',
  slide: `## Two clocks

| | |
|---|---|
| **Event time** | when it *happened* — a column in the row |
| **Processing time** | when Spark *saw* it — an accident of the day |

They're usually close. **The gap is where the difficulty of streaming lives.**

### Why they come apart
- A phone was **offline** — events arrive hours late
- A broker **retried** — out of order, not just late
- The job was **restarted** — an hour of backlog, all at once

Every one of those is ordinary operation, not a malfunction.

### So aggregate on event time
Processing time gives an answer that depends on **when the job happened to run** — which is not an answer. Restart the job and yesterday's numbers change.

\`\`\`python
df.groupBy(window("event_ts", "10 minutes")).count()
\`\`\`

> The cost of being right: Spark must now keep windows open for rows that haven't arrived. That's the state problem the next two sections solve.`,
  narration:
    "Here is where streaming stops being batch-with-extra-steps, and it's about time. There are two clocks. Event time is when something actually happened — the moment a user clicked, a sensor read, a transaction completed. It's a column in the row, written by whatever produced the event. Processing time is when Spark saw it. That's an accident of the day: of network conditions, of whether a job was running, of how far behind a consumer was. Most of the time those two are close, within a second or two. And the gap between them is where all the difficulty of streaming lives. Why do they come apart? A phone was in a tunnel with no signal, and its events arrive four hours later. A message broker retried a delivery, so events arrive out of order, not merely late. Your job was down for maintenance, and when it starts, an hour of backlog arrives at once — with event times spread across that hour, all processed in the same second. Every one of those is ordinary operation, not a failure. So you aggregate on event time. Because if you aggregate on processing time, you get an answer that depends on when the job happened to run, which is not really an answer at all. Restart the job to fix something, and yesterday's numbers change. Event time gives you a result that's the same no matter when or how many times you process it. That's the property you actually want. But it has a cost: Spark now has to keep windows open, waiting for rows that might still arrive. And keeping things open is state. That's the problem the next two sections solve.",
}
