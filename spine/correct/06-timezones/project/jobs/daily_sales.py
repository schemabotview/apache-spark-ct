"""Daily sales: completed orders per city and day."""
from pyspark.sql import functions as F

from pipeline import clean, enrich, summarise
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_session

spark = build_session("daily-sales")
raw = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

orders = enrich.with_city(clean.latest(clean.parse(raw)), stores)
orders = orders.where("problem IS NULL")
o15 = orders.where("order_id = 'o15'").select(
    "event_time",
    F.to_date("event_time").alias("utc_day"),
    summarise.shop_day().alias("shop_day"),
)
print(o15.first())
summarise.daily_sales(orders).where("city = 'Leeds'").orderBy("day").show()

spark.stop()
