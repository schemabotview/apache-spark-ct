import type { Scene } from '@graphlearning/flow'

// Course 2 (topology) scenes. The question is "what is actually running, and where" — so every scene
// is a box diagram of processes, and the through-line is that a Spark application is three kinds of
// process with a strict division of labour. The deploy-mode sections all vary ONE thing (where the
// driver lands) against a fixed backdrop, which is what makes them comparable.
//
// Written to the layout limits enforced by scripts/lint-scenes.mjs.

export const threeProcesses: Scene = {
  id: 'topology-three-processes',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'driver',
      label: 'Driver',
      pattern: 'service',
      sub: 'one per application · your program runs here',
      cols: 1,
      children: [
        { id: 'd-plan', label: 'holds the DAG', pattern: 'network', sub: 'the whole plan lives here' },
        { id: 'd-sched', label: 'schedules tasks', pattern: 'network', sub: 'decides who does what, when' },
        { id: 'd-state', label: 'tracks everything', pattern: 'network', sub: 'which task, which executor, alive?' },
      ],
    },
    {
      id: 'cm',
      label: 'Cluster manager',
      pattern: 'network',
      icon: 'server',
      sub: 'owns the machines · grants containers · never sees a task',
    },
    {
      id: 'executors',
      label: 'Executors',
      pattern: 'group',
      sub: 'JVMs that run tasks and hold cached data — they do all the work and decide none of it',
      cols: 2,
      children: [
        { id: 'x1', label: 'Executor 1', pattern: 'service', sub: '4 cores = 4 task slots' },
        { id: 'x2', label: 'Executor 2', pattern: 'service', sub: '4 cores = 4 task slots' },
      ],
    },
  ],
  edges: [
    { source: 'driver', target: 'cm', label: 'asks for resources' },
    { source: 'cm', target: 'executors', label: 'launches them' },
    { source: 'executors', target: 'driver', label: 'heartbeats + results' },
  ],
}

export const theDriver: Scene = {
  id: 'topology-driver',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'does',
      label: 'What the driver does, and only the driver',
      pattern: 'group',
      sub: 'your main() runs here — every transformation you write builds a plan in this one process',
      cols: 4,
      children: [
        { id: 'r-plan', label: 'builds the plan', pattern: 'network', sub: 'logical → physical' },
        { id: 'r-split', label: 'cuts it into stages', pattern: 'network', sub: 'at every shuffle' },
        { id: 'r-assign', label: 'assigns tasks', pattern: 'network', sub: 'to free slots, near the data' },
        { id: 'r-collect', label: 'collects results', pattern: 'network', sub: 'and this is the danger' },
      ],
    },
    {
      id: 'single',
      label: 'One process, no backup',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'the driver dies → the whole application dies, executors included',
    },
    {
      id: 'kills',
      label: 'The two ways people kill their own driver',
      pattern: 'group',
      sub: 'both are the same mistake: pulling distributed data into one process that was never sized for it',
      cols: 2,
      children: [
        { id: 'k-collect', label: 'df.collect()', pattern: 'warn', sub: 'every row, into one heap' },
        { id: 'k-broadcast', label: 'a forced broadcast', pattern: 'warn', sub: 'the table is gathered here first' },
      ],
    },
  ],
  edges: [
    { source: 'does', target: 'single' },
    { source: 'single', target: 'kills' },
  ],
}

