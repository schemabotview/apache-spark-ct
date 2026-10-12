import type { Section } from '../types'

export const failureAndRecovery: Section = {
  id: 'failure-and-recovery',
  title: 'Task failure, retries, speculation, reruns, and external side-effect recovery',
  scene: 'retry-side-effects',
  focus: 'attempt-table',
  slide: `## Retries and side effects

**Model:** Spark retries tasks, re-runs stages, may run a task **twice at once** — each attempt repeats its side effects.

**Defaults in 4.0.1:** 4 task failures fail the job; 4 consecutive stage attempts; speculation **off** — when on, a task 3× the median, after 90% finish, gets a copy.

### Worked: task 12 dies after two of three orders
- \`df.write.parquet\`: attempt 0 is never committed — **3 rows**
- POST per row from \`foreachPartition\`: o1, o2 sent twice — **5 calls**
- POST keyed by order id, receiver ignores repeats — **3 effects**

**Reruns** repeat every external effect — make writes idempotent per date or key.

### The misconception
"Spark's retries make my job exactly-once." Only for outputs that **commit**: files through the committer, not your API calls.`,
  narration:
    "Failures in Spark are handled at several levels, and every level repeats work. A failed task is retried, by default up to four times before the job fails. If shuffle output is lost, the stage that produced it is re-run, up to four consecutive attempts. And with speculation turned on, Spark launches a second copy of a slow task while the first is still running. In Spark four, speculation is off by default, and when on, it is deliberately cautious: a task must be three times slower than the median, after ninety percent of the stage has finished. The rule that matters is simple. Every attempt repeats the task's side effects. Here task twelve processes a partition of three orders and dies after handling two of them. If it writes files with the DataFrame writer, attempt zero's files are never committed, and only the successful attempt's three rows appear. The output committer gives you that. If it posts each row to an external API from for each partition, orders one and two were already sent, and the retry sends them again: five calls for three orders. If each call carries the order id as a key, and the receiver ignores repeats, the effect is three, however many attempts run. Reruns of a whole job are the same story at a larger scale, so writes should be idempotent per date or per key. The misconception to drop is that Spark's retries make a job exactly-once. They do only for outputs that commit, like files through the committer. Your own API calls are yours to make idempotent.",
}
