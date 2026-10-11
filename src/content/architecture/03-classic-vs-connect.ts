import type { Section } from '../types'

export const classicVsConnect: Section = {
  id: 'classic-vs-connect',
  title: 'Classic Spark versus Spark Connect',
  scene: 'classic-vs-connect',
  focus: 'connect-mode',
  slide: `## Classic Spark versus Spark Connect

**Classic:** your Python process and the driver JVM run together, joined by Py4J.

**Connect:** a thin client sends **unresolved logical plans** over **gRPC**; the server runs them and returns **Arrow** row batches.

### What the client gives up
- No **RDD API** and no \`SparkContext\`
- No static configuration, no access to the driver JVM

### What operators gain
- A client's crash or memory blow-up stays **in the client**
- The server **upgrades** independently of applications

### In Spark 4.0
\`spark.api.mode=connect\` runs a Classic application through a local Connect server. This course's RDD examples assume **Classic**.`,
  narration:
    "There are two ways for your code to reach a driver, and the difference matters for what you can call. In Classic Spark, which is what our local application uses, your Python process and the driver's JVM run side by side and talk through a bridge called Py4J. The Python objects are thin wrappers around objects living in the JVM. Spark Connect moves that boundary. The client becomes a thin library that never touches a JVM. When you build a DataFrame, it records an unresolved logical plan, encodes it with protocol buffers, and sends it to a Connect server over gRPC. The server, running inside a remote driver, analyses and executes the plan, and streams results back as Apache Arrow row batches. Look at what that costs the client. There is no RDD API, because the protocol describes logical plans, not low level execution. There is no Spark context, and no access to static configuration. In four point zero point one, asking a Connect session for its Spark context raises an error, and so does asking a DataFrame for its RDD. In return, operators gain isolation. A client that crashes or runs out of memory only hurts itself, and the server can be upgraded without rebuilding every application. Spark four also adds an API mode setting that runs a Classic application through a local Connect server. Because RDDs need Classic, this course's RDD examples assume it.",
}
