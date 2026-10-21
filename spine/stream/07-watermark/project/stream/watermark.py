"""A ten-minute watermark: windows are final once it passes; late rows go."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/watermark"
spark = build_stream_session("watermark")
fresh(CHECKPOINT)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
windows = (events.withWatermark("event_time", "10 minutes")
           .groupBy(F.window("event_time", "10 minutes"))
           .agg(F.sum("amount").alias("sales")))
emitted = {}


def keep(batch, batch_id):  # append mode: only windows that are final
    rows = batch.collect()
    emitted[batch_id] = [f"{r.window.start:%H:%M} {r.sales}" for r in rows]


for n in range(4):
    name = deliver(n)
    writer = windows.writeStream.outputMode("append").foreachBatch(keep)
    query = run_once(writer, CHECKPOINT)
    for p in query.recentProgress:  # a data batch, then one that moves the mark
        mark = p["eventTime"]["watermark"][11:16]
        print(f"{name} batch {p['batchId']}: watermark {mark},"
              f" emitted {emitted[p['batchId']]}")
spark.stop()
