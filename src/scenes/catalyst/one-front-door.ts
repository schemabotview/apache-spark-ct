import type { Scene } from '@graphlearning/flow'

export const oneFrontDoor: Scene = {
  id: 'cat-one-front-door',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'ways',
      label: 'Three ways to ask the same question',
      pattern: 'group',
      sub: 'people believe one of these is faster than the others — and on the structured APIs, none of them is',
      cols: 3,
      children: [
        { id: 'w-sql', label: 'SQL', pattern: 'network', sub: 'SELECT dest, count(*) …' },
        { id: 'w-df', label: 'DataFrame', pattern: 'network', sub: 'df.groupBy("dest").count()' },
        { id: 'w-ds', label: 'Dataset', pattern: 'network', sub: 'typed, Scala and Java only' },
      ],
    },
    {
      id: 'same',
      label: 'One unresolved logical plan',
      pattern: 'service',
      icon: 'gitmerge',
      sub: 'the same tree, whichever door you came through',
    },
    {
      id: 'why',
      label: 'Which is why two things people argue about are settled',
      pattern: 'group',
      sub: 'language and dialect are ergonomic choices, not performance ones — the optimizer never learns which you used',
      cols: 2,
      children: [
        { id: 'y-lang', label: 'Python is not slower', pattern: 'service', sub: 'until you write a UDF' },
        { id: 'y-sql', label: 'SQL is not slower', pattern: 'service', sub: 'nor faster — it is the same tree' },
      ],
    },
  ],
  edges: [
    { source: 'ways', target: 'same' },
    { source: 'same', target: 'why' },
  ],
}
