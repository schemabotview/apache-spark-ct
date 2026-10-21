import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

from sample import ORDERS, SCHEMA

os.environ["SPARK_CONF_DIR"] = "conf"
spark = SparkSession.builder.master("local[4]").getOrCreate()
orders = spark.createDataFrame(ORDERS, SCHEMA)

# Narrow: filter and select work on each partition where it is
completed = orders.filter(F.col("status") == "COMPLETED")
completed = completed.select("store_id", "amount")

# Wide: every row of one store must meet in the same partition
sales = completed.groupBy("store_id").agg(F.sum("amount").alias("sales"))
sales.explain()
spark.stop()
