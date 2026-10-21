"""Three ways to parse "12,50": a built-in, a Python UDF, a pandas UDF."""
import contextlib
import io

import pandas as pd
from pyspark.sql import functions as F

from pipeline.session import build_session

spark = build_session("udfs")
raw = spark.createDataFrame([("40.00",), ("12,50",)], ["amount"])


@F.udf("double")
def python_parse(text):  # runs in a Python worker, one row at a time
    return float(text.replace(",", "."))


@F.pandas_udf("double")
def pandas_parse(text: pd.Series) -> pd.Series:  # a batch at a time, via Arrow
    return text.str.replace(",", ".").astype(float)


def operators(df):
    with contextlib.redirect_stdout(io.StringIO()) as plan:
        df.explain()
    return [line.strip(" +-*()0123456789").split(" ")[0]
            for line in plan.getvalue().splitlines()[1:] if line.strip()]


builtin = F.regexp_replace("amount", ",", ".").cast("decimal(10,2)")
for name, column in [("built-in", builtin), ("udf", python_parse("amount")),
                     ("pandas_udf", pandas_parse("amount"))]:
    df = raw.select(column.alias("parsed"))
    print(f"{name:11}", [row.parsed for row in df.collect()], operators(df))
spark.stop()
