"""When an order happened, against when the pipeline saw it."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/event_time"
spark = build_stream_session("event-time")
fresh(CHECKPOINT)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")


def show(batch, batch_id):  # no aggregation: each batch is just its new rows
    rows = batch.orderBy("event_time").collect()
    print(f"batch {batch_id}:", "  ".join(f"{r.order_id} {r.event_time:%H:%M}"
                                          for r in rows))


for n in range(4):
    deliver(n)
    run_once(events.writeStream.foreachBatch(show), CHECKPOINT)
spark.stop()
