"""Stop, and start again: the checkpoint remembers where the query was."""
import sys

from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/restart"
spark = build_stream_session("checkpoint")
if sys.argv[1] == "first":  # the first run starts from nothing
    fresh(CHECKPOINT)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
totals = events.groupBy("store_id").agg(F.sum("amount").alias("sales"))


def show(batch, batch_id):
    rows = batch.orderBy("store_id").collect()
    totals = ", ".join(f"{r.store_id}: {r.sales}" for r in rows)
    print(f"  batch {batch_id}:", totals)


for n in [0, 1] if sys.argv[1] == "first" else [2, 3]:
    deliver(n)
    writer = totals.writeStream.outputMode("complete").foreachBatch(show)
    run_once(writer, CHECKPOINT)
spark.stop()
