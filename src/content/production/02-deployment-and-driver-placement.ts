import type { Section } from '../types'

export const deploymentAndDriverPlacement: Section = {
  id: 'deployment-and-driver-placement',
  title: 'Select deployment architecture and driver placement',
  scene: 'deploy-modes',
  focus: 'placement-table',
  slide: `## Where the driver runs

**Model:** \`--deploy-mode\` decides where the **driver** lives. Executors are always in the cluster.

### Client mode
- Driver on the submitting machine — right for interactive work, results come straight back
- The submitter must stay up **and** near the executors for the whole job

### Cluster mode
- The cluster manager starts the driver in a container or pod — right for scheduled jobs
- Driver logs live with the cluster's; standalone has no Python cluster mode

### Worked: the 06:00 daily job
Submitted in client mode from a laptop, it **dies** when the laptop sleeps. In cluster mode it runs to the end.

### The misconception
"The driver is idle once tasks start." It schedules every task and tracks every result — **losing it ends the application**.`,
  narration:
    "Once the job is packaged, you decide where its driver runs. Executors always run in the cluster; the deploy mode decides only the driver's place. In client mode, the driver runs on the machine that submitted the job: an edge node, a laptop, or a notebook server. That is the right choice for interactive work. Results come straight back to you, and so do the logs. But it has two conditions. The submitting machine must stay up for the whole job, and it must be close to the executors on the network, because the driver talks to them constantly, sending tasks and receiving results. In cluster mode, the cluster manager starts the driver inside the cluster, in a container or a pod, next to the executors. That is the right choice for scheduled production jobs. The machine that submitted the job can disconnect, and the job carries on. The trade is that the driver's logs live with the cluster's logs, not on your screen. One detail from the documentation: the standalone cluster manager does not support cluster mode for Python applications. Now the worked case. The daily summary must start at six in the morning. Submitted in client mode from someone's laptop, it dies the moment the laptop goes to sleep. Submitted in cluster mode, it runs to the end. The misconception to drop is that the driver sits idle once tasks start. It schedules every task, tracks every result, and holds the plan. Losing the driver ends the application, so place it where it will survive.",
}
