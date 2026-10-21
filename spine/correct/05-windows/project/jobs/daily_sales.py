"""Daily sales: completed orders per city and day."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_session

spark = build_session("daily-sales")
raw = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

events = clean.parse(raw)
latest = clean.latest(events)
pick = F.col("order_id").isin("o2", "o4")
for name, df in [("every event", events), ("latest per order", latest)]:
    print(name)
    for row in df.where(pick).orderBy("order_id", "event_time").collect():
        print(" ", row.order_id, row.status, row.event_time.time())
print(events.count(), "events,", latest.count(), "orders")

spark.stop()
