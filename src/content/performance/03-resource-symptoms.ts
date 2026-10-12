import type { Section } from '../types'

export const resourceSymptoms: Section = {
  id: 'resource-symptoms',
  title: 'Diagnose CPU, memory, spill, I/O and scheduling symptoms',
  scene: 'resource-symptoms',
  focus: 'symptom-table',
  slide: `## CPU, memory, spill, I/O, scheduling

Each symptom has a metric that **confirms** it — read that before changing anything.

### Worked symptoms from this chapter
- **CPU-bound:** 2,556 of 3,275 ms on CPU (78%); GC only 3%
- **Spill:** a 10M-row sort with a 1 GB driver spilled **637.5 MB**, 196 MB of it to disk
- **I/O:** 2,000 small files needed 63 read tasks — **1.96 s** vs 0.66 s for 32 files
- **Scheduling:** 2,000 shuffle tasks of about **1 ms** each

### Worked: the spill
- 1 partition: **22.0 s** — one task did 20 s of work
- 8 partitions: **8.1 s** — the same spill, spread over 8 tasks

### The misconception
"Spill means add memory." Here more **partitions** cut the time by 63% with the same memory.`,
  narration:
    "Slow stages are slow for different reasons, and each reason leaves a fingerprint in the metrics. The baseline's big stage spent two thousand five hundred and fifty six of its three thousand two hundred and seventy five milliseconds on the CPU, about seventy eight percent, and only three percent in garbage collection. It is CPU bound, which is healthy for a scan and aggregate. To see a memory problem, we sorted all ten million orders with the driver limited to one gigabyte. The stage spilled six hundred and thirty seven megabytes from memory, a hundred and ninety six of them to disk, meaning sort data did not fit and was written out and read back. Input and output problems look different again. Reading the same orders from two thousand small files needed sixty three read tasks and took almost two seconds, three times as long as thirty two files. And scheduling overhead appears as thousands of tasks that each do almost nothing. Two thousand shuffle partitions produced tasks of about a millisecond each. Now look closer at the spill. Sorting through one partition took twenty two seconds, almost all of it in a single twenty second task. Sorting through eight partitions took eight point one seconds. The total spill was nearly identical. What changed was that eight tasks shared it. So the misconception is that spill always means you need more memory. Here, more partitions cut the time by sixty three percent with exactly the same memory.",
}
