import type { Section } from '../types'

export const localApplication: Section = {
  id: 'local-application',
  title: 'A small Spark application',
  scene: 'local-app-lifecycle',
  focus: 'run-action',
  slide: `## A small Spark application

**Objective:** read a complete PySpark application and say what each part does — before any of it runs.

### Environment assumptions
- Spark **4.0.1** on Java **17 or 21**, Python **3.9+**
- \`local[4]\`: one machine, **4 worker threads**
- An explicit **schema**, so reading infers nothing

### The lifecycle
1. **Start:** \`getOrCreate()\` creates the session and its driver
2. **Declare:** \`read\`, \`where\`, \`groupBy\` only **describe** work
3. **Run:** \`write\` is the **action** that executes it
4. **Stop:** \`stop()\` releases the application's resources

**Misconception:** each line runs as it is reached. No order data is read until line 17.`,
  narration:
    "This chapter follows one small application from the first line to the last, so let's read it carefully before anything runs. It assumes Spark four point zero point one, which runs on Java seventeen or twenty one and Python three point nine or later. The master setting, local four, means everything runs on one machine with four worker threads, which is enough to show every idea in this chapter without a cluster. The application has four phases. First, get or create builds a Spark session, and with it the driver, the process that will plan and coordinate everything. Second, the application declares its work: read the day's order events with an explicit schema, keep the completed orders, and sum the sales per store. Third comes the write, and that is the line that actually does something. Fourth, stop releases the application's resources. Here is the assumption to drop straight away. It is natural to read this top to bottom and picture each line executing as it is reached. It doesn't. The read, the filter and the grouping only describe the computation. No order data is read until line seventeen, when the write asks for a result. The explicit schema matters too. Without it, Spark would have to scan the files just to discover their columns, and that scan would happen early. Over the next sections, we'll see who runs each part, and how one write becomes jobs, stages and tasks.",
}
