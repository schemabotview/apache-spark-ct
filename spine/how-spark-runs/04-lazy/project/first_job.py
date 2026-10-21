import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

os.environ["SPARK_CONF_DIR"] = "conf"  # quiet logs, no progress bar: see conf/
spark = SparkSession.builder.master("local[4]").getOrCreate()
print("Spark", spark.version)

orders = spark.read.schema(
    "order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING"
).json("orders.json")
completed = orders.filter(F.col("status") == "COMPLETED")
sales = completed.groupBy("store_id").agg(F.sum("amount").alias("sales"))
sales.orderBy("store_id").show()

spark.stop()
