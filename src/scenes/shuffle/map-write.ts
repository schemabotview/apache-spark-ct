import type { Scene } from '@graphlearning/flow'

// §3 map-side-write — zoomed all the way in to ONE map task, because the thing people get wrong is
// imagining the shuffle as executors talking to each other. Nothing is sent here. A task computes
// a destination per row, sorts by it, spills when the buffer fills, and merges to exactly TWO files
// on its own local disk. Drawn as a pipeline inside the task, ending in the disk group — the two
// files are separate nodes because "one data file and one index file, per task, not per reducer" is
// the fact worth a whole section.
export const mapWrite: Scene = {
  id: 'shuffle-map-write',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'task',
      label: 'One map task — task 2 of 4, on executor B',
      pattern: 'group',
      sub: 'sort-based shuffle writer · the default since Spark 1.2',
      children: [
        { id: 'rows', label: 'its partition of rows', pattern: 'storage', icon: 'database', sub: 'the only rows this task can see' },
        { id: 'part', label: 'partitioner', pattern: 'service', icon: 'router', sub: 'hash(user_id) % 200 → a destination id per row' },
        {
          id: 'buffer',
          label: 'in-memory buffer',
          pattern: 'service',
          sub: 'records sorted by destination id',
          cols: 3,
          children: [
            { id: 'b0', label: '→ 0', pattern: 'network', variant: 'tile' },
            { id: 'b1', label: '→ 1', pattern: 'network', variant: 'tile' },
            { id: 'b199', label: '→ 199', pattern: 'network', variant: 'tile' },
          ],
        },
        { id: 'spill', label: 'spill', pattern: 'warn', sub: 'buffer full → a sorted run goes to disk, buffer empties, repeat' },
        {
          id: 'disk',
          label: 'local disk — spark.local.dir',
          pattern: 'group',
          sub: 'spilled runs merged into exactly two files, however many reducers there are',
          cols: 2,
          children: [
            { id: 'data', label: 'shuffle_0_2_0.data', pattern: 'storage', icon: 'database', sub: 'all 200 destinations, back to back, in order' },
            { id: 'index', label: 'shuffle_0_2_0.index', pattern: 'storage', sub: 'where destination k starts and ends' },
          ],
        },
      ],
      edges: [
        { source: 'rows', target: 'part' },
        { source: 'part', target: 'buffer' },
        { source: 'buffer', target: 'spill' },
        { source: 'spill', target: 'disk' },
      ],
    },
  ],
  edges: [],
}
