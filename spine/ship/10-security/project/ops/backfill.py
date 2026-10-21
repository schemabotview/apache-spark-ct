"""Re-run one day of a partitioned output: static against dynamic overwrite."""
from pathlib import Path

from pipeline.session import build_session

spark = build_session("backfill")
SCHEMA = "day STRING, sales DOUBLE"
days = ["2026-10-01", "2026-10-02", "2026-10-03"]
three_days = spark.createDataFrame([(d, 100.0) for d in days], SCHEMA)
# the backfill: one corrected day
fixed_day = spark.createDataFrame([("2026-10-02", 125.0)], SCHEMA)

for mode in ["static", "dynamic"]:
    out = f"data/out/backfill_{mode}"
    three_days.write.mode("overwrite").partitionBy("day").parquet(out)
    spark.conf.set("spark.sql.sources.partitionOverwriteMode", mode)
    fixed_day.write.mode("overwrite").partitionBy("day").parquet(out)
    folders = sorted(p.name for p in Path(out).glob("day=*"))
    rows = spark.read.parquet(out).orderBy("day").collect()
    print(f"{mode:8} folders {folders}")
    print(f"{'':8} rows   ", [f"{r.day:%m-%d} {r.sales}" for r in rows])
spark.stop()
