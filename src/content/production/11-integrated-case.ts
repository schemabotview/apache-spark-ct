import type { Section } from '../types'

export const integratedCase: Section = {
  id: 'integrated-case',
  title: 'Integrated narrated case: explain and critique the retail pipeline’s production design',
  scene: 'production-review',
  focus: 'responsibility-table',
  slide: `## The retail pipeline in production

**Objective:** justify each production decision, and name where the guarantee really comes from.

### The decisions
- **Deploy:** Kubernetes, cluster mode, a pinned image with Spark 4.0.1
- **Capacity:** 50 executors × 4 cores — 200 slots, 8 waves, a 45-minute alert
- **Correctness:** quality checks stop the run before publishing
- **Recovery:** idempotent per-date overwrites; streaming via checkpoint and a \`batchId\`-keyed sink
- **Tables:** a table format for atomic commits and the o2-style updates
- **Security:** authentication, encryption, a secrets store, a proxy before Spark Connect

### The critique
- Store 7's skew still sets the runtime; late events like o7 miss the windows
- Several guarantees come from **outside Spark** — every one needs an owner you can name`,
  narration:
    "Let's finish by putting the whole course into one production design, the retail pipeline, and then critiquing it. Deployment: Kubernetes in cluster mode, from a pinned container image carrying Spark four point zero point one and the packed Python environment, so the scheduled job survives without anyone's laptop. Capacity: fifty executors with four cores each, two hundred slots, so the daily sixteen hundred tasks run in eight waves, with an alert at forty five minutes because the summary must be ready before the stores open. Correctness: quality checks on row counts, unique order ids, known stores and present amounts, stopping the run before anything is published. Recovery: batch outputs use idempotent per-date overwrites, so any day can be rerun; the live view uses a checkpoint and a sink keyed by batch id. Tables: a table format, so readers always see whole commits and updates like order two's become a merge. Security: authentication and encryption on, secrets in the platform's store, and an authenticating proxy before Spark Connect. Now the critique. Store seven's skew still sets the daily runtime, so the next performance work is known. Late events like order seven are missing from the streaming windows, and the business must accept or extend that watermark. And several guarantees come from outside Spark: the table format, the sink, the platform's identities. That is the lesson of this chapter. Every guarantee needs an owner you can name. From here, keep practising on unfamiliar code, plans and incidents; real competence comes from building and running pipelines yourself.",
}
