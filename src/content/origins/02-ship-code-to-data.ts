import type { Section } from '../types'

export const shipCodeToData: Section = {
  id: 'ship-code-to-data',
  title: 'Ship the code to the data',
  scene: 'origins-ship-code',
  focus: 'new',
  slide: `## Ship the code to the data

The idea that makes distributed data processing possible at all — and it's one inversion.

### The old shape
Data lives in a storage array. The program runs on a server. To compute, you **pull the data to the program**.

Fine at gigabytes. At a terabyte over a gigabit link, that's **hours before any work starts.**

### The inversion
Your program is **kilobytes**. Your data is **terabytes**.

**So move the small thing.** Split the data across machines, and send a copy of the program to each one. Each machine reads only its own local block.

- Google, 2003–04: **GFS** and **MapReduce**
- Yahoo's open implementation: **HDFS** and Hadoop MapReduce, Apache 2006

> The network stops being the bottleneck, because almost nothing crosses it.`,
  narration:
    "So work has to be split across machines. But there's a problem that has to be solved before that can work at all, and the solution is one of those ideas that seems obvious only after you've heard it. Think about the traditional shape of computing. Your data lives somewhere — a database, a storage array. Your program runs somewhere else — an application server. To compute anything, you pull the data across the network to where the program is. That's fine when the data is megabytes. It's fine at gigabytes. But picture a terabyte, moving over a gigabit network link. That's hours of transfer before a single useful instruction runs. And you'd do it again tomorrow. Now look at the two things involved. Your program — the actual logic — is tiny. A few kilobytes of compiled code. Your data is enormous. So why are we moving the enormous thing to the tiny thing? Invert it. Split the data across many machines, so each one holds a block of it on its own local disk. Then send a copy of the program to every machine. Each one reads only its own block, from its own disk, at local disk speed, with nothing crossing the network at all. That's ship the code to the data, and it's the foundation everything else sits on. Google published it in 2003 and 2004, as the Google File System and MapReduce. Yahoo built an open implementation, which became HDFS and Hadoop MapReduce, and it landed at Apache in 2006. Spark did not invent this. Spark inherited it — and then changed one specific thing about it.",
}
