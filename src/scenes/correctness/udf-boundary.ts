import type { Scene } from '@graphlearning/flow'

// §4.8 — one transformation three ways, with the physical plan node each produced in 4.0.1 and the
// two silent behaviours a Python UDF showed on NULL input and on a mismatched return type.
export const udfBoundary: Scene = {
  id: 'udf-boundary',
  title: 'Built-ins, Python UDFs, pandas UDFs',
  flow: 'TB',
  nodes: [
    {
      id: 'udf-code',
      kind: 'code',
      filename: 'udfs.py',
      label: `up = udf(lambda s: s.upper(), "string")
df.select(up("status"))
# PythonException: AttributeError:
#   'NoneType' object has no attribute 'upper'

length = udf(lambda s: len(s) if s else 0, "string")
# no error: returns the string '9'

@pandas_udf("string")
def up_pd(s: pd.Series) -> pd.Series:
    return s.str.upper()     # NULL stays NULL`,
    },
    {
      id: 'udf-plans',
      kind: 'code',
      filename: 'explain(): plan node',
      label: `F.upper   Project [upper(status)]
udf       BatchEvalPython [<lambda>(status)]
pandas    ArrowEvalPython [up_pd(status)]`,
    },
  ],
  edges: [{ source: 'udf-code', target: 'udf-plans', label: 'explain()' }],
}
