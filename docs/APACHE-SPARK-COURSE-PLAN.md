# Apache Spark — From Foundations to Advanced Reasoning

## Audience and prerequisites

For learners new to Spark who can read basic Python functions and collections and understand introductory SQL queries. Distributed-computing concepts are introduced here. PySpark is the primary language for annotated examples; a local installation, cluster access, submitted exercises, and learner monitoring are not required.

Scope: distributed-processing foundations, Spark execution and programming abstractions, batch-pipeline correctness, query plans, performance reasoning, Structured Streaming, and production architecture. General Python, comprehensive SQL, platform administration, and machine-learning algorithms are separate subjects.

Reference version: **Apache Spark 4.0.1**, selected as a fixed documentation baseline rather than a claim about the newest release. Classic PySpark illustrates RDD and execution concepts; Spark Connect is contrasted explicitly. Typed Dataset examples are conceptual Scala/Java comparisons, not a Python API. Behaviour and feature support must be checked against this baseline when lessons are authored.

Target: explain Spark execution, interpret code and plans, reason about pipeline correctness and performance evidence, and justify streaming and operational decisions. Worked code and execution evidence connect concepts to application; individual implementation competence is not assessed.

Structure: **8 chapters**, with section counts of **5, 8, 12, 9, 6, 12, 13, and 11**. Counts reflect conceptual scope; sections need not have equal teaching duration.

## Learning spine

Understand why distributed processing is needed → model execution → interpret programming abstractions → reason about correct pipelines → explain query plans → diagnose performance evidence → understand continuous state → justify production decisions.

The established progression moves from mental models to annotated code, then from results to execution evidence and operational trade-offs. RDDs introduce lineage and distributed computation; DataFrames and SQL carry the main structured-data examples. A DataFrame plan is explained through its query engine rather than treated as merely an RDD program in disguise.

Recurring example: a lecturer develops a retail order-event pipeline through batch ingestion, sales summaries, reference-data joins, malformed events, expensive shuffles, skew, streaming updates, and recovery. Small contrasting examples expose incorrect assumptions before the full pipeline is revisited.

Teaching method: objective → mental model → worked PySpark code with results, diagrams, or execution traces → misconception/failure contrast → explanation summary → bridge. Learners may follow along with code examples; execution is optional. UI and measurement examples are explained evidence, not benchmarks learners must run. Testing appears as a reliability technique illustrated through cases, not a learner-assessment requirement.

## Chapter 1 — Foundations of Distributed Data Processing

Objective: Explain when distributed processing is justified and how Spark addresses a workload.

1. Recognise workload limits and decide whether distributed processing is justified
2. Scale-up versus scale-out: capabilities and costs
3. Distributed storage, computation, partitioning, and locality
4. From MapReduce to Spark: motivation and computational approach
5. Spark’s scope and the recurring retail pipeline

Worked illustrations: A local-versus-distributed workload comparison; partition diagrams; a retail-data flow showing coordination and transfer costs. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Compare local and distributed approaches for the retail workload and explain the benefits and coordination costs of partitioning.

Bridge: We can justify distributing a workload; next we trace the components and execution boundaries in a small Spark application.

## Chapter 2 — Spark Architecture and Execution Model

Objective: Build a causal mental model of execution and distinguish classic and remote-client architectures.

1. Annotated local application: environment assumptions and lifecycle
2. SparkSession, SparkContext, driver, executors, and cluster-manager responsibilities
3. Classic Spark versus Spark Connect: client/server boundaries and API limitations
4. Transformations, actions, and lazy evaluation
5. Partitions and parallel tasks
6. Narrow and wide dependencies
7. From a computation graph to jobs, stages, and tasks
8. Trace a small application through execution and recomputation

Worked illustrations: An annotated PySpark application; driver/executor and Connect diagrams; an action-to-job/stage/task trace; a failed-task recomputation sequence. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Identify component responsibilities, trace an action into stages and tasks, and explain how Spark Connect changes the client boundary.

Bridge: We have traced execution; next we interpret the abstractions that express useful transformations.

## Chapter 3 — Spark Programming Abstractions: RDDs, DataFrames, and SQL

