"""Daily sales: completed orders per city and day."""
import os
from decimal import Decimal

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

priced = orders.select(
    "order_id",
    "amount",
    (F.col("amount") * 0.2).alias("vat_double"),
    (F.col("amount") * F.lit(Decimal("0.20"))).alias("vat"),
).withColumn("gross", F.col("amount") + F.col("vat"))
print(priced.dtypes)
priced.show(3)

spark.stop()
