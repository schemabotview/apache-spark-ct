"""The engine's own account of each micro-batch: lastProgress."""
import json

from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

CHECKPOINT = "data/stream/checkpoints/progress"
spark = build_stream_session("progress")
fresh(CHECKPOINT)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
totals = events.groupBy("store_id").agg(F.sum("amount").alias("sales"))
sink = totals.writeStream.outputMode("complete").format("noop")

for n in range(4):
    name = deliver(n)
    p = run_once(sink, CHECKPOINT).lastProgress  # a dict: one batch, measured
    offset = json.loads(p["sources"][0]["endOffset"])["logOffset"]
    state = p["stateOperators"][0]["numRowsTotal"]
    print(f"{name}: batch {p['batchId']}, {p['numInputRows']} rows in,"
          f" source offset {offset}, {state} rows of state")
spark.stop()
