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
stores = (
    spark.read.option("header", True)
    .schema("store_id INT, city STRING")
    .csv("data/raw/stores.csv")
)
stores.show()

guessed = spark.read.csv("data/raw/stores.csv")  # no header, no schema
print(guessed.dtypes)

spark.stop()
