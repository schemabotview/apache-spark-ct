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
enriched = completed.join(stores, on="store_id", how="inner")
daily = (
    enriched.groupBy(F.to_date("event_time").alias("day"), "city")
    .agg(F.sum("amount").alias("sales"), F.count("*").alias("orders"))
)
daily.write.mode("overwrite").parquet("data/out/daily_sales")

back = spark.read.parquet("data/out/daily_sales")
print(back.count(), "rows read back:", back.dtypes)

spark.stop()
