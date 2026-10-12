import type { Section } from '../types'

export const observability: Section = {
  id: 'observability',
  title: 'Logging, event logs, history, metrics, alerts, and diagnostic workflows',
  scene: 'observability-path',
  focus: 'diagnose-steps',
  slide: `## From alert to cause

**Objective:** keep enough evidence to explain a slow or failed run after the application has gone.

### The evidence
- **Event logs** (\`spark.eventLog.enabled\`) let the **history server** rebuild the UI after the job ends — port 18080
- The live UI on 4040 disappears with the driver
- REST API at \`/api/v1\`; metrics sinks for dashboards; driver and executor logs from the cluster manager

### Worked: the 06:00 run finished at 07:10
1. **Alert:** runtime above 45 minutes
2. **History server:** job 3 took 58 of the 70 minutes
3. **Slowest stage:** max task 41 min against a 20 s median — skew
4. **Executor log:** one key, store 7, as in Chapter 6

### The misconception
"We'll look at the Spark UI when it breaks." Without event logs, the UI is **gone** when the driver exits.`,
  narration:
    "When a production run is late, the application that could explain it has usually already finished. Observability means keeping enough evidence to explain it afterwards. The live Spark UI, on port four zero four zero, belongs to the driver and disappears when the driver exits. So the first setting to turn on is the event log. With event logging enabled and a shared log directory, the history server can rebuild the same UI for finished applications, by default on port eighteen thousand and eighty. The same data is available from the REST API, for scripts. The metrics system can send executor and JVM metrics to a dashboard, and the cluster manager keeps the driver and executor logs. Now a worked diagnosis. The six o'clock daily run finished at ten past seven. An alert fires because runtime passed forty five minutes, which is the threshold the deadline allows. In the history server, job three took fifty eight of the seventy minutes. Inside it, the slowest stage had a maximum task time of forty one minutes against a median of twenty seconds. That pattern is skew, not a slow cluster. The executor log for that task shows it processing a single key, store seven, exactly the skew Chapter 6 measured. The fix is now a known one. The diagnosis followed a fixed path: alert, application, job, stage, task, log, each step narrowing the search. The misconception to drop is that you will look at the Spark UI when it breaks. Without event logs, there is nothing left to look at.",
}
