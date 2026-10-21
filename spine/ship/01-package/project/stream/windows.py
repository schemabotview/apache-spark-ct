"""Ten-minute windows of event time, with no limit on lateness."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/windows"
spark = build_stream_session("windows")
fresh(CHECKPOINT)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
windows = events.groupBy(F.window("event_time", "10 minutes")).agg(
    F.sum("amount").alias("sales"))


def show(batch, batch_id):
    rows = batch.orderBy("window").collect()
    print(f"batch {batch_id}:", "  ".join(f"{r.window.start:%H:%M} {r.sales}"
                                          for r in rows))


for n in range(4):
    deliver(n)
    writer = windows.writeStream.outputMode("complete").foreachBatch(show)
    run_once(writer, CHECKPOINT)
spark.stop()
