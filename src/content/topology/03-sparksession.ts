import type { Section } from '../types'

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
