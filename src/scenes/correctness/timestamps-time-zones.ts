import type { Scene } from '@graphlearning/flow'

// §4.6 — one instant (o4 at 23:30 UTC) shown under three session time zones, the same wall-clock
// text stored as TIMESTAMP and TIMESTAMP_NTZ, and a DST-gap time. All real 4.0.1 output.
export const timestampsTimeZones: Scene = {
  id: 'timestamps-time-zones',
  title: 'One instant, three local dates',
  flow: 'TB',
  nodes: [
    {
      id: 'tz-table',
      kind: 'table',
      label: 'o4: 2026-10-01T23:30:00Z',
      sub: 'spark.sql.session.timeZone',
      headers: ['session time zone', 'ts shown', 'to_date(ts)'],
      values: [
        ['UTC', '2026-10-01 23:30:00', '2026-10-01'],
        ['Europe/London', '2026-10-02 00:30:00', '2026-10-02'],
        ['America/New_York', '2026-10-01 19:30:00', '2026-10-01'],
      ],
    },
    {
      id: 'ntz-code',
      kind: 'code',
      filename: 'ltz_vs_ntz.sql',
      label: `-- written with the session in Europe/London:
SELECT TIMESTAMP     '2026-10-01 23:30:00' AS ltz,
       TIMESTAMP_NTZ '2026-10-01 23:30:00' AS ntz
-- read back with the session in UTC:
-- ltz 2026-10-01 22:30:00   (an instant)
-- ntz 2026-10-01 23:30:00   (a wall clock)

-- London clocks skip 01:00–02:00 on 29 March:
SELECT to_timestamp('2026-03-29 01:30:00')
-- 2026-03-29 02:30:00`,
    },
  ],
  edges: [],
}
