import type { Section } from '../types'

export const packagingAndConfiguration: Section = {
  id: 'packaging-and-configuration',
  title: 'Package applications, dependencies, and configuration',
  scene: 'submit-config',
  focus: 'precedence-table',
  slide: `## Packaging and configuration

**Objective:** ship the daily job so every executor runs the same code, libraries and settings as the test run.

### What travels with the job
- **Python environment:** a packed virtualenv via \`--archives …#environment\`, with \`PYSPARK_PYTHON\` pointing into it
- **Your own modules:** \`--py-files retail_lib.zip\`
- **JVM libraries:** \`--packages\` or \`--jars\`, built for Scala 2.13 and Spark 4.0

### Worked: one setting in three places
- \`spark-defaults.conf\` says **400**, \`--conf\` says **300**, the builder in code says **200**
- The job runs with **200**: code beats flags, flags beat the defaults file

### The misconception
"It ran on my laptop, so the cluster has what it needs." Executors start with **their** Python — pack the environment, pin the versions, and keep settings out of code unless they must never change.`,
  narration:
    "A production Spark job is more than a script. It is a script plus its Python environment, its own modules, any JVM libraries, and its configuration, and every executor must receive the same set. Look at how the daily sales job is submitted. The Python environment is packed once, in continuous integration, with a tool such as venv pack, shipped with the archives option, and unpacked on each node under the name environment. PYSPARK PYTHON points into that unpacked folder, so executors use exactly the interpreter and libraries the tests used. The team's own helper modules travel as a zip with py files. JVM libraries, such as a connector, come in with packages or jars, and they must be built for Scala two point thirteen and Spark four. Configuration has rules of its own. Here the shuffle partition setting appears in three places: four hundred in the spark defaults file, three hundred as a submit flag, and two hundred in the session builder in code. The job runs with two hundred. Values set in code take the highest precedence, then flags passed to spark submit, then the defaults file. That is why settings you may want to tune per environment belong in flags or files, not hard coded in the program. The misconception to drop is that if it ran on your laptop, the cluster has what it needs. Executors start their own Python processes, on their own machines. Pack the environment, pin the versions, and treat configuration as part of the release.",
}
