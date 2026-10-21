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

completed = orders.filter(F.col("status") == "COMPLETED")
by_store = (
    completed.groupBy("store_id")
    .agg(
        F.sum("amount").alias("sales"),
        F.count("*").alias("orders"),
        F.avg("amount").alias("average"),
    )
    .orderBy("store_id")
)
by_store.show()
print(by_store.dtypes[1:])

spark.stop()
