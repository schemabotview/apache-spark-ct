"""Generate orders like the shops' events, as Parquet, for plans and timings."""
import sys

from pyspark.sql import functions as F

from pipeline.session import build_session

N = int(sys.argv[1]) if len(sys.argv) > 1 else 1_000_000
OCTOBER = 1790812800  # 2026-10-01T00:00:00Z, in seconds: N orders over 30 days
CITIES = ["Leeds", "York", "Hull", "Bradford", "Wakefield"]

spark = build_session("make-orders")
id, cities = F.col("id"), F.array(*map(F.lit, CITIES))
orders = spark.range(N, numPartitions=8).select(
    F.format_string("g%08d", id).alias("order_id"),
    (id % 50 + 1).cast("int").alias("store_id"),
    (F.rand(7) * 95 + 5).cast("decimal(10,2)").alias("amount"),
    F.when(F.rand(11) < 0.8, "COMPLETED")
    .otherwise("CANCELLED")
    .alias("status"),
    F.timestamp_seconds(OCTOBER + (id * 2_592_000 / N).cast("long"))
    .alias("event_time"),
)
orders.write.mode("overwrite").parquet("data/gen/orders")
stores = spark.range(1, 51).select(
    id.cast("int").alias("store_id"),
    F.element_at(cities, (id % 5 + 1).cast("int")).alias("city"),
)
stores.coalesce(1).write.mode("overwrite").csv("data/gen/stores", header=True)

written = spark.read.parquet("data/gen/orders")
print(f"{written.count():,} orders in {len(written.inputFiles())} files")
spark.stop()
