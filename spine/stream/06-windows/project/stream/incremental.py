"""The daily total as a query that never ends: each file updates it."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/incremental"
spark = build_stream_session("incremental")
fresh(CHECKPOINT)
# a folder to watch, not a file to read
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
totals = events.groupBy("store_id").agg(F.sum("amount").alias("sales"))


def show(batch, batch_id):  # complete mode: the whole result, every time
    rows = batch.orderBy("store_id").collect()
    totals = ", ".join(f"{r.store_id}: {r.sales}" for r in rows)
    print(f"  batch {batch_id}:", totals)


for n in range(4):
    print(deliver(n), "arrives")
    writer = totals.writeStream.outputMode("complete").foreachBatch(show)
    run_once(writer, CHECKPOINT)
spark.stop()
