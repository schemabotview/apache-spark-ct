import type { Section } from '../types'

export const theUdfCrossing: Section = {
  id: 'the-udf-crossing',
  title: 'The UDF crossing',
  scene: 'pyb-udf-crossing',
  focus: 'exec',
  slide: `## The UDF crossing

\`\`\`python
@udf("string")
def clean(s):
    return s.strip().lower()
\`\`\`

Now Spark has a problem. That function is **Python**. It can't be compiled into a Java loop, translated, or inspected. The only way to run it is to run Python.

### So two things happen
1. The driver **serialises your function** with \`cloudpickle\` — the function *and everything it closes over*
2. On every executor, the idle Python process **wakes up**, and rows start leaving the JVM

### The closure gotcha
\`cloudpickle\` captures what your function references. A UDF that reads a 500 MB local dictionary ships that dictionary **to every task**, repeatedly.

\`\`\`python
lookup = load_big_dict()      # 500 MB, on the driver
@udf("string")
def f(x): return lookup[x]    # now shipped, per task
\`\`\`

> Use \`broadcast()\` for that — once per executor, not once per task.`,
  narration:
    "Here's where it changes. You write a user-defined function — say, one that strips whitespace and lowercases a string — and register it as a UDF. Spark now has a problem it cannot solve cleverly. That function is Python. It's arbitrary Python: it could import a library, open a file, do anything. Spark can't compile it into a Java loop, can't translate it, can't even inspect it to see what it does. The only way to run Python is to run Python. So two things happen. First, on the driver, your function gets serialised using a library called cloudpickle. And cloudpickle is thorough — it captures not just the function but everything the function references from its enclosing scope. Second, on every executor, that idle Python process wakes up, receives your function, and starts receiving rows. Now let me flag the closure gotcha, because it causes real production incidents and the failure is confusing. Suppose you load a lookup dictionary on the driver — five hundred megabytes of reference data — and your UDF refers to it. Cloudpickle sees that reference and includes the whole dictionary in the serialised closure. Which means five hundred megabytes gets shipped with the function. Not once per executor — potentially once per task, and you might have thousands of tasks. Jobs die at startup, or crawl, and the code looks completely innocent. The fix is to wrap that data in a broadcast variable, which Spark ships once per executor and caches. But the general lesson is: look at what your UDF closes over, because all of it is travelling.",
}
