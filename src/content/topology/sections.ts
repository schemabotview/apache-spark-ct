import type { Section } from '../types'

export const threeProcesses: Section = {
  id: 'three-processes',
  title: 'Three kinds of process, one division of labour',
  scene: 'topology-three-processes',
  focus: 'driver',
  slide: `## Three kinds of process

A running Spark application is **three** things, and the division between them is strict.

### Driver — one per application
Your program runs here. It holds the plan, cuts it into stages, and decides which executor runs which task. **It does no data work.**

### Cluster manager — owns the machines
Grants containers. Knows nothing about your query, your stages or your tasks.

### Executors — JVMs that do the work
Run tasks, hold cached partitions, report back. **They decide nothing.**

### The sentence worth keeping
**The driver decides and never works. The executors work and never decide.**

Almost every confusing Spark failure is one of those two processes being asked to do the other's job.`,
  narration:
    "Let's establish what's actually running when a Spark job runs, because almost everything confusing about Spark becomes clearer once you can name the processes. There are three kinds, and the division of labour between them is strict. First, the driver. There's exactly one per application, and it's where your program runs — your main method, your notebook cell, your Python script. The driver holds the plan, cuts it into stages, and decides which executor runs which task. What it does not do is touch your data. It's a coordinator. Second, the cluster manager. This owns the physical machines and hands out resources. And here's the key thing about it: it knows nothing whatsoever about Spark. It doesn't know what a stage is, or a task, or a DataFrame. It knows that some application asked for eight cores and sixteen gigabytes, and it either has those or it doesn't. Third, the executors. These are JVM processes, usually one per worker node, and they're where the work actually happens. They run tasks, hold cached partitions in memory, and report their status back to the driver. What they don't do is decide anything. An executor never chooses what to work on; it's told. So the sentence worth carrying out of this section is: the driver decides and never works, the executors work and never decide. Hold on to that, because a surprising number of Spark problems — out of memory errors, jobs that hang, clusters sitting idle — are one of those two processes being asked to do the other one's job.",
}

export const theDriver: Section = {
  id: 'the-driver',
  title: 'The driver, and the two ways people kill it',
  scene: 'topology-driver',
  focus: 'kills',
  slide: `## The driver

Your \`main()\` runs here. Every transformation you write builds a plan **in this one process**, on one machine, with one heap.

### What only the driver does
- Builds the plan — logical, then physical
- Cuts it into stages at every shuffle
- Assigns tasks to free slots, preferring slots near the data
- **Collects results** — and this is where it gets dangerous

### One process, no backup
There is no standby driver. **Driver dies → the whole application dies**, executors torn down with it.

### The two ways people kill their own driver
| | |
|---|---|
| \`df.collect()\` | every row from every executor, into one heap |
| A forced \`broadcast()\` | the table is gathered *at the driver* before being sent out |

Both are the same mistake: pulling distributed data into a process that was never sized for it.

> \`df.show(20)\` and \`df.limit(1000).collect()\` are safe. \`df.collect()\` on a billion rows is an outage.`,
  narration:
    "Let's look closer at the driver, because it's the process most likely to ruin your day. Your main method runs here. When you write a chain of transformations — read this, filter that, group by the other — none of that executes. What happens is that a plan gets built up, in memory, in this one process, on one machine, with one JVM heap. The driver then does three things nothing else does. It compiles that plan from a logical form to a physical one. It cuts it into stages, breaking at every shuffle. And it assigns individual tasks to free slots on executors, preferring slots on machines that already hold the relevant data. Then there's a fourth thing it does, and this is the dangerous one: it collects results. Now, the critical architectural fact. There is no standby driver. No failover, no replica. If the driver process dies — out of memory, someone closes a laptop, a node is reclaimed — the entire application dies with it, and every executor gets torn down. That asymmetry is why the driver deserves respect. So here are the two ways people reliably kill their own driver, and they're the same mistake wearing different clothes. The first is calling collect on a large DataFrame. Collect means: take every row, from every executor, send it over the network, and materialise it in the driver's heap. On a billion rows that's not slow, it's fatal. The second is forcing a broadcast join on a table that isn't small — because a broadcast is gathered at the driver first, and only then sent out to the executors. Both are pulling distributed data into a single process that was never sized to hold it. Show and limit are safe. Collect, on anything real, is an outage.",
}

