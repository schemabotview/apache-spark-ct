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

rows = daily.orderBy("day", "city").collect()  # every row, into this process
print(len(rows), "rows; the first:", rows[0])
print("take(2):", [row.city for row in daily.orderBy("sales").take(2)])

with_city = daily.where("city = 'Leeds'").count()  # the count comes back,
print("Leeds days:", with_city)  # not the rows

spark.stop()
