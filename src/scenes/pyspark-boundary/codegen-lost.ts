import type { Scene } from '@graphlearning/flow'

export const codegenLost: Scene = {
  id: 'pyb-codegen-lost',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'without',
      label: 'Without a UDF — one fused loop',
      pattern: 'group',
      sub: 'scan, filter and project compiled into a single generated Java method, marked *(1) in the plan',
      flow: 'LR',
      children: [
        { id: 'w-s', label: 'scan', pattern: 'service', sub: '*(1)', variant: 'tile' },
        { id: 'w-f', label: 'filter', pattern: 'service', sub: '*(1)', variant: 'tile' },
        { id: 'w-p', label: 'project', pattern: 'service', sub: '*(1)', variant: 'tile' },
      ],
      edges: [
        { source: 'w-s', target: 'w-f' },
        { source: 'w-f', target: 'w-p' },
      ],
    },
    {
      id: 'with',
      label: 'With one Python UDF in the middle',
      pattern: 'group',
      sub: 'BatchEvalPython has no * — it is a wall, and the loop that held three operators is now two loops',
      flow: 'LR',
      children: [
        { id: 'x-s', label: 'scan', pattern: 'service', sub: '*(1)', variant: 'tile' },
        { id: 'x-u', label: 'BatchEvalPython', pattern: 'warn', sub: 'no *', variant: 'tile' },
        { id: 'x-p', label: 'project', pattern: 'service', sub: '*(2)', variant: 'tile' },
      ],
      edges: [
        { source: 'x-s', target: 'x-u' },
        { source: 'x-u', target: 'x-p' },
      ],
    },
    {
      id: 'and',
      label: 'Opaque to Catalyst too',
      pattern: 'warn',
      icon: 'eyeOff',
      sub: 'a filter inside a UDF cannot be pushed down',
    },
  ],
  edges: [
    { source: 'without', target: 'with' },
    { source: 'with', target: 'and' },
  ],
}
