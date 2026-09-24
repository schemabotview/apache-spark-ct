import type { Section } from '../types'

export const serving: Section = {
  id: 'serving',
  title: 'Serving · Merge the two views',
  scene: 'cap-serving',
  slide: `## Serving · Merge the two views

The final query answers **“revenue by category, up to now”** by merging the accurate **batch history** with the latest **real-time slice**.

### What’s happening
- Take **history from batch** (accurate) + **today from the stream** (fresh)
- \`unionByName\` stitches them; a final \`groupBy\` gives one number per category
- This split — accuracy from batch, latency from speed — is the **essence of Lambda**

**Exercises:** the Lambda serving merge · DataFrame union + aggregate`,
  narration:
    'Now we bring the two halves together in the serving layer, and this is the whole point of the Lambda architecture. We have two tables. The batch view is accurate but stale — trustworthy for every day up to and including yesterday. The real-time view is fresh but only covers today’s in-flight windows. So the serving query simply takes the best of each: read the batch view for all the historical days, read the real-time view for today, and union them together with unionByName, which lines the columns up by name. A final groupBy on category sums across both, and out comes a single, current answer — revenue by category, right up to this moment — that’s both accurate for history and fresh for the present. That division of labor is the essence of Lambda: the batch layer owns correctness, the speed layer owns latency, and the serving layer merges them into one answer that has both. And notice, one more time, that this merge is just ordinary DataFrame code — a filter, a union, a groupBy — the same structured API we’ve used at every single stage, batch and stream alike. The data pipeline is now complete, end to end. What’s left is to actually run it — to package these jobs and put them on a cluster — and then to make them fast.',
}
