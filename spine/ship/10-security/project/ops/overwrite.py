"""Overwrite a Parquet folder with a job that fails halfway: what is left?"""
from pathlib import Path

from pyspark.sql import functions as F

from pipeline.session import build_session

OUT = "data/out/summary"
spark = build_session("overwrite")
spark.range(6).withColumn("day", F.lit("2026-10-01")).write.mode(
    "overwrite").parquet(OUT)
print("before:", spark.read.parquet(OUT).count(), "rows")

broken = spark.range(6, numPartitions=1)  # one task, so one failure to report
broken = broken.withColumn("x", F.lit(1) / (F.col("id") - 3))  # 1/0 at id 3
try:
    broken.write.mode("overwrite").parquet(OUT)
except Exception as error:
    print("overwrite failed:", type(error).__name__)
print("after:  the folder holds", sorted(p.name for p in Path(OUT).iterdir()))
try:
    spark.read.parquet(OUT).count()
except Exception as error:
    print("reading it:", str(error).split("]")[0] + "]")
spark.stop()
