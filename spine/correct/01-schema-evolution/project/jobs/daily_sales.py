"""Daily sales: completed orders per city and day."""
from pyspark.sql import functions as F

from pipeline.schemas import ORDERS
from pipeline.session import build_session

spark = build_session("daily-sales")

found = spark.read.json("data/raw/orders").columns  # what the files hold
print("fields in the files:", found)

orders = spark.read.schema(ORDERS).json("data/raw/orders")  # what we expect
by_day = orders.groupBy(F.to_date("event_time").alias("day"), "channel")
by_day.count().orderBy("day", "channel").show()

spark.stop()
