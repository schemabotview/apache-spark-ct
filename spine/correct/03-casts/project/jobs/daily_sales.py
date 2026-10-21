"""Daily sales: completed orders per city and day."""

from pipeline import clean
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_session

spark = build_session("daily-sales")
raw = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

orders = clean.parse(raw)
orders.groupBy("problem").count().orderBy("problem").show()

spark.stop()
