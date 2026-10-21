"""A crash after writing, before committing: two writers, one replay."""
from pathlib import Path

from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

spark = build_stream_session("delivery")
fresh("data/stream/checkpoints/append", "data/stream/checkpoints/by_batch",
      "data/out/append", "data/out/by_batch", "data/stream/crashed")
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL").select("order_id", "amount")


def crash_once(batch_id, sink):  # die after writing batch 2, the first time
    marker = Path(f"data/stream/crashed/{sink}")
    if batch_id == 2 and not marker.exists():
        marker.parent.mkdir(exist_ok=True)
        marker.touch()
        raise RuntimeError(f"crashed after writing batch {batch_id}")


def append(batch, batch_id):  # adds rows: a replay adds them again
    batch.write.mode("append").json("data/out/append")
    crash_once(batch_id, "append")


# replaces this batch's folder, so a replay is harmless
def by_batch(batch, batch_id):
    batch.write.mode("overwrite").json(f"data/out/by_batch/batch={batch_id}")
    crash_once(batch_id, "by_batch")


for n in range(4):
    deliver(n)
    for name, writer in [("append", append), ("by_batch", by_batch)]:
        sink = events.writeStream.foreachBatch(writer)
        try:
            run_once(sink, f"data/stream/checkpoints/{name}")
        except Exception:
            print(f"{name}: crashed in batch 2; restarting")
            run_once(sink, f"data/stream/checkpoints/{name}")  # batch 2 again
for name in ["append", "by_batch"]:
    rows = spark.read.json(f"data/out/{name}").count()
    print(f"{name}: {rows} rows for 10 events")
spark.stop()