export const sparkSessionSection: Section = {
  id: 'sparksession',
  title: 'SparkSession: the one entry point',
  scene: 'topology-sparksession',
  focus: 'now',
  slide: `## SparkSession

The handle on everything. In a shell or notebook it already exists, as \`spark\`.

### What it replaced
Before Spark 2.0 you juggled **four** context objects — \`SparkContext\`, \`SQLContext\`, \`HiveContext\`, \`StreamingContext\` — created in the right order and passed around by hand. Old code and old blog posts are full of them.

\`\`\`
spark = SparkSession.builder \\
    .appName("nightly") \\
    .getOrCreate()
\`\`\`

### What it actually holds
- **The configuration** — every \`spark.*\` setting this application runs with
- **The catalog** — databases, tables and views it resolves names against
- **The SparkContext** — still underneath, as \`spark.sparkContext\`

### Be clear about this
A session is **not a connection to a cluster**. It's the configuration and catalog your plans are built against — which is why the API is \`getOrCreate\`.`,
  narration:
    "Everything you do with Spark goes through one object, and if you've used a notebook or a shell you've already used it without creating it: the SparkSession, conventionally called spark, lowercase. It's worth a moment on what it replaced, because you will meet the old shape in real codebases and in most of the blog posts you find. Before Spark 2.0 there were four separate context objects. SparkContext for RDDs and the cluster connection. SQLContext for DataFrames. HiveContext if you wanted the metastore. StreamingContext for streaming. You created them in a particular order, they wrapped each other, and you passed them around your codebase by hand. Spark 2.0 collapsed all of that into one SparkSession, and if you see code creating an SQLContext, that code predates 2016. Now, what does a session actually hold? Three things. The configuration — every spark-dot-something setting this application is running with. The catalog — the databases, tables and views it can resolve names against, which is how spark-dot-sql finds a table by name. And the SparkContext, which still exists underneath and is reachable if you need the lower-level API. And here's the thing to be precise about, because the name misleads people. A session is not a connection to a cluster. It isn't a socket, and creating one doesn't dial anything. It's the configuration and catalog that your plans get built against. That's exactly why the API is getOrCreate rather than new: within one JVM you almost always want the session that already exists, not a second one with different settings.",
}

export const executorsSection: Section = {
  id: 'executors',
  title: 'Executors, and why cores are the real unit',
  scene: 'topology-executors',
  focus: 'slots',
  slide: `## Executors

A JVM on a worker node. Two resources: **cores** and **memory**.

### Cores are task slots
One core runs **one task at a time**. So:

\`\`\`
executors × cores per executor = your total parallelism
\`\`\`
20 executors × 5 cores = **100 slots**. That is the maximum number of tasks that can ever run at once, whatever your partition count says.

### Memory is shared by every task in the JVM
Split between **execution** (shuffles, joins, sorts) and **storage** (cached partitions). Eight tasks in one executor are competing for one pool.

### Why very large executors are a trap
| | |
|---|---|
| **One huge JVM** | GC pause time grows with heap size — a 200 GB heap stalls |
| **Many tiny ones** | no sharing: a broadcast table is copied into *every* JVM |

The usual advice is **~5 cores per executor**: enough that tasks share a cached partition and one broadcast copy, few enough to keep GC and I/O throughput sane.`,
  narration:
    "An executor is a JVM process running on a worker node, and it has two resources worth thinking about: cores and memory. Cores first, because this is the one people get wrong. A core is a task slot. One core runs one task at a time. That means your total parallelism is simply the number of executors multiplied by the cores per executor. Twenty executors with five cores each gives you a hundred slots. A hundred tasks can run simultaneously, and not one more — no matter how many partitions your data has. If you've set two hundred shuffle partitions and you have a hundred slots, those tasks run in two waves. That arithmetic explains a lot of confusing Spark UI screens. Memory second. Every executor has a heap, and it's split between two uses: execution memory, which shuffles, joins and sorts consume, and storage memory, which holds cached partitions. The important part is that this is shared across every task in that JVM. If eight tasks are running in one executor, all eight are competing for the same pool. Now, sizing. People's instinct is that fewer, bigger executors must be better — fewer processes, less overhead. But it fails in both directions. One enormous JVM with a two-hundred-gigabyte heap will spend an unpleasant fraction of its life in garbage collection, because GC pause time grows with heap size. Go the other way, one core per executor, and you lose all sharing: a broadcast table gets copied into every single JVM, and cached partitions can't be shared between tasks. The conventional advice is around five cores per executor, and it's a genuine middle: enough tasks to share a cached partition and one broadcast copy, few enough that garbage collection and disk throughput stay reasonable.",
}

