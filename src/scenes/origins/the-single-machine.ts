import type { Scene } from '@graphlearning/flow'

// §1 — where one machine stops. The point is that this is a HARDWARE fact, not a software choice.
export const theSingleMachine: Scene = {
  id: 'origins-single-machine',
  padding: 0.14,
  flow: 'TB',
  nodes: [
    {
      id: 'free-lunch',
      label: 'Until ~2005, programs got faster on their own',
      pattern: 'group',
      sub: 'each year the same code ran faster, because each year the clock went up — nobody had to do anything',
      cols: 3,
      children: [
        { id: 'y1', label: '1995 · 100 MHz', pattern: 'service', sub: 'same code' },
        { id: 'y2', label: '2000 · 1 GHz', pattern: 'service', sub: 'same code, 10× faster' },
        { id: 'y3', label: '2005 · 3 GHz', pattern: 'service', sub: 'and then it stopped' },
      ],
    },
    {
      id: 'wall',
      label: 'Heat, not ambition',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'clock speed stalled — power and heat scale faster than it does',
    },
    {
      id: 'after',
      label: 'The industry turned sideways instead',
      pattern: 'group',
      sub: 'more cores at the same speed — which means nothing gets faster unless the program is rewritten to use them',
      cols: 2,
      children: [
        { id: 'a-cores', label: 'more cores', pattern: 'network', sub: 'then more machines' },
        { id: 'a-cost', label: 'the cost moved', pattern: 'network', sub: 'to you, into the program' },
      ],
    },
  ],
  edges: [
    { source: 'free-lunch', target: 'wall' },
    { source: 'wall', target: 'after' },
  ],
}