export const sparkSession: Scene = {
  id: 'topology-sparksession',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'before',
      label: 'Before Spark 2.0 — one context per library',
      pattern: 'group',
      sub: 'they had to be created in the right order, and passed around by hand',
      cols: 4,
      children: [
        { id: 'b-sc', label: 'SparkContext', pattern: 'warn', sub: 'RDDs, the cluster' },
        { id: 'b-sql', label: 'SQLContext', pattern: 'warn', sub: 'DataFrames' },
        { id: 'b-hive', label: 'HiveContext', pattern: 'warn', sub: 'the metastore' },
        { id: 'b-stream', label: 'StreamingContext', pattern: 'warn', sub: 'DStreams' },
      ],
    },
    {
      id: 'now',
      label: 'SparkSession',
      pattern: 'service',
      icon: 'key',
      sub: 'one entry point · pre-made as `spark` in every shell and notebook',
    },
    {
      id: 'holds',
      label: 'What it actually holds',
      pattern: 'group',
      sub: 'a session is not a connection — it is the configuration and catalog your plans are built against',
      cols: 3,
      children: [
        { id: 'h-conf', label: 'the configuration', pattern: 'network', sub: 'every spark.* setting' },
        { id: 'h-cat', label: 'the catalog', pattern: 'network', sub: 'databases, tables, views' },
        { id: 'h-sc', label: 'the SparkContext', pattern: 'network', sub: 'still there, underneath' },
      ],
    },
  ],
  edges: [
    { source: 'before', target: 'now', label: 'collapsed in 2.0' },
    { source: 'now', target: 'holds' },
  ],
}

export const executors: Scene = {
  id: 'topology-executors',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'inside',
      label: 'Inside one executor',
      pattern: 'group',
      sub: 'a JVM with N cores — and the cores are the unit of parallelism, not the executors',
      cols: 2,
      children: [
        {
          id: 'slots',
          label: 'Task slots',
          pattern: 'service',
          sub: 'one core, one task, at a time',
          cols: 2,
          children: [
            { id: 's1', label: 'core 1', pattern: 'network', sub: 'task 14', variant: 'tile' },
            { id: 's2', label: 'core 2', pattern: 'network', sub: 'task 15', variant: 'tile' },
            { id: 's3', label: 'core 3', pattern: 'network', sub: 'task 16', variant: 'tile' },
            { id: 's4', label: 'core 4', pattern: 'network', sub: 'idle', variant: 'tile' },
          ],
        },
        {
          id: 'mem',
          label: 'Its memory',
          pattern: 'service',
          sub: 'shared by every task in this JVM',
          cols: 1,
          children: [
            { id: 'm-exec', label: 'execution', pattern: 'network', sub: 'shuffles, joins, sorts' },
            { id: 'm-store', label: 'storage', pattern: 'network', sub: 'cached partitions' },
          ],
        },
      ],
    },
    {
      id: 'sizing',
      label: 'Why very large executors are a trap',
      pattern: 'group',
      sub: 'the usual advice is ~5 cores each: enough to share a cached partition, few enough to keep GC and HDFS throughput sane',
      cols: 2,
      children: [
        { id: 'z-gc', label: 'one huge JVM', pattern: 'warn', sub: 'GC pauses grow with the heap' },
        { id: 'z-tiny', label: 'many tiny ones', pattern: 'warn', sub: 'no sharing, broadcast copied to each' },
      ],
    },
  ],
  edges: [{ source: 'inside', target: 'sizing' }],
}

export const clusterManager: Scene = {
  id: 'topology-cluster-manager',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'split',
      label: 'Two jobs that sound like one',
      pattern: 'group',
      sub: 'granting resources and scheduling tasks are different problems, solved by different software',
      cols: 2,
      children: [
        { id: 'sp-cm', label: 'the cluster manager', pattern: 'network', sub: 'you may have 8 cores on that box' },
        { id: 'sp-driver', label: 'the driver', pattern: 'service', sub: 'task 14 goes in slot 3, now' },
      ],
    },
    {
      id: 'which',
      label: 'The four, and what each is really for',
      pattern: 'group',
      sub: 'Spark does not care which — the same application runs on all of them unchanged',
      cols: 4,
      children: [
        { id: 'c-standalone', label: 'Standalone', pattern: 'service', sub: 'ships with Spark · one tenant' },
        { id: 'c-yarn', label: 'YARN', pattern: 'service', sub: 'the Hadoop estate' },
        { id: 'c-k8s', label: 'Kubernetes', pattern: 'service', sub: 'the current default' },
        { id: 'c-mesos', label: 'Mesos', pattern: 'warn', sub: 'deprecated — do not start here' },
      ],
    },
    {
      id: 'why',
      label: 'Why separate them',
      pattern: 'network',
      icon: 'layers',
      sub: 'many applications share one cluster, seeing none of the others',
    },
  ],
  edges: [
    { source: 'split', target: 'which' },
    { source: 'which', target: 'why' },
  ],
}

