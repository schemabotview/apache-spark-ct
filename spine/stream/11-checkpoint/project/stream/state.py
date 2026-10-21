"""Dropping duplicates needs memory of orders seen: with and without a bound."""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

spark = build_stream_session("state")
fresh("data/stream/checkpoints/dedup", "data/stream/checkpoints/bounded")
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
forever = events.dropDuplicates(["order_id"])
bounded = (events.withWatermark("event_time", "10 minutes")
           .dropDuplicatesWithinWatermark(["order_id"]))

for n in range(4):
    name, counts = deliver(n), []
    for kind, df in [("dedup", forever), ("bounded", bounded)]:
        sink = df.writeStream.format("noop")
        query = run_once(sink, f"data/stream/checkpoints/{kind}")
        counts.append(query.lastProgress["stateOperators"][0]["numRowsTotal"])
    print(f"after {name}: state rows {counts[0]} without a watermark,"
          f" {counts[1]} with one")
spark.stop()
