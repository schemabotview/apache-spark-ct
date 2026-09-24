import type { Section } from '../types'

export const twoProcesses: Section = {
  id: 'two-processes',
  title: 'Two processes, not one program',
  scene: 'pyb-two-processes',
  focus: 'cluster',
  slide: `## Two processes, not one program

On every worker node there are **two operating-system processes**:

| | |
|---|---|
| **The JVM** | the engine. Your data lives here. |
| **A Python process** | idle, until you need it |

They aren't one program with two languages in it. They're separate processes that talk **over a socket.**

### Which makes every question in this course the same question
> **Does a row have to leave the JVM?**

If no, PySpark runs at Scala speed. If yes, you pay — and the whole course is about how much, and how to pay less.

That's the entire framing. Everything that follows is a consequence of it.`,
  narration:
    "Here's the thing to understand before anything else, because every PySpark performance question reduces to it. When you run PySpark on a cluster, each worker node is running two separate operating-system processes. There's a JVM — that's the actual Spark engine, and it's where your data lives, as those compact binary rows. And there's a Python process, sitting there, usually idle. These are not one program that happens to speak two languages. They're two processes, with separate memory, separate garbage collection, separate everything, communicating over a socket. That's a real boundary with a real cost, in the same way that calling a web service is more expensive than calling a function. So every question in this course is the same question, asked about different code: does a row have to leave the JVM? If the answer is no, your PySpark runs at exactly the same speed as Scala, because the Python process never wakes up and your rows never move. If the answer is yes, you pay — and the rest of this course is about how much you pay, why, and what to do about it. That's the whole framing, and I'd encourage you to hold it while we go through the details, because it makes a set of otherwise-arbitrary performance advice fall into place. The reason people find PySpark performance confusing is that it has two completely different modes with a roughly tenfold gap between them, and nothing in the API tells you which one you're in.",
}
