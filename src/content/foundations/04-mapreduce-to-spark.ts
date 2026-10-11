import type { Section } from '../types'

export const mapreduceToSpark: Section = {
  id: 'mapreduce-to-spark',
  title: 'From MapReduce to Spark',
  scene: 'mapreduce-vs-spark',
  focus: 'mr-hdfs',
  slide: `## From MapReduce to Spark

**MapReduce** made large batch jobs practical: split the input, **map** each piece, **shuffle** by key, **reduce**.

### Where it hurt
- Each job wrote its output to **replicated storage**
- Multi-step work became a **chain of jobs**
- Every step re-read what the last one had written

### What Spark changed
- One program describes a **whole plan** of steps
- Intermediate results stay **inside the application**
- Data reused across steps can be **cached**

### The misconception
Spark is not purely in memory: shuffles write to **local disk**, and data **spills** when memory runs short. What it removed was the **replicated-storage round trip** between steps.`,
  narration:
    "Spark did not arrive out of nowhere. Before it, the standard model for large batch processing was MapReduce. You split the input, a map function processes each piece, the framework shuffles the results so that everything with the same key lands together, and a reduce function combines them. That model made processing at this scale practical, and its ideas are still inside Spark. The trouble was what happened between jobs. Each MapReduce job wrote its output to replicated distributed storage, such as HDFS. So a task with several steps, like summing sales and then joining the result to store data, became a chain of separate jobs, and every link in the chain wrote its result out and read it straight back in. Iterative work, which revisits the same data many times, paid that cost on every pass. Spark grew out of research at UC Berkeley aimed at exactly this. One Spark program describes the whole sequence of steps, so the engine can plan them together, keep intermediate results inside the application, and cache data that is reused. Here is the misconception to avoid. Spark is not purely in memory. It still writes shuffle data to local disk, and it spills to disk when memory runs short. What it avoids is the round trip through replicated storage between every step.",
}
