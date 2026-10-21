"""Arrays and structs in an order basket, and the trap in explode()."""
from pyspark.sql import functions as F

from pipeline.session import build_session

spark = build_session("nested")
BASKET = (
    "order_id STRING, amount DECIMAL(10,2),"
    " customer STRUCT<id: STRING, city: STRING>,"
    " items ARRAY<STRUCT<sku: STRING, qty: INT, price: DECIMAL(10,2)>>"
)
baskets = spark.read.schema(BASKET).json("data/raw/baskets")
baskets.select("order_id", "customer.city", F.size("items").alias("n")).show()

lines = baskets.select("order_id", "amount", F.explode("items").alias("item"))
orders_left = lines.select("order_id").distinct().count()
print("explode:", lines.count(), "rows from", orders_left, "orders")
kept = baskets.select("order_id", F.explode_outer("items").alias("item"))
print("explode_outer:", kept.count(), "rows")
print("sum(amount) after explode:", lines.agg(F.sum("amount")).first()[0])
spark.stop()