export const clusterManagerSection: Section = {
  id: 'the-cluster-manager',
  title: 'Granting resources is not scheduling tasks',
  scene: 'topology-cluster-manager',
  focus: 'split',
  slide: `## Granting resources ≠ scheduling tasks

These sound like one job. They're two, solved by different software, and confusing them causes real mistakes.

| | Says |
|---|---|
| **Cluster manager** | "you may have 8 cores and 32 GB on that box" |
| **Spark driver** | "task 14 goes in slot 3, *now*" |

The cluster manager has **never heard of a task.**

### The four
- **Standalone** — ships with Spark. Simple, single-tenant. Fine for a dedicated cluster.
- **YARN** — the Hadoop estate. Still enormous in on-prem enterprise.
- **Kubernetes** — where new deployments go.
- **Mesos** — **deprecated.** If a tutorial starts here, it's from before 2021.

### Why the separation is worth having
Spark doesn't care which one it's on — the same application runs unchanged. And many applications share one cluster without seeing each other, because the manager is the thing arbitrating between them.`,
  narration:
    "There's a distinction here that sounds pedantic and turns out to matter: granting resources and scheduling tasks are two different jobs, done by two different pieces of software. The cluster manager owns the physical machines. Its job is to say: this application may have eight cores and thirty-two gigabytes of memory on that box over there. That's it. It has never heard of a task. It doesn't know what a stage is. It couldn't tell you what your query does. The Spark driver does the other job. Given the executors the cluster manager granted, it decides that task fourteen goes into slot three on executor two, right now, because that's where the data happens to be. Fine-grained, Spark-aware, and completely invisible to the cluster manager. There are four cluster managers, and you should know which is which. Standalone ships with Spark itself — simple, single-tenant, and perfectly reasonable for a cluster dedicated to one team. YARN comes from Hadoop and is still enormous in on-premises enterprise, so you will meet it. Kubernetes is where essentially all new deployments go, and it's the one to learn if you're choosing today. And Mesos is deprecated — if you find a tutorial that starts with Mesos, it predates 2021, which is a useful signal about the rest of its advice. The payoff of keeping these separate is twofold. Spark doesn't care which manager it's running on, so the same application runs unchanged on all of them. And many applications can share one cluster without seeing each other, because the manager is the thing arbitrating between them.",
}

export const localModeSection: Section = {
  id: 'local-mode',
  title: 'Local mode is not a toy',
  scene: 'topology-local-mode',
  focus: 'differs',
  slide: `## Local mode is not a toy

\`local[4]\` runs the **same three roles inside one JVM**: the driver and the executors are threads in the same process, and the cluster manager is skipped entirely.

\`local[*]\` uses every core you have. \`local[4]\` gives you four task slots.

### What is genuinely the same
- The **same optimizer** — identical plans, identical \`explain()\` output
- **Real shuffles**, to real local disk, with real spilling
- The same API, the same failure semantics inside a task

That's why local mode is a real test: the code path is the code path.

### What it can never show you
| | |
|---|---|
| **Network cost** | a shuffle here is a memory copy. It is free. |
| **Skew** | 4 slots hide what 400 make obvious |
| **Node failure** | there are no other nodes to lose |
| **Data locality** | everything is local, always |

> Develop here. **Never conclude *"it's fast"* here** — the one thing you're measuring is the one thing that doesn't exist on a cluster.`,
  narration:
    "Local mode deserves better than its reputation. When you run Spark with master set to local, bracket four, you get the same three roles running inside a single JVM on your laptop: the driver and the executors are threads in the same process, and the cluster manager is skipped entirely because there's nothing to allocate. Local star gives you a slot per core on your machine; local four gives you exactly four. What surprises people is how much of it is real. It's the same optimizer, producing genuinely identical plans — the output of explain on your laptop matches what you'd see on a thousand-node cluster. Shuffles are real: data is partitioned, written to your local disk, read back, and it spills when it doesn't fit. The API is identical and the failure semantics inside a task are identical. That's why local mode is a legitimate place to develop and to test: the code path is the code path, not a simulation of it. But be equally clear about what it can never show you, because this is where people get hurt. Network cost, first and foremost. On a cluster, a shuffle crosses the wire. Locally it's a memory copy between threads — it is essentially free. So a job that's shuffle-bound on a cluster looks perfectly healthy on your laptop. Skew, second: four slots hide an imbalance that four hundred make glaring. Node failure, third: there are no other nodes to lose. And data locality is meaningless, because everything is local. So develop here by all means. Just never conclude that something is fast here, because the single thing you're measuring is the single thing that doesn't exist on a real cluster.",
}

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

