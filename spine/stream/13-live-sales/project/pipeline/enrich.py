"""Give each order its store's city, and refuse stores that would double it."""
from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def with_city(orders: DataFrame, stores: DataFrame) -> DataFrame:
    """Every order with its city; an unknown store becomes a problem."""
    twice = stores.groupBy("store_id").count().where("count > 1")
    repeated = sorted(row.store_id for row in twice.collect())
    if repeated:
        raise ValueError(f"stores.csv lists store_id {repeated} more than once")
    joined = orders.join(stores, on="store_id", how="left")
    unknown = F.when(F.col("city").isNull(), "unknown store")
    return joined.withColumn("problem", F.coalesce("problem", unknown))