Objective: Interpret Spark’s programming abstractions and their data, execution, and output assumptions.

1. RDDs, lineage, transformations, and actions
2. Pair RDDs, aggregation, and partitioning
3. Distributed closures, serialization, broadcast variables, and accumulators
4. DataFrames and explicit schemas
5. Columns, expressions, and built-in functions
6. Filtering, projection, grouping, and aggregation
7. Spark SQL, temporary views, tables, and catalog concepts
8. RDDs, DataFrames, SQL, and typed Datasets: use cases and language boundaries
9. Read CSV, JSON, and Parquet; contrast file and JDBC source assumptions
10. Write datasets: formats, modes, and output structure
11. Driver collection and distributed side effects: bounded results and retry implications
12. Worked case: interpret a small batch pipeline and its expected results

Worked illustrations: RDD, DataFrame, and SQL snippets with expected results; closure and broadcast examples; file/table layouts; a driver-collection failure contrast. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Interpret an annotated batch pipeline, explain closure and shared-variable behaviour, and compare RDD, DataFrame, SQL, and table/file representations.

Bridge: We can explain transformations and data interfaces; next we analyse correctness when records and business relationships are imperfect.

## Chapter 4 — Reasoning About Pipeline Correctness

Objective: Reason about business correctness across schemas, types, joins, time values, and complex data.

1. Schema enforcement and schema evolution
2. NULL, malformed records, and data-quality policies
3. Type conversion, numeric errors, and ANSI-mode assumptions
4. Join semantics, cardinality, and duplicate amplification
5. Window functions and analytical transformations
6. Dates, timestamps, and time-zone assumptions
7. Arrays, maps, structs, and nested-data transformations
8. Built-in functions versus Python UDFs; Arrow and pandas UDF concepts
9. Worked case: trace edge cases, duplicate handling, and expected invariants

Worked illustrations: PySpark transformations with small input/output tables; malformed and missing records; cast/error contrasts; duplicate-producing joins; nested fields and timestamp examples. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Predict the meaning of results or failures in examples involving missing values, casts, joins, duplicates, nested records, and timestamps.

Bridge: The pipeline’s intended results are clear; next we inspect how Spark translates those operations into execution plans.

## Chapter 5 — Query Plans and Execution Internals

Objective: Trace a query from declared operations through analysis and planning to physical execution.

1. From DataFrame or SQL code to logical and physical plans
2. Analysis: resolve names, types, and expressions
3. Logical optimisation and physical strategy selection
4. Execution representation, memory management, and code generation
5. Exchanges, shuffle mechanics, and stage boundaries
6. Worked case: interpret explain() output and a corresponding execution trace

Worked illustrations: Annotated explain() output and logical/physical plan diagrams; expression resolution; exchanges and stage boundaries connected to an execution trace. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Interpret an annotated query plan and connect analysis, optimisation, physical operators, and exchanges to an execution trace.

Bridge: We can explain execution choices; next we interpret their costs and the evidence behind possible improvements.

## Chapter 6 — Performance Diagnosis and Optimisation

Objective: Interpret bottleneck evidence and compare performance changes under explicit assumptions.

1. Establish correct results, representative data, and a baseline
2. Use Spark UI and metrics to locate expensive stages
3. Diagnose CPU, memory, spill, I/O, and scheduling symptoms
4. Choose partition sizes and parallelism
5. Control shuffles and repartitioning
6. Choose and evaluate join strategies
7. Detect and mitigate data skew
8. Evaluate caching, persistence, and recomputation
9. Improve data layout, file sizes, pruning, and pushdown
10. Adaptive Query Execution: runtime evidence and plan changes
11. Executor resources, scheduling, and dynamic-allocation concepts
12. Worked comparison: explain before/after evidence, correctness checks, and measurement limits

Worked illustrations: Supplied Spark UI and metric excerpts; skewed-task distributions; alternative partition and join plans; cache and AQE comparisons with explicit measurement assumptions. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Use supplied plans, metrics, and measurements to explain a plausible bottleneck, compare alternative changes, and identify evidence needed before claiming improvement.

