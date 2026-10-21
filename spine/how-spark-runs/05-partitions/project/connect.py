import os
import sys

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

os.environ["SPARK_CONF_DIR"] = "conf"
builder = SparkSession.builder.appName("connect")
if sys.argv[1] == "connect":
    builder = builder.remote("local[4]")  # a local Spark Connect server
else:
    builder = builder.master("local[4]")  # classic: a driver in this process
spark = builder.getOrCreate()
print(type(spark).__module__)

orders = spark.read.schema("order_id STRING, status STRING").json("orders.json")
print(orders.filter(F.col("status") == "COMPLETED").count(), "completed orders")
try:
    print("task slots:", spark.sparkContext.defaultParallelism)
except Exception as error:
    print(type(error).__name__, error.getCondition())
spark.stop()
