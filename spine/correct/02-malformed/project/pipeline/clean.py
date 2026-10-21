"""Parse, validate and deduplicate the raw order events."""
from pyspark.sql import DataFrame, Window
from pyspark.sql import functions as F


def parse(raw: DataFrame) -> DataFrame:
    """Add `problem`: why a row cannot be used, or NULL when it can."""
    problem = (
        F.when(F.col("_corrupt_record").isNotNull(), "not valid JSON")
        .when(F.col("amount").isNull(), "no amount")
        .when(F.col("status").isNull(), "no status")
    )
    return raw.withColumn("problem", problem)
