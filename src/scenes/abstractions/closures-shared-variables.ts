import type { Scene } from '@graphlearning/flow'

// §3.3 — three behaviours of code shipped to tasks, each with the value Spark 4.0.1 actually returned
// on the sample: a mutated driver list stays empty, a broadcast lookup works, and an accumulator
// updated inside a transformation counts once per action that recomputes it.
export const closuresSharedVariables: Scene = {
  id: 'closures-shared-variables',
  title: 'Closures, broadcasts and accumulators',
  flow: 'TB',
  nodes: [
    {
      id: 'closure-code',
      kind: 'code',
      filename: 'shared_variables.py',
      label: `seen = []
rows.foreach(lambda r: seen.append(r))
len(seen)        # 0: tasks appended to copies

cities = sc.broadcast({7: "Leeds", 9: "York",
                       12: "Hull"})
named = totals.map(
    lambda kv: (cities.value[kv[0]], kv[1]))
sorted(named.collect())
# [('Hull', 80.0), ('Leeds', 65.0), ('York', 15.0)]

n = sc.accumulator(0)
mapped = rows.map(lambda r: n.add(1) or r)
n.value                   # 0: nothing has run
mapped.count(); n.value   # 6
mapped.count(); n.value   # 12: the map ran again`,
    },
    {
      id: 'shared-variable-kinds',
      label: 'What reaches a task',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'closure-copy', label: 'Closure', sub: 'a serialized copy per task', pattern: 'warn', icon: 'copy' },
        { id: 'broadcast-var', label: 'Broadcast', sub: 'read-only, once per executor', pattern: 'service', icon: 'share' },
        { id: 'accumulator-var', label: 'Accumulator', sub: 'add-only; driver reads it', pattern: 'network', icon: 'sigma' },
      ],
    },
  ],
  edges: [{ source: 'closure-code', target: 'shared-variable-kinds' }],
}
