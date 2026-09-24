import type { Section } from '../types'

export const physicalCandidates: Section = {
  id: 'physical-candidates',
  title: 'One logical plan, several physical ones',
  scene: 'cat-physical',
  focus: 'strategies',
  slide: `## One logical plan, several physical ones

The optimized logical plan says **what**. It says nothing about **how**.

\`\`\`
Join (user#3 = user#9)
\`\`\`

That's a *what*. Here are three *hows*, and they compute exactly the same rows:

| | |
|---|---|
| **BroadcastHashJoin** | ship the small side to everyone. No shuffle. |
| **SortMergeJoin** | shuffle both, sort both, merge |
| **ShuffledHashJoin** | shuffle both, hash one side |

### Identical answers, wildly different cost
Minutes versus hours, on the same data. Nothing about the *logical* plan distinguishes them — the difference is entirely in what they do to the cluster.

Which is the whole reason a **cost model** has to exist: something must choose, and correctness can't.

> Strategies also pick how to aggregate (hash vs sort) and how to scan. Joins are just where the difference is most dramatic.`,
  narration:
    "Here's a distinction that's easy to miss and clarifies a lot once you have it. The optimized logical plan says what you want. It does not say how to get it. Take a node that says: join these two relations where user equals user. That's a complete statement of what. It's also completely silent on how. And there are several hows, all of which produce byte-for-byte identical results. A broadcast hash join ships the entire small side to every executor and probes locally — no shuffle at all. A sort-merge join shuffles both sides by the key, sorts both, and merges them. A shuffled hash join shuffles both sides too, but builds a hash table from the smaller one instead of sorting. Same rows out. Same answer. But the cost difference between them is not marginal — it's minutes versus hours on the same data, because one of them moves nothing across the network and another moves everything twice. And this is exactly why a cost model has to exist. If every physical plan gave a different answer, you'd pick by correctness and be done. They don't. They all give the same answer, so correctness tells you nothing, and something else has to choose. That something is a cost estimate. This is where Catalyst stops being pure algebra — up to this point every rewrite was provably equivalence-preserving — and starts making bets. Joins are where the difference is most dramatic, but strategies make the same kind of choice about how to aggregate, whether by hash or by sort, and how to scan a source.",
}
