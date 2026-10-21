import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

from sample import ORDERS, SCHEMA

os.environ["SPARK_CONF_DIR"] = "conf"
spark = SparkSession.builder.master("local[4]").getOrCreate()
jobs = spark.sparkContext.statusTracker().getJobIdsForGroup

orders = spark.createDataFrame(ORDERS, SCHEMA)
completed = orders.filter(F.col("status") == "COMPLETED")
doubled = completed.select("order_id", (F.col("amount") * 2).alias("double"))
print("after three transformations, jobs run:", sorted(jobs()))

rows = doubled.collect()  # an action: the plan runs now
print([row.order_id for row in rows], "- jobs run:", sorted(jobs()))
rows = doubled.collect()  # the same action again: the plan runs again
print([row.order_id for row in rows], "- jobs run:", sorted(jobs()))
spark.stop()
