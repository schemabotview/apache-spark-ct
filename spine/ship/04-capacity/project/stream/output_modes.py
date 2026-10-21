"""One windowed query, three output modes: what each writes per batch."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

spark = build_stream_session("output-modes")
MODES = ["append", "update", "complete"]
fresh(*(f"data/stream/checkpoints/{m}" for m in MODES))
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
windows = (events.withWatermark("event_time", "10 minutes")
           .groupBy(F.window("event_time", "10 minutes"))
           .agg(F.sum("amount").alias("sales")))

written = {}


def counter(mode):
    def count(batch, batch_id):  # how many rows this mode hands the sink
        written[mode] = written.get(mode, 0) + batch.count()
    return count


for n in range(4):
    name = deliver(n)
    for mode in ["append", "update", "complete"]:
        sink = windows.writeStream.outputMode(mode).foreachBatch(counter(mode))
        run_once(sink, f"data/stream/checkpoints/{mode}")
    print(f"{name}: rows written so far", written)
spark.stop()
