import type { Scene } from '@graphlearning/flow'

export const whereItStops: Scene = {
  id: 'tun-where-it-stops',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'opaque',
      label: 'Codegen must see inside',
      pattern: 'service',
      icon: 'eye',
      sub: 'logic it cannot read, it cannot inline into the loop',
    },
    {
      id: 'breaks',
      label: 'What breaks the fusion',
      pattern: 'group',
      sub: 'each of these becomes a wall the generated loop stops at, and the stage splits around it',
      cols: 3,
      children: [
        { id: 'b-udf', label: 'a Python UDF', pattern: 'warn', sub: 'a different process entirely' },
        { id: 'b-scala', label: 'a Scala UDF', pattern: 'warn', sub: 'a black box, even in the JVM' },
        { id: 'b-wide', label: 'very wide rows', pattern: 'warn', sub: 'the method exceeds the JVM’s 64 KB limit' },
      ],
    },
    {
      id: 'lesson',
      label: 'Which reframes what a UDF costs',
      pattern: 'group',
      sub: 'the cost is not only running your function — it is everything around it that now cannot be fused',
      cols: 2,
      children: [
        { id: 'le-builtin', label: 'prefer a built-in', pattern: 'service', sub: 'it fuses; yours does not' },
        { id: 'le-expr', label: 'or a SQL expression', pattern: 'service', sub: 'still a tree Spark can read' },
      ],
    },
  ],
  edges: [
    { source: 'opaque', target: 'breaks' },
    { source: 'breaks', target: 'lesson' },
  ],
}
