import type { Scene } from '@graphlearning/flow'

export const rulesToFixpoint: Scene = {
  id: 'cat-rules',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'rule',
      label: 'Rule = tree → tree',
      pattern: 'service',
      icon: 'repeat',
      sub: 'pattern-match a shape, return a replacement',
    },
    {
      id: 'example',
      label: 'One rule firing three times, on one expression',
      pattern: 'group',
      sub: 'ConstantFolding: wherever both operands are literals, evaluate them now instead of per row',
      flow: 'LR',
      children: [
        { id: 'f-1', label: '(2 + 3) * cnt > 100', pattern: 'warn', sub: 'as written' },
        { id: 'f-2', label: '5 * cnt > 100', pattern: 'service', sub: 'folded once' },
        { id: 'f-3', label: 'no literals left', pattern: 'service', sub: 'the rule stops changing it' },
      ],
      edges: [
        { source: 'f-1', target: 'f-2' },
        { source: 'f-2', target: 'f-3' },
      ],
    },
    {
      id: 'batch',
      label: 'Rules run in batches, to a fixed point',
      pattern: 'group',
      sub: 'a batch repeats until a pass changes nothing — because one rule firing often exposes work for another',
      cols: 2,
      children: [
        { id: 'ba-why', label: 'why repeat', pattern: 'network', sub: 'folding a constant can enable a pushdown' },
        { id: 'ba-stop', label: 'and why it stops', pattern: 'network', sub: 'a pass with no change, or maxIterations' },
      ],
    },
  ],
  edges: [
    { source: 'rule', target: 'example' },
    { source: 'example', target: 'batch' },
  ],
}