export const localMode: Scene = {
  id: 'topology-local-mode',
  padding: 0.14,
  flow: 'LR',
  nodes: [
    {
      id: 'local',
      label: 'local[4] — one JVM on your laptop',
      pattern: 'group',
      sub: 'the driver and the executor are threads in the same process, and the cluster manager is skipped entirely',
      cols: 2,
      children: [
        { id: 'l-driver', label: 'driver thread', pattern: 'service', sub: 'plans and schedules' },
        { id: 'l-exec', label: '4 executor threads', pattern: 'service', sub: 'run the tasks' },
      ],
    },
    {
      id: 'same',
      label: 'What is genuinely the same',
      pattern: 'group',
      sub: 'the reason local mode is a real test and not a toy — the code path is the code path',
      cols: 2,
      children: [
        { id: 'sm-plan', label: 'the same optimizer', pattern: 'network', sub: 'identical plans' },
        { id: 'sm-shuffle', label: 'real shuffles', pattern: 'network', sub: 'to real local disk' },
      ],
    },
    {
      id: 'differs',
      label: 'What it can never show you',
      pattern: 'group',
      sub: 'every bug in this list is a distribution bug, and local mode has no distribution',
      cols: 2,
      children: [
        { id: 'df-net', label: 'network cost', pattern: 'warn', sub: 'a shuffle here is free' },
        { id: 'df-skew', label: 'skew and failures', pattern: 'warn', sub: 'no slow node, no dead node' },
      ],
    },
  ],
  edges: [
    { source: 'local', target: 'same' },
    { source: 'same', target: 'differs' },
  ],
}

export const clientVsCluster: Scene = {
  id: 'topology-client-vs-cluster',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'client',
      label: 'Client mode — the driver stays where you typed',
      pattern: 'group',
      sub: 'your laptop or a gateway node is now part of the running job',
      flow: 'LR',
      children: [
        { id: 'cl-you', label: 'your machine', pattern: 'warn', sub: 'the driver lives here' },
        { id: 'cl-cluster', label: 'the cluster', pattern: 'service', sub: 'executors only' },
      ],
    },
    {
      id: 'cluster',
      label: 'Cluster mode — the driver is submitted too',
      pattern: 'group',
      sub: 'the cluster manager launches the driver on a node inside the cluster, then you can walk away',
      flow: 'LR',
      children: [
        { id: 'cx-you', label: 'your machine', pattern: 'network', sub: 'submits, then exits' },
        { id: 'cx-cluster', label: 'the cluster', pattern: 'service', sub: 'driver AND executors' },
      ],
    },
    {
      id: 'choose',
      label: 'How to choose, in one line each',
      pattern: 'group',
      sub: 'the failure question is the decisive one: in client mode, closing your laptop kills the job',
      cols: 2,
      children: [
        { id: 'ch-client', label: 'interactive work', pattern: 'network', sub: 'shells, notebooks — you need the output' },
        { id: 'ch-cluster', label: 'anything scheduled', pattern: 'network', sub: 'survives your laptop, near the executors' },
      ],
    },
  ],
  edges: [
    { source: 'client', target: 'cluster' },
    { source: 'cluster', target: 'choose' },
  ],
}

