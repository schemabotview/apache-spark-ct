import type { Scene } from '@graphlearning/flow'

export const downToRdds: Scene = {
  id: 'cat-to-rdds',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'physical',
      label: 'The selected physical plan',
      pattern: 'service',
      icon: 'gitmerge',
      sub: 'still a tree of operators, not yet anything runnable',
    },
    {
      id: 'codegen',
      label: 'Whole-stage code generation',
      pattern: 'group',
      sub: 'a run of operators is compiled into ONE generated Java method — no operator-to-operator calls left',
      cols: 2,
      children: [
        { id: 'cg-what', label: 'one fused loop', pattern: 'network', sub: 'scan + filter + project, together' },
        { id: 'cg-see', label: 'the ★ in the plan', pattern: 'network', sub: 'marks a codegen stage' },
      ],
    },
    {
      id: 'rdds',
      label: 'And then: RDDs',
      pattern: 'storage',
      icon: 'layers',
      sub: 'same partitions, tasks and lineage as everything else',
    },
  ],
  edges: [
    { source: 'physical', target: 'codegen' },
    { source: 'codegen', target: 'rdds', label: 'Spark is a compiler' },
  ],
}
