"""Parse, validate and deduplicate the raw order events."""
from pyspark.sql import DataFrame, Window
from pyspark.sql import functions as F


def parse(raw: DataFrame) -> DataFrame:
    """Typed amount, and `problem`: why a row cannot be used, or NULL."""
    amount = F.expr("try_cast(amount AS DECIMAL(10,2))")  # NULL if not a number
    problem = (
        F.when(F.col("_corrupt_record").isNotNull(), "not valid JSON")
        .when(F.col("amount").isNull(), "no amount")
        .when(amount.isNull(), "amount is not a number")
        .when(F.col("status").isNull(), "no status")
    )
    return raw.withColumn("problem", problem).withColumn("amount", amount)