export const onKubernetes: Section = {
  id: 'on-kubernetes',
  title: 'On Kubernetes: everything is a pod',
  scene: 'topology-kubernetes',
  focus: 'catch',
  slide: `## On Kubernetes

The current default target, and the model is simple: **every Spark process is a pod.**

1. \`spark-submit\` talks to the Kubernetes **API server**
2. K8s schedules the **driver pod**
3. The driver then requests **executor pods** itself — Spark is its own cluster manager here

### Dynamic allocation
Idle executors are handed back; new ones appear under load. Pay for what you use.

### The catch nobody mentions until it bites
An executor that goes away **takes its shuffle files with it.**

Shuffle output lives on the executor's local disk. If that executor is scaled down, evicted, or reclaimed as a spot instance, the reduce side has nothing to fetch — and the stage upstream has to be **recomputed from scratch.**

So dynamic allocation needs somewhere else for those files to live: a shuffle service, or storage-backed shuffle. Without one, autoscaling quietly makes your job slower.

> Also: executor pods need enough \`memoryOverhead\` for the JVM's non-heap memory, or K8s OOM-kills the container and Spark never sees a Java error.`,
  narration:
    "Kubernetes is where new Spark deployments go, so it's worth knowing the shape. The model is simple: every Spark process is a pod. Spark-submit talks to the Kubernetes API server. Kubernetes schedules a driver pod. And then the driver requests executor pods for itself — which means Spark is acting as its own cluster manager here, using Kubernetes as the resource layer rather than delegating scheduling to something like YARN. The headline feature is dynamic allocation. Executors that go idle are handed back; under load, new ones appear. You pay for what you use, and on cloud infrastructure that's a real saving. Now here's the catch, and it's the thing nobody mentions until it bites you. An executor that goes away takes its shuffle files with it. Shuffle output is written to the executor's own local disk. If that executor is scaled down because it looked idle, or evicted by Kubernetes, or reclaimed because it was a spot instance, then the reduce side of that shuffle has nothing to fetch from — and Spark has to recompute the entire upstream stage. So dynamic allocation and shuffle data are in tension, and you have to give those files somewhere else to live: an external shuffle service, or storage-backed shuffle. Without one, turning on autoscaling to save money can quietly make your jobs slower and more expensive. One more Kubernetes-specific trap worth naming: executor pods need enough memory overhead configured for the JVM's non-heap memory — thread stacks, off-heap buffers, the Python process if you have one. Get that wrong and Kubernetes OOM-kills the container at the operating-system level. Spark never sees a Java exception, so you get a dead executor and no useful error.",
}

