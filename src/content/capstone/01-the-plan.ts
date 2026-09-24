import type { Section } from '../types'

export const thePlan: Section = {
  id: 'the-plan',
  title: 'Capstone: an end-to-end pipeline',
  scene: 'cap-lambda-arch',
  slide: `## Capstone: an end-to-end pipeline

One project that puts every piece together — a **Lambda pipeline** over a live e-commerce clickstream, built two ways at once.

### The data & the goal
- A stream of **clickstream events** — views, add-to-carts, purchases (each with an event-time, user, product, amount)
- Goal: answer **“revenue by category, up to this moment”** — accurately *and* in real time

### Two layers, one dataset
- **Batch layer** *(left)* — a nightly job: accurate, reprocesses the full history — the *source of truth*
- **Speed layer** *(right)* — Structured Streaming: low-latency, approximate — *what’s happening now*
- **Serving layer** — merges the two: batch history + the latest real-time slice

**Why build it twice?** Streaming alone drifts and misses late data; batch alone is hours stale — **Lambda gives both**, and forces **nearly every part of Spark** into the open at once.`,
  narration:
    'This one is a build rather than an explainer: a single project, assembled end to end, with each piece of Spark explained at the moment we reach for it. Here’s the whole thing at a glance. We’re building an analytics pipeline over a live e-commerce clickstream: a never-ending flow of events — people viewing products, adding them to carts, and buying — each stamped with an event-time, a user, a product, and an amount. The goal is a single, deceptively simple question: what’s the revenue by product category, right up to this moment? — and we want that answer both accurate and up-to-the-second. The trick is that no single approach gives you both, so we use a Lambda architecture and build the pipeline two ways over the same data. On the left is the batch layer: a nightly job that reprocesses the full history from the data lake and produces slow but perfectly accurate results — the source of truth. On the right is the speed layer: a Structured Streaming job that reads from Kafka and gives low-latency, approximate answers about what’s happening right now. And at the bottom, the serving layer merges them — the accurate batch history plus the latest real-time slice — into one answer. Why go to all this trouble? Because streaming alone can drift and miss late-arriving data, while batch alone is always hours behind; Lambda gets you the best of both. And that is exactly what makes it worth building: it forces nearly every part of Spark into the open at the same time — the DataFrame API, the Catalyst optimizer, two completely different join strategies, partitioned writes, the streaming model with event-time windows and watermarks, deploy modes, and performance tuning. Every one of those gets explained where it comes up, so nothing here assumes you have met it before. We’ll build the batch layer first — the accurate foundation on the left — then the speed layer on the right, merge them in the serving layer, and finally package the whole thing, submit it to a cluster, and tune it in the Spark UI.',
}
