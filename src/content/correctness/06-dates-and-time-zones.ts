import type { Section } from '../types'

export const datesAndTimeZones: Section = {
  id: 'dates-and-time-zones',
  title: 'Dates, timestamps and time-zone assumptions',
  scene: 'timestamps-time-zones',
  focus: 'tz-table',
  slide: `## Dates, timestamps, time zones

### Worked: one instant, three dates
- o4 happened at **23:30 UTC** on 1 October
- Session in **UTC**: 2026-10-01 · in **Europe/London**: shown 00:30, date **2026-10-02** · in **New York**: 2026-10-01
- The daily total depends on \`spark.sql.session.timeZone\` — here it defaulted to the JVM's zone (\`Etc/UTC\`)

### Two timestamp types
- \`TIMESTAMP\`: an **instant**, displayed in the session zone
- \`TIMESTAMP_NTZ\`: a **wall-clock** value, never shifted
- Written in London, read in UTC: \`ltz\` 22:30, \`ntz\` 23:30

### The misconception
"Every local time exists." London's clocks skip 01:00–02:00 on 29 March, and \`01:30\` became **02:30**.`,
  narration:
    "Dates look simple until a business day crosses a time zone. Order four happened at eleven thirty at night, universal time, on the first of October. Which day did it happen on? It depends on who is asking. With the session time zone set to UTC, Spark shows eleven thirty and dates it the first. Set the session to London, which is an hour ahead in October, and the same instant shows as half past midnight, dated the second. In New York it is still the evening of the first. So a daily sales report puts this order on a different day depending on one setting, spark dot sql dot session dot time zone. In our run it was never set, so it defaulted to the machine's zone, which happened to be UTC. Set it explicitly, to the zone the business reports in. Spark also has two timestamp types, and they behave differently. A plain timestamp is an instant. It is stored once and displayed in whatever the session zone is. Timestamp N T Z, no time zone, is a wall clock reading that is never shifted. We wrote both from a London session and read them back in UTC. The instant moved to ten thirty. The wall clock stayed at eleven thirty. Finally, not every local time exists. On the twenty ninth of March, London's clocks jump from one to two in the morning. Ask Spark for one thirty that day in London, and it gives you two thirty.",
}