Bridge: We can reason about bounded workloads; next we examine continuously arriving data and persistent processing state.

## Chapter 7 — Structured Streaming and Stateful Processing

Objective: Explain streaming time, state, outputs, delivery guarantees, and recovery conditions.

1. Bounded versus unbounded data and incremental computation
2. Structured Streaming architecture and execution model
3. Sources, sinks, and input/output contracts
4. Triggers and processing cadence: compare execution modes and their constraints
5. Event time versus processing time
6. Event-time windows and late data
7. Watermarks and their consequences
8. Stateful operations and state growth
9. Output modes and compatible query shapes
10. Stream-static and stream-stream joins
11. Checkpointing, restart behaviour, and compatible query changes
12. Delivery guarantees: replayable sources, sink behaviour, and foreachBatch idempotency
13. Worked timelines: late events, duplicates, state retention, and recovery

Worked illustrations: Event-time timelines, window outputs, and watermark progression; state-growth sketches; annotated streaming code; duplicate/restart cases tied to source and sink assumptions. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Trace a stateful query through late events, duplicate inputs, and restarts; explain output and recovery behaviour under stated source, sink, trigger, and checkpoint assumptions.

Bridge: The streaming model adds ongoing state and recovery obligations; next we connect those requirements to production responsibilities.

## Chapter 8 — Production Engineering and Integrated Reasoning

Objective: Justify deployment, reliability, security, capacity, and evolution decisions in a production design.

1. Package applications, dependencies, and configuration
2. Select deployment architecture and driver placement
3. Compare deployment responsibilities on standalone, YARN, and Kubernetes
4. Plan resources, capacity, and cost
5. Testing and data-quality checks explained through failure cases
6. Logging, event logs, history, metrics, alerts, and diagnostic workflows
7. Task failure, retries, speculation, reruns, and external side-effect recovery
8. Data-lake table formats: operational role and boundaries of Spark versus external guarantees
9. Backfills, schema changes, dependency compatibility, and safe releases
10. Security boundaries: identities, access, transport protection, secrets, and exposed interfaces
11. Integrated narrated case: explain and critique the retail pipeline’s production design

Worked illustrations: Annotated application-submission and configuration examples; deployment diagrams; failure logs and recovery sequences; illustrative quality checks; a production responsibility matrix and retail-pipeline walkthrough. Explain assumptions, construction, expected behaviour, and limitations step by step; running the examples is optional.

Outcome: Explain the narrated retail design’s deployment, security, testing, observability, capacity, and recovery decisions and identify where external systems supply guarantees.

Bridge: Continue with unfamiliar code, plans, documented version differences, and incident analyses; practical competence requires separate implementation experience.

## Sources and scope

The reference is [Apache Spark 4.0.1 documentation](https://spark.apache.org/docs/4.0.1/). Selected guides inform [RDD reasoning](https://spark.apache.org/docs/4.0.1/rdd-programming-guide.html), [structured APIs](https://spark.apache.org/docs/4.0.1/sql-programming-guide.html), [query performance](https://spark.apache.org/docs/4.0.1/sql-performance-tuning.html), and [Structured Streaming](https://spark.apache.org/docs/4.0.1/streaming/apis-on-dataframes-and-datasets.html). Spark Connect, ANSI behaviour, deployment, monitoring, and security guides inform the corresponding conceptual coverage.

Publisher contents were compared for [Learning Spark, second edition](https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/) (2020) and [Spark: The Definitive Guide](https://www.oreilly.com/library/view/spark-the-definitive/9781491912201/) (2018). Their older software context requires checking technical details against the fixed documentation baseline. Full book text was not inspected. Per-chapter authoring status is tracked in [README.md](../README.md).

This is a PySpark-oriented data-processing course, not an exhaustive catalogue of the Spark ecosystem. MLlib, GraphX, SparkR, legacy DStreams, pandas API on Spark, connector internals, custom stateful APIs, and every SQL function are deferred. Typed Datasets receive comparative coverage only. Delta/Iceberg/Hudi implementation details, cloud-platform administration, and specialist security configuration require separate sources and courses. Table formats are discussed as architectural interfaces, not as guarantees supplied by Spark itself.
