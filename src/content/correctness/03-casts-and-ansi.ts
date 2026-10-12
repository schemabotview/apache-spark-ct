import type { Section } from '../types'

export const castsAndAnsi: Section = {
  id: 'casts-and-ansi',
  title: 'Type conversion, numeric errors and ANSI mode',
  scene: 'ansi-casts',
  focus: 'ansi-table',
  slide: `## Casts, numeric errors, ANSI mode

Since **Spark 4.0**, \`spark.sql.ansi.enabled\` is **on by default**: bad casts and overflow **fail** instead of returning NULL or wrapping.

### Worked: the same expressions, two modes
- \`CAST('12,50' AS DECIMAL)\`: \`CAST_INVALID_INPUT\` vs **NULL**
- \`2147483647 + 1\`: \`ARITHMETIC_OVERFLOW\` vs **-2147483648**
- \`10 / 0\`: \`DIVIDE_BY_ZERO\` vs **NULL**

### Choosing deliberately
- \`try_cast\`, \`try_add\`, \`try_divide\`: NULL **on purpose**, one expression at a time
- Widen before adding: \`CAST(… AS BIGINT) + 1\` = 2147483648
- Money in \`DECIMAL\`: as doubles, 0.1 + 0.2 = **0.30000000000000004**

### The misconception
"Turn ANSI off to fix the error." That hides the bad value as a NULL or a **wrapped** number.`,
  narration:
    "Spark four changed a default that affects every pipeline: ANSI mode is now on. The migration guide says so directly. To see what it means, look at the table: four expressions, run with ANSI on and then off. Casting the string twelve comma fifty to a decimal now fails with cast invalid input. Adding one to the largest integer fails with arithmetic overflow. Dividing by zero fails with divide by zero. Fitting one two three point four five six into a decimal with four digits fails as out of range. With ANSI off, the same four expressions do not fail. Three return null, and the overflow wraps around to minus two billion, a perfectly valid looking number that is completely wrong. That is why turning ANSI off to make an error go away is the misconception to avoid. The error was telling you about a bad value, and switching it off turns that value into a null or a wrapped number that flows into your totals. If you genuinely want null for bad input, say so per expression. Try cast, try add and try divide return null on purpose, and leave every other expression strict. If a value can exceed the integer range, widen it first: cast to a big integer, then add. And keep money in decimals. Added as doubles, point one plus point two is point three followed by a long tail of digits. As decimals, it is exactly point three.",
}