export const onKubernetes: Scene = {
  id: 'topology-kubernetes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'pods',
      label: 'Everything is a pod',
      pattern: 'group',
      sub: 'spark-submit asks the K8s API server for a driver pod; the driver then requests its own executor pods',
      cols: 2,
      children: [
        { id: 'p-driver', label: 'driver pod', pattern: 'service', sub: 'created first, requests the rest' },
        { id: 'p-exec', label: 'executor pods', pattern: 'service', sub: 'one container each, created on demand' },
      ],
    },
    {
      id: 'dynamic',
      label: 'Dynamic allocation',
      pattern: 'network',
      icon: 'activity',
      sub: 'idle executors are handed back · new ones appear under load',
    },
    {
      id: 'catch',
      label: 'The catch nobody mentions until it bites',
      pattern: 'group',
      sub: 'an executor that goes away takes its shuffle files with it — unless something else is there to serve them',
      cols: 2,
      children: [
        { id: 'ca-shuffle', label: 'shuffle files vanish', pattern: 'warn', sub: 'and the stage is recomputed' },
        { id: 'ca-fix', label: 'so: keep them elsewhere', pattern: 'service', sub: 'a shuffle service, or storage' },
      ],
    },
  ],
  edges: [
    { source: 'pods', target: 'dynamic' },
    { source: 'dynamic', target: 'catch' },
  ],
}

export const sparkSubmit: Scene = {
  id: 'topology-spark-submit',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'submit.sh',
      minCols: 76,
      label: [
        '# Every flag here decides one thing from this course.',
        'spark-submit \\',
        '  --master k8s://https://my-cluster:6443 \\  # which manager',
        '  --deploy-mode cluster \\                   # where the driver',
        '  --name nightly-sessionize \\',
        '  --driver-memory 4g \\        # it only plans -- unless you',
        '                              # collect(), and then it is a trap',
        '  --executor-memory 16g \\     # split: execution + storage',
        '  --executor-cores 5 \\        # ~5 is the usual advice',
        '  --num-executors 20 \\        # 20 x 5 = 100 task slots',
        '  --conf spark.sql.shuffle.partitions=400 \\',
        '  --conf spark.dynamicAllocation.enabled=true \\',
        '  app.py --date 2026-09-24',
        '',
        '# Read the resource flags as ONE number:',
        '#   executors x cores = the slots your job can ever use.',
        '#   400 shuffle partitions over 100 slots = 4 clean waves.',
        '#   401 partitions = 5 waves, the last one 1% busy.',
        '',
        '# Order matters: --conf before the app file is Spark config,',
        '# after it is an argument to YOUR program. A misplaced flag',
        '# is silently ignored rather than rejected.',
      ].join('\n'),
    },
  ],
  edges: [],
}

export const failureModes: Scene = {
  id: 'topology-failure-modes',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'exec-dies',
      label: 'An executor dies — survivable, by design',
      pattern: 'group',
      sub: 'the driver notices the missing heartbeat, and re-runs that executor’s tasks somewhere else',
      cols: 3,
      children: [
        { id: 'e-detect', label: 'heartbeat stops', pattern: 'network', sub: 'the driver marks it lost' },
        { id: 'e-recompute', label: 'tasks re-run', pattern: 'network', sub: 'lineage says how' },
        { id: 'e-cache', label: 'cached data is gone', pattern: 'warn', sub: 'and is recomputed, not restored' },
      ],
    },
    {
      id: 'driver-dies',
      label: 'The driver dies',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'nothing else holds the plan, so every executor is torn down too',
    },
    {
      id: 'asymmetry',
      label: 'What the asymmetry should change about how you build',
      pattern: 'group',
      sub: 'it is the reason the driver is the process to protect, and the last place to put work',
      cols: 3,
      children: [
        { id: 'a-nowork', label: 'no work on the driver', pattern: 'service', sub: 'no collect() of a big result' },
        { id: 'a-retry', label: 'retry at the job level', pattern: 'service', sub: 'the scheduler restarts it' },
        { id: 'a-idem', label: 'make writes idempotent', pattern: 'service', sub: 'a retry must be safe' },
      ],
    },
  ],
  edges: [
    { source: 'exec-dies', target: 'driver-dies' },
    { source: 'driver-dies', target: 'asymmetry' },
  ],
}

export const topologyScenes: Scene[] = [
  threeProcesses,
  theDriver,
  sparkSession,
  executors,
  clusterManager,
  localMode,
  clientVsCluster,
  onKubernetes,
  sparkSubmit,
  failureModes,
]
