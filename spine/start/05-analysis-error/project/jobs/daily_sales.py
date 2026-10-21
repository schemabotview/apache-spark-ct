"""Daily sales: completed orders per city and day."""
import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
spark = (
    SparkSession.builder.master("local[4]")
    .appName("daily-sales")
    .getOrCreate()
)

orders = spark.createDataFrame(
    [("o1", 7, "40.00"), ("o2", 7, "25.00"), ("o10", 12, "12,50")],
    ["order_id", "store_id", "amount"],
)
priced = orders.select("order_id", F.col("amout").cast("decimal(10,2)"))
print("plan built")
priced.show()

spark.stop()
