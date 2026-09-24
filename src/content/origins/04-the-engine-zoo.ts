import type { Section } from '../types'

export const theEngineZoo: Section = {
  id: 'the-engine-zoo',
  title: 'The engine zoo',
  scene: 'origins-engine-zoo',
  focus: 'zoo',
  slide: `## The engine zoo

If one general engine is slow for your workload, the obvious fix is a **specialist engine**. So the ecosystem grew one per workload.

| | |
|---|---|
| **Hive** | SQL over MapReduce |
| **Storm** | stream processing |
| **Impala** | interactive SQL |
| **Giraph** | graph processing |
| **Mahout** | machine learning |
| **Drill** | ad-hoc queries |

Each one was **good at its job.** That isn't the problem.

### The problem was the borders
- A separate **API** to learn, per engine
- A separate **cluster** to operate, tune and be paged about
- A separate **failure model** — they all broke differently
- And a pipeline crossing three of them **wrote to disk at every hop**, because they had nothing else to share

> Nobody has one workload. Real pipelines cross four of these before breakfast.`,
  narration:
    "There's a second consequence of that round-trip, and it shaped the whole ecosystem. If one general-purpose engine is too slow for your particular workload, the obvious response is to build a specialist engine for it. And that's exactly what happened, repeatedly. If you wanted SQL, you used Hive, which compiled queries into MapReduce jobs. If you needed streaming, Storm. Interactive SQL that didn't take minutes? Impala. Graph processing? Giraph. Machine learning? Mahout. Ad-hoc queries? Drill. Each of these was genuinely good at the thing it was built for, and I don't want to be unfair to them — that's not the problem. The problem was that nobody has one workload. A real data pipeline reads some files, cleans them with SQL, joins in a stream of events, trains a model, and writes a result. That's four engines. Which meant four different APIs your team had to learn, four separate clusters to install and tune and get paged about at three in the morning, and four different failure models, because they all broke in their own distinctive ways. And worst of all, look at the borders between them. Hive can't hand an in-memory dataset to Mahout. They share nothing. So every handoff went through disk — write the whole intermediate result out in one engine's format, read it back in another's. You paid the round-trip from the last section again, at every boundary, on top of paying it inside each engine. The zoo wasn't a design. It was what happens when the shared layer isn't good enough to share.",
}
