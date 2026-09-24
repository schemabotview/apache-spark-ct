import type { Section } from '../types'

export const clientVsCluster: Section = {
  id: 'client-vs-cluster',
  title: 'Where the driver lands, and why it matters',
  scene: 'topology-client-vs-cluster',
  focus: 'choose',
  slide: `## Client vs cluster mode

One difference: **where the driver process runs.** Everything downstream follows from it.

### Client mode
The driver stays on the machine you submitted from — your laptop, a gateway node. The cluster runs executors only.

Your machine is now **part of the running job.** Close the laptop and the job dies.

### Cluster mode
The cluster manager launches the **driver too**, on a node inside the cluster. Your machine submits and exits.

### How to choose
**Client** for interactive work — shells and notebooks need output streamed back. **Cluster** for anything scheduled: it survives your laptop, and the driver sits beside the executors.

### The part people learn the hard way
In client mode every collected result crosses from the cluster **to your machine** — possibly over a VPN. A notebook is client mode, which is why a careless \`collect()\` there hurts so specifically.`,
  narration:
    "Deploy mode is one decision — where does the driver process run — and everything else follows from it. In client mode, the driver stays on the machine you submitted from. Your laptop, or a gateway node. Only the executors run on the cluster. So your laptop is now a participating component of a distributed job: it holds the plan, it schedules every task, and it receives every result. Close the lid and the job dies, because the thing that was coordinating it has gone. In cluster mode, the cluster manager launches the driver as well, on some node inside the cluster. Your machine submits the application and then exits — you can disconnect entirely and the job carries on. Choosing between them is straightforward once you frame it around failure. Interactive work wants client mode: a shell or a notebook needs the driver near you, because you need output streamed back as it happens. Anything scheduled wants cluster mode: nightly pipelines shouldn't depend on somebody's laptop staying open, and the driver belongs next to the executors. There's a performance dimension people learn the hard way. In client mode, every result the driver collects has to cross from the cluster to your machine — possibly over a corporate VPN, possibly over the public internet. Every heartbeat and status update makes the same trip. In cluster mode the driver sits on the fast internal network with its executors, and the chatter never leaves the data centre. This is also, by the way, why a careless collect in a notebook hurts so specifically: a notebook is client mode, so you're pulling a distributed dataset across the internet into a laptop.",
}
