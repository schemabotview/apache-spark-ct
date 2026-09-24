import type { Section } from '../types'

export const windows: Section = {
  id: 'windows',
  title: 'Windows: bounding an unbounded question',
  scene: 'str-windows',
  focus: 'kinds',
  slide: `## Windows

An unbounded stream needs a **bounded question.**

*"How many events?"* has no answer — it's still going up. *"How many in the 10 minutes to 09:10?"* has one.

### Three shapes
| | |
|---|---|
| **Tumbling** | fixed, no overlap — a row lands in **one** window |
| **Sliding** | overlapping — a row counts in **several** |
| **Session** | grows with activity, closes after a gap of inactivity |

\`\`\`python
window("ts", "10 minutes")              # tumbling
window("ts", "10 minutes", "5 minutes") # sliding
session_window("ts", "30 minutes")      # session
\`\`\`

### The cost differs, and it's not obvious
A 10-minute window sliding every minute means each row is counted in **ten** windows — ten times the state, ten times the update work.

### And each open window is state
Which is why a window that never closes is a leak.

> Session windows are the most expensive: the window's *end* isn't known until the gap has passed, so nothing can be finalised early.`,
  narration:
    "Once you're working in event time, you need windows, because an unbounded stream needs a bounded question. How many events have there been? There's no answer — the number is still going up, and any value you give is instantly wrong. How many events were there in the ten minutes ending at nine-ten? That has a definite answer, and it stops changing once enough time has passed. There are three shapes. Tumbling windows are fixed and don't overlap: nine to nine-ten, nine-ten to nine-twenty, and so on. Every row lands in exactly one. Sliding windows overlap: a ten-minute window computed every minute, so at any moment ten windows are open and each row is counted in all ten. Session windows are different in kind — they grow while activity continues and close after a gap of inactivity, which is how you model a user's visit rather than a clock interval. The cost difference is worth spelling out, because it's not obvious from the API. A tumbling window means one state entry per key per window. A ten-minute window sliding every minute means each row contributes to ten windows, so you have ten times the state and ten times the update work for the same input. That's a real multiplier and people walk into it. Session windows are the most expensive of all, because the window's end isn't known until the inactivity gap has actually elapsed — so nothing can be finalised early, and state has to be held speculatively. The unifying point: every open window is state. Which means a window that never closes is a memory leak with a schedule.",
}
