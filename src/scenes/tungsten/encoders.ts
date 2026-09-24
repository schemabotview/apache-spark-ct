import type { Scene } from '@graphlearning/flow'

export const encoders: Scene = {
  id: 'tun-encoders',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'object',
      label: 'Your JVM object',
      pattern: 'storage',
      icon: 'package',
      sub: 'case class Flight(dest: String, cnt: Long)',
    },
    {
      id: 'encoder',
      label: 'The encoder',
      pattern: 'service',
      icon: 'repeat',
      sub: 'generated code, both directions',
      cols: 1,
      children: [
        { id: 'e-to', label: 'object → bytes', pattern: 'network', sub: 'field by field, into the layout' },
        { id: 'e-from', label: 'bytes → object', pattern: 'network', sub: 'only when you actually ask' },
      ],
    },
    {
      id: 'binary',
      label: 'UnsafeRow',
      pattern: 'service',
      icon: 'binary',
      sub: 'what the engine actually operates on',
    },
    {
      id: 'cost',
      label: 'Which is the real cost of a typed Dataset',
      pattern: 'group',
      sub: 'a DataFrame stays in binary throughout; a typed lambda forces a round trip per row',
      cols: 2,
      children: [
        { id: 'c-df', label: 'DataFrame ops', pattern: 'service', sub: 'never leave the binary form' },
        { id: 'c-ds', label: 'a typed .map { … }', pattern: 'warn', sub: 'decode → your code → re-encode' },
      ],
    },
  ],
  edges: [
    { source: 'object', target: 'encoder' },
    { source: 'encoder', target: 'binary' },
    { source: 'binary', target: 'cost' },
  ],
}