export const sparkSubmitSection: Section = {
  id: 'spark-submit',
  title: 'What spark-submit actually does',
  scene: 'topology-spark-submit',
  focus: 'code',
  slide: `## What \`spark-submit\` actually does

Every flag decides one thing from this course.

| Flag | Decides |
|---|---|
| \`--master\` | which cluster manager |
| \`--deploy-mode\` | where the driver lands |
| \`--driver-memory\` | how much the coordinator gets |
| \`--executor-memory\` / \`--executor-cores\` | the shape of each worker JVM |
| \`--num-executors\` | how many of them |

### Read the resource flags as one number
\`\`\`
executors × cores = the slots your job can ever use
\`\`\`
20 × 5 = 100 slots. 400 shuffle partitions over 100 slots = **4 clean waves**. 401 partitions = **5 waves**, the last one 1% busy.

### The ordering trap
\`\`\`
spark-submit --conf k=v app.py --date 2026-09-24
\`\`\`
\`--conf\` **before** the app file is Spark configuration. **After** it, it's an argument to *your program*.

A misplaced flag is **silently ignored**, not rejected. It's a common reason a setting "doesn't work".`,
  narration:
    "Spark-submit is the command that launches everything, and it's worth reading as a summary of this whole course, because every flag decides one thing we've discussed. Master picks the cluster manager. Deploy-mode decides where the driver lands. Driver-memory sizes the coordinator — and remember, it only plans, unless you collect, which is exactly the trap. Executor-memory and executor-cores shape each worker JVM. Num-executors says how many. Here's the useful way to read the resource flags: as one number. Executors times cores is the total number of task slots your job can ever use. Twenty executors with five cores is a hundred slots. Now line that up with your shuffle partitions. Four hundred partitions over a hundred slots is four clean waves, with every slot busy in every wave. Four hundred and one partitions is five waves, and the last one runs a single task while ninety-nine slots sit idle. That arithmetic is worth doing before you tune anything else, because it's free and it's frequently the whole problem. And one trap that costs people real time. Arguments before the application file are Spark's. Arguments after it belong to your program. So a --conf placed after app dot py is not a Spark setting at all — it's a command-line argument being handed to your Python script, which almost certainly ignores it. The failure mode is the worst kind: no error, no warning, and a configuration that simply never took effect. If a setting seems to do nothing, check which side of the file name it's on.",
}

export const failureModes: Section = {
  id: 'failure-modes',
  title: 'Executor dies vs driver dies',
  scene: 'topology-failure-modes',
  focus: 'driver-dies',
  slide: `## Executor dies vs driver dies

The asymmetry is the most useful thing in this course.

### An executor dies — survivable by design
1. Its **heartbeat stops**; the driver marks it lost
2. Its tasks are **re-run** elsewhere — lineage records how
3. Its **cached partitions are gone**, and get *recomputed*, not restored

Your job gets slower. It does not fail. At scale, this happens constantly and you never notice.

### The driver dies — the application is over
Nothing else holds the plan. Every executor is torn down. **No failover exists.**

### What that should change about how you build
| | |
|---|---|
| **No work on the driver** | no \`collect()\` of a big result, no heavy single-node compute |
| **Retry at the job level** | the driver can't recover itself — your scheduler restarts it |
| **Make writes idempotent** | a retried job must be safe to run twice |

> Executors are cattle. The driver is not.`,
  narration:
    "Let's finish with what happens when things break, because the asymmetry here is the most useful thing to carry away from this course. When an executor dies — and at any real scale they die constantly, from hardware faults, memory pressure, or spot reclamation — the driver notices its heartbeat has stopped and marks it lost. Any tasks that executor was running get re-run somewhere else. And because lineage records how each partition was computed, Spark knows exactly how to rebuild anything that was lost. The one thing worth flagging is cached data: if that executor was holding cached partitions, they're gone, and they get recomputed rather than restored. There's no replica. So the practical effect is that your job gets slower and carries on. It doesn't fail. This is Spark working as designed, and on a large cluster it's happening in the background of most jobs without anyone noticing. Now the driver. If the driver dies, the application is over. Full stop. Nothing else holds the plan, nothing else knows what's been done and what hasn't, and every executor is torn down with it. There is no failover, no standby, no checkpoint you can resume from at this level. Three things should follow from that when you build. First, don't put work on the driver — no collect of a large result, no heavy single-node computation that happens to be convenient. The driver is a coordinator and the more you ask of it, the more likely it dies. Second, retry at the job level, not inside the application, because the driver can't recover itself; your scheduler has to restart it. And third, that means your writes must be idempotent, because a retried job will run some work twice. Executors are cattle. The driver is not.",
}
