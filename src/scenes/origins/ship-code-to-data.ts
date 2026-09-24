import type { Scene } from '@graphlearning/flow'

// §2 — ship code to data. One inversion, drawn as a before/after, because it is the whole idea.
export const shipCodeToData: Scene = {
  id: 'origins-ship-code',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'old',
      label: 'The old shape — bring the data to the program',
      pattern: 'group',
      sub: 'works until the data is bigger than the pipe: a terabyte over a gigabit link is hours before any work starts',
      flow: 'LR',
      children: [
        { id: 'o-store', label: 'storage array', pattern: 'storage', sub: 'all the data, one place' },
        { id: 'o-pipe', label: 'the network', pattern: 'warn', sub: 'the bottleneck' },
        { id: 'o-cpu', label: 'one big server', pattern: 'service', sub: 'all the compute, one place' },
      ],
      edges: [
        { source: 'o-store', target: 'o-pipe' },
        { source: 'o-pipe', target: 'o-cpu' },
      ],
    },
    {
      id: 'new',
      label: 'The inversion — send the program to the data',
      pattern: 'group',
      sub: 'the program is kilobytes and the data is terabytes, so move the small thing — GFS and MapReduce, Google, 2003–04',
      cols: 3,
      children: [
        { id: 'n1', label: 'node 1', pattern: 'service', sub: 'its block + a copy of the code' },
        { id: 'n2', label: 'node 2', pattern: 'service', sub: 'its block + a copy of the code' },
        { id: 'n3', label: 'node 3', pattern: 'service', sub: 'its block + a copy of the code' },
      ],
    },
  ],
  edges: [{ source: 'old', target: 'new', label: 'move the kilobytes, not the terabytes' }],
}
