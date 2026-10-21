"""Orders joined to a table (stores) and to another stream (payments)."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/joins"
spark = build_stream_session("joins")
fresh(CHECKPOINT)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
orders = clean.parse(raw).where("problem IS NULL")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)
with_city = orders.join(stores, "store_id")  # stream-static: stores re-read

payments = (spark.readStream.schema("paid_order STRING, paid_at TIMESTAMP")
            .json("data/stream/payments")
            .withWatermark("paid_at", "30 minutes"))
orders = with_city.withWatermark("event_time", "10 minutes")
paid = orders.join(payments, F.expr(
    "order_id = paid_order AND paid_at BETWEEN event_time"
    " AND event_time + INTERVAL 30 MINUTES"))  # bounded: state can be dropped


def show(batch, batch_id):
    for r in batch.orderBy("order_id").collect():
        print(f"  batch {batch_id}: {r.order_id} {r.city} {r.event_time:%H:%M},"
              f" paid {r.paid_at:%H:%M}")


for n in range(4):
    print(deliver(n))
    run_once(paid.writeStream.foreachBatch(show), CHECKPOINT)
spark.stop()
