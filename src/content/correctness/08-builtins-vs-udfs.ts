import type { Section } from '../types'

export const builtinsVsUdfs: Section = {
  id: 'builtins-vs-udfs',
  title: 'Built-in functions versus Python UDFs; Arrow and pandas UDFs',
  scene: 'udf-boundary',
  focus: 'udf-plans',
  slide: `## Built-ins, Python UDFs, pandas UDFs

### Where the work happens
- **Built-in** \`F.upper\`: stays in the engine — a plain \`Project\`
- **Python UDF**: rows go to Python workers — \`BatchEvalPython\`
- **pandas UDF**: batches go as **Arrow** columns — \`ArrowEvalPython\`

### What the Python UDF did on our data
- NULL status arrives as \`None\`: the job fails with an **AttributeError**
- Declared \`"string"\`, returned an int: **no error**, the value \`'9'\`

**Rule of thumb:** built-in first, pandas UDF next, row-at-a-time Python UDF last.

### The misconception
"A UDF is just a function." The optimizer **cannot see inside** it.`,
  narration:
    "Sometimes you need logic that you can express in Python in one line, and it is tempting to wrap it in a user defined function. Before you do, look at what the plan says. The same uppercase operation was written three ways. The built-in upper function appears in the plan as a plain projection, inside the engine. The Python UDF adds a node called batch eval python, which means every row is sent out of the engine to a Python worker process and back. The pandas UDF adds arrow eval python instead. It also leaves the engine, but it ships whole columns in Apache Arrow format and hands your function a pandas series, which is far cheaper per row. Now look at what the Python UDF did with our data. Order nine has a null status, which arrives in Python as None, and calling upper on None raised an attribute error that failed the job. The built-in and the pandas version both simply returned null. A second UDF claimed to return a string but actually returned an integer length. There was no error at all. Spark quietly converted it and returned the text nine. So the rule of thumb is: built-in functions first, a pandas UDF when no built-in exists, and a row at a time Python UDF only as a last resort. The underlying reason is the misconception itself. A UDF is not just a function to the engine. It is a black box the optimizer cannot see inside.",
}
