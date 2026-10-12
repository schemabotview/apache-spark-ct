import type { Scene } from '@graphlearning/flow'

// §4.3 — the same expressions under ANSI mode (the 4.0 default) and with it switched off, as 4.0.1
// returned them, plus the deliberate alternatives.
export const ansiCasts: Scene = {
  id: 'ansi-casts',
  title: 'ANSI mode on and off',
  flow: 'TB',
  nodes: [
    {
      id: 'ansi-table',
      kind: 'table',
      label: 'Same expression, two modes',
      sub: 'spark.sql.ansi.enabled',
      headers: ['expression', 'true (default)', 'false'],
      values: [
        ["CAST('12,50' AS DECIMAL(10,2))", 'CAST_INVALID_INPUT', 'NULL'],
        ['2147483647 + 1', 'ARITHMETIC_OVERFLOW', '-2147483648'],
        ['10 / 0', 'DIVIDE_BY_ZERO', 'NULL'],
        ['CAST(123.456 AS DECIMAL(4,2))', 'NUMERIC_VALUE_OUT_OF_RANGE', 'NULL'],
      ],
    },
    {
      id: 'deliberate-code',
      kind: 'code',
      filename: 'deliberate.sql',
      label: `SELECT TRY_CAST('12,50' AS DECIMAL(10,2))  -- NULL
SELECT try_add(2147483647, 1)              -- NULL
SELECT try_divide(10, 0)                   -- NULL
SELECT CAST(2147483647 AS BIGINT) + 1  -- 2147483648

SELECT 0.1D + 0.2D    -- 0.30000000000000004
SELECT 0.1BD + 0.2BD  -- 0.3`,
    },
  ],
  edges: [],
}
