import type { Scene } from '@graphlearning/flow'

export const theThree: Scene = {
  id: 'lake-the-three',
  padding: 0.15,
  flow: 'TB',
  nodes: [
    {
      id: 'table',
      kind: 'table',
      pattern: 'service',
      label: 'Delta, Iceberg, Hudi — what actually differs',
      sub: 'all three are a log beside Parquet · everything in this course applies to all of them',
      headers: ['', 'Shape of the metadata', 'Where it came from'],
      values: [
        ['Delta Lake', 'a JSON log, periodically checkpointed to Parquet', 'Databricks · closest to Spark by default'],
        ['Apache Iceberg', 'a tree of manifests — snapshot → manifest list → files', 'Netflix · built for very large tables and engine neutrality'],
        ['Apache Hudi', 'a timeline, with record-level indexes', 'Uber · built around upserts and incremental pulls'],
      ],
    },
    {
      id: 'advice',
      label: 'And the honest advice',
      pattern: 'network',
      icon: 'lightbulb',
      sub: 'the mechanism matters; the choice rarely does',
    },
  ],
  edges: [{ source: 'table', target: 'advice' }],
}
