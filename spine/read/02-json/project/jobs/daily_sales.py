"""Daily sales: completed orders per city and day."""
import os

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
spark = (
    SparkSession.builder.master("local[4]")
    .appName("daily-sales")
    .getOrCreate()
)

orders = spark.read.json("data/raw/orders")  # every file in the folder
orders.printSchema()

tracker = spark.sparkContext.statusTracker()
print("jobs run:", sorted(tracker.getJobIdsForGroup()))

spark.stop()
