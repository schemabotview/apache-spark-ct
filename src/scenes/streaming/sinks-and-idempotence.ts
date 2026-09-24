import type { Scene } from '@graphlearning/flow'

export const sinksAndIdempotence: Scene = {
  id: 'str-sinks',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'three',
      label: 'Exactly-once needs three things, and Spark provides two',
      pattern: 'group',
      sub: 'the third is the sink’s, and no amount of Spark configuration can supply it',
      cols: 3,
      children: [
        { id: 't-src', label: 'a replayable source', pattern: 'service', sub: 'Kafka, files — ask again by offset' },
        { id: 't-det', label: 'deterministic compute', pattern: 'service', sub: 'same input, same output' },
        { id: 't-sink', label: 'an idempotent sink', pattern: 'warn', sub: 'writing twice = writing once' },
      ],
    },
    {
      id: 'why',
      label: 'A retry writes twice',
      pattern: 'warn',
      icon: 'copy',
      sub: 'replay gives at-least-once · the sink must do the rest',
    },
    {
      id: 'how',
      label: 'How a sink can manage it',
      pattern: 'group',
      sub: 'file and Delta sinks handle this for you; anything you write by hand does not',
      cols: 3,
      children: [
        { id: 'h-file', label: 'file sink', pattern: 'service', sub: 'a manifest of committed files' },
        { id: 'h-delta', label: 'a transactional table', pattern: 'service', sub: 'one atomic commit per batch' },
        { id: 'h-batch', label: 'foreachBatch + MERGE', pattern: 'network', sub: 'upsert on a key, with a batch id' },
      ],
    },
  ],
  edges: [
    { source: 'three', target: 'why' },
    { source: 'why', target: 'how' },
  ],
}
