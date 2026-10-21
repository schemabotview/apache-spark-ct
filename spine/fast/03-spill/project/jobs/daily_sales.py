"""Daily sales: completed orders per city and day."""

from pipeline import clean, enrich, quality, summarise
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_session

spark = build_session("daily-sales")
raw = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

orders = enrich.with_city(clean.latest(clean.parse(raw)), stores).cache()
daily = summarise.daily_sales(orders.where("problem IS NULL"))

for line in quality.check(orders, daily):
    print("✓", line)
rejected = orders.where("problem IS NOT NULL")
rejected.select("order_id", "problem").orderBy("order_id").show(truncate=False)

rejected.write.mode("overwrite").json("data/out/rejected")
daily.write.mode("overwrite").partitionBy("day").parquet("data/out/daily_sales")
spark.stop()
