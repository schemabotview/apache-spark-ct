import type { Section } from '../types'

export const deploy: Section = {
  id: 'deploy',
  title: 'Run · Deploy on a cluster',
  scene: 'cap-deploy',
  slide: `## Run · Deploy on a cluster

Package the code and **submit both jobs** — the streaming job runs forever in **cluster mode**; the batch job is **scheduled** nightly.

### What’s happening
- **cluster mode** → the streaming driver lives in the cluster and survives your laptop
- Executor **cores / memory** set your parallelism; **dynamic allocation** scales the batch job
- One cluster manager (YARN / K8s) runs both — one driver, one manager, many executors

**Exercises:** deploy modes · cluster manager · executor config · dynamic allocation`,
  narration:
    'The pipeline is written; now we run it — and every flag on the submit line turns out to be a decision about the runtime rather than a formality. Both jobs go to the cluster with spark-submit. We point master at the cluster manager — YARN here, though it could just as easily be Kubernetes — and for the streaming job we choose cluster deploy mode. That choice is worth unpacking, because it is the one people get wrong. Deploy mode decides where the driver process runs: the driver is the thing that holds your plan, tracks the job, and coordinates every task. In client mode it runs wherever you typed the command — your laptop — which is convenient for experimenting and fatal for a stream, because closing the laptop kills the job. In cluster mode the manager starts the driver on a machine inside the cluster instead, so the job outlives your terminal entirely. A streaming job runs indefinitely, so cluster mode is not optional for it. Next we size the executors — ten of them, four cores and eight gigabytes each — and those numbers are our parallelism: an executor runs one task per core, so ten times four is forty tasks executing at once, each with its share of that eight gigabytes. For the batch job we turn on dynamic allocation instead, so it grabs executors when there’s work and releases them when idle, rather than holding the whole cluster all night for a job that runs for twenty minutes. And notice both jobs go to one cluster manager. That is the shape of every Spark deployment: a driver holding the plan, a cluster manager handing out machines, and executors running the tasks — now with our own code flowing through it. Deploy mode, executor sizing and dynamic allocation aren’t mysterious flags; they are direct consequences of that arrangement. The jobs are live. The last thing any real engineer does is open the Spark UI and make them faster.',
}
