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

ORDERS = (
    "order_id STRING, store_id INT, amount DECIMAL(10,2),"
    " status STRING, event_time TIMESTAMP"
)
STORES = "store_id INT, city STRING"
orders = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

shaped = orders.select(
    "order_id",
    F.to_date("event_time").alias("day"),
    F.hour("event_time").alias("hour"),
    F.lower("status").alias("status"),
    F.when(F.col("status") == "COMPLETED", F.col("amount"))
    .otherwise(0)
    .alias("sale"),
)
shaped.show()

spark.stop()
