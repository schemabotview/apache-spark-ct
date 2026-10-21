"""The same four files, under different triggers: how many micro-batches?"""
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS
from pipeline.session import build_stream_session
from tools.feed import deliver, fresh, run_once

spark = build_stream_session("triggers")
fresh()
for n in range(4):  # all four files are waiting before the query starts
    deliver(n)
raw = spark.readStream.schema(ORDERS).json("data/stream/in")
events = clean.parse(raw).where("problem IS NULL")
limited = spark.readStream.schema(ORDERS).option("maxFilesPerTrigger", 1)
one_by_one = (clean.parse(limited.json("data/stream/in"))
              .where("problem IS NULL"))

runs = [("availableNow", events), ("availableNow, 1 file", one_by_one)]
for name, df in runs:
    checkpoint = f"data/stream/checkpoints/{name.replace(' ', '')}"
    fresh_query = df.writeStream.format("memory").queryName(name.split(",")[0])
    query = run_once(fresh_query, checkpoint)
    # files that land together may be taken in any order: sort the sizes
    batches = sorted(p["numInputRows"] for p in query.recentProgress)
    print(f"{name:22} {len(batches)} batch(es), rows per batch {batches}")
spark.stop()
