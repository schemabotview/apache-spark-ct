import type { Scene } from '@graphlearning/flow'

export const oneParentThreeChildren: Scene = {
  id: 'mem-one-parent',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'shape',
      label: 'One expensive parent, three things that want it',
      pattern: 'group',
      sub: 'an ordinary shape: read, clean, then answer three questions from the cleaned data',
      cols: 3,
      children: [
        { id: 'c1', label: 'count()', pattern: 'network', sub: 'job 1' },
        { id: 'c2', label: 'write(summary)', pattern: 'network', sub: 'job 2' },
        { id: 'c3', label: 'write(detail)', pattern: 'network', sub: 'job 3' },
      ],
    },
    {
      id: 'without',
      label: 'The parent runs 3×',
      pattern: 'warn',
      icon: 'repeat',
      sub: 'a recipe gets re-cooked, from the source, per action',
    },
    {
      id: 'with',
      label: 'With cache: once, then reused',
      pattern: 'group',
      sub: 'and this is the ONLY situation where caching reliably pays — a shared, expensive, reused parent',
      cols: 2,
      children: [
        { id: 'wi-first', label: 'the first action fills it', pattern: 'service', sub: 'cache() is lazy — nothing happens before' },
        { id: 'wi-rest', label: 'the rest read memory', pattern: 'service', sub: 'no re-read, no re-shuffle' },
      ],
    },
  ],
  edges: [
    { source: 'shape', target: 'without' },
    { source: 'without', target: 'with' },
  ],
}
