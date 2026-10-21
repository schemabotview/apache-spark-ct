"""Daily sales: completed orders per city and day."""
import os

from pyspark.sql import SparkSession

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
orders = spark.read.schema(ORDERS).json("data/raw/orders")
orders.printSchema()

tracker = spark.sparkContext.statusTracker()
print("jobs run:", sorted(tracker.getJobIdsForGroup()))
print(orders.first())

spark.stop()
