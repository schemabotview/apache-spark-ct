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
orders = spark.read.schema(ORDERS).json("data/raw/orders")
stores = (
    spark.read.option("header", True)
    .schema("store_id INT, city STRING")
    .csv("data/raw/stores.csv")
)

# The same orders as Parquet: columnar, compressed, schema inside the file
orders.write.mode("overwrite").parquet("data/tmp/orders")
copy = spark.read.parquet("data/tmp/orders")
print(copy.dtypes)
completed = copy.filter(F.col("status") == "COMPLETED").select("amount")
completed.explain()

spark.stop()
