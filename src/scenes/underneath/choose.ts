import type { Scene, SceneNode } from '@graphlearning/flow'
import rdd from '../../../spine/underneath/01-lineage/project/explore/rdd_lineage.py?raw'
import dataframe from '../../../spine/write/05-whole-job/project/jobs/daily_sales.py?raw'
import sql from '../../../spine/transform/06-sql/project/jobs/daily_sales.py?raw'

// The same completed-sales summary three ways, each card quoting a file that ran in this course.
const card = (id: string, filename: string, label: string, show: [number, number][]): SceneNode =>
  ({ id, kind: 'code', filename, label: label.replace(/\n+$/, ''), show, hug: true, pattern: 'storage' })

export const chooseAbstraction: Scene = {
  id: 'choose-abstraction',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'three-ways',
      label: 'One summary, three ways',
      bare: true,
      children: [
        card('as-rdd', 'explore/rdd_lineage.py — RDD', rdd, [[12, 16]]),
        card('as-dataframe', 'jobs/daily_sales.py — DataFrame', dataframe, [[22, 26]]),
        card('as-sql', 'jobs/daily_sales.py — SQL (Course 5)', sql, [[24, 31]]),
      ],
    },
    {
      id: 'below',
      label: 'Compare',
      bare: true,
      framed: true,
      children: [
        {
          id: 'compare',
          kind: 'table',
          label: 'What each one gives you',
          headers: ['', 'RDD', 'DataFrame', 'SQL', 'Dataset (Scala)'],
          values: [
            ['rows are', 'any Python object', 'Rows with a schema', 'rows with a schema', 'typed JVM objects'],
            ['optimised by Spark', 'no', 'yes', 'yes', 'yes'],
            ['functions run in', 'Python workers', 'the JVM', 'the JVM', 'the JVM'],
            ['type errors found', 'at run time', 'at analysis', 'at analysis', 'at compile time'],
            ['in PySpark', 'yes (classic only)', 'yes', 'yes', 'no'],
          ],
        },
        {
          id: 'choose-list',
          kind: 'list',
          icon: 'scale',
          label: 'Choosing',
          pattern: 'service',
          items: [
            'DataFrames or SQL by default: the optimizer works for you',
            'SQL when analysts maintain it; DataFrames when code builds it',
            'RDDs for data with no schema, or control over partitions',
            'Typed Datasets are Scala and Java only: Python has no compile step',
          ],
        },
      ],
    },
  ],
  edges: [],
}
