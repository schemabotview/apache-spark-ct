"""Daily sales: completed orders per city and day."""
import os

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
spark = (
    SparkSession.builder.master("local[4]")
    .appName("daily-sales")
    .getOrCreate()
)

orders = spark.createDataFrame(
    [
        ("o1", 7, 40.00, "COMPLETED"),
        ("o2", 7, 25.00, "COMPLETED"),
        ("o3", 9, 60.00, "CANCELLED"),
        ("o4", 9, 15.00, "COMPLETED"),
        ("o5", 12, 80.00, "COMPLETED"),
        ("o6", 7, 10.00, "PENDING"),
    ],
    ["order_id", "store_id", "amount", "status"],
)
print(orders.dtypes)
orders.show(3)

spark.stop()
