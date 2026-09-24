import type { Section } from '../types'

export const theDecision: Section = {
  id: 'the-decision',
  title: 'The decision, in order',
  scene: 'pyb-decision',
  focus: 'ladder',
  slide: `## The decision, in order

Stop at the first that works. The ordering isn't style — **each rung down gives up something the engine was doing for you.**

| | | Gives up |
|---|---|---|
| **1** | a built-in function | — |
| **2** | a SQL expression | — |
| **3** | a pandas UDF | codegen fusion, pushdown |
| **4** | a plain Python UDF | *and* batching |

Most of what people write UDFs for already exists: \`regexp_extract\`, \`when/otherwise\`, \`split\`, \`from_json\`, date arithmetic. **Check the function list first.**

### And check which one you actually got
The plan names it, so there's no need to guess:

| | |
|---|---|
| \`BatchEvalPython\` | the per-row path |
| \`ArrowEvalPython\` | the vectorised path |

> If you expected a pandas UDF and the plan says \`BatchEvalPython\`, Arrow isn't being used — and that's worth ten seconds to check.`,
  narration:
    "Let's finish with a decision procedure, because the individual facts are only useful if they turn into a habit. Four options, and you stop at the first one that works. First: a built-in function. This is the answer far more often than people expect, and it's worth being blunt about — most of what people write UDFs for already exists. Regular expression extraction, conditional logic with when and otherwise, splitting strings, parsing JSON, date arithmetic, null handling. Spark has hundreds of built-in functions, and every one of them stays in the JVM, fuses into generated code, and can be optimized. Check the function list before you write a UDF. Second: a SQL expression. If there's no single built-in but you can compose the logic from built-ins, that's still a tree Catalyst can read and optimize. Third: a pandas UDF. Now you're leaving the JVM, so you've given up code generation fusion and predicate pushdown — but you're crossing in batches with Arrow, so the transport cost is amortised and your code vectorises. Fourth: a plain Python UDF. Same losses as the pandas UDF, plus you've given up batching too. This is the last resort, not the default. And then verify, because guessing is unnecessary. Run explain and look at the operator name. BatchEvalPython means the per-row path. ArrowEvalPython means the vectorised path. If you wrote what you thought was a pandas UDF and the plan says BatchEvalPython, then Arrow isn't being used — maybe a type isn't supported, maybe a config is off — and that's ten seconds of checking that can be worth an order of magnitude.",
}
