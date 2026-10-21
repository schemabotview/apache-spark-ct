"""Daily sales: completed orders per city and day."""
from pyspark.sql import functions as F

from pipeline import clean, enrich
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_session

spark = build_session("daily-sales")
raw = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

orders = clean.parse(raw).where("problem IS NULL")
orders = orders.where("status = 'COMPLETED'")
joined = orders.join(stores, on="store_id")
print(orders.count(), "completed orders;", joined.count(), "after the join")
by_city = joined.groupBy("city").agg(F.sum("amount").alias("sales"))
by_city.orderBy("city").show()

enriched = enrich.with_city(orders, stores)  # refuses a doubled store

spark.stop()
