import type { Course } from '../types'
import { thePlan } from './01-the-plan'
import { readLake } from './02-read-lake'
import { clean } from './03-clean'
import { batchAggregate } from './04-batch-aggregate'
import { partitionedWrite } from './05-partitioned-write'
import { ingest } from './06-ingest'
import { enrich } from './07-enrich'
import { window } from './08-window'
import { realTimeView } from './09-real-time-view'
import { serving } from './10-serving'
import { deploy } from './11-deploy'
import { tune } from './12-tune'
import { closer } from './13-closer'

// Course 15 (capstone) — "Everything, end to end". The one course in this repo that BUILDS rather than
// explains: a Lambda-architecture analytics pipeline over an e-commerce clickstream, written as a
// batch layer (a nightly DataFrame job) and a speed layer (Structured Streaming), merged for serving,
// then deployed and tuned on a cluster.
//
// Ported from the `apache-spark` repo on 2026-09-24, where it closed a five-course applied arc. Course
// ids and all thirteen SECTION ids are verbatim from that repo, because the published slug
// (`capstone-<sectionId>`) keys the narration wavs — see COURSE-PLAN.md §"The capstone port".
//
// What the port had to change: that repo's narration and slides pointed at its sibling courses by name
// ("a direct callback to the API course", "remember from the architecture course", "the four
// courses"), and eight of the thirteen sections did it. Every course here is a standalone
// search-first video, so none may assume another has been watched — src/content/index.ts is explicit
// about it. Each pointer is replaced by a two-sentence inline explanation of the prerequisite, which
// is what that rule prescribes. The eight rewritten sections are the-plan, clean, batch-aggregate,
// ingest, window, deploy, tune and closer; their wavs must be regenerated. The other five
// (read-lake, partitioned-write, enrich, real-time-view, serving) carry verbatim narration and their
// existing wavs are reused unchanged.
//
// One claim was also re-grounded rather than ported: §12 framed AQE as a Spark 3 flag you switch on.
// `spark.sql.adaptive.enabled` and both of the sub-behaviours it names have defaulted to TRUE since
// Spark 3.2, so the section now teaches what AQE is already doing to your plan instead. Same rule as
// course 12 — see src/scenes/aqe/index.ts.
//
// Shape: §1 the-plan and §13 closer ride the `cap-lambda-arch` master map; the 11 build sections in
// between each carry their stage's CODE card on the left, with the prose and an "Exercises: <concept>"
// tag on the right. Batch is built first, then speed, then serving, then run/tune.
export const capstone: Course = {
  id: 'capstone',
  title: 'Capstone: an end-to-end pipeline',
  sections: [
    thePlan,
    readLake,
    clean,
    batchAggregate,
    partitionedWrite,
    ingest,
    enrich,
    window,
    realTimeView,
    serving,
    deploy,
    tune,
    closer,
  ],
}
