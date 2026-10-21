"""Read one day: partition pruning and file sizes, measured in bytes read."""
import json
from urllib.request import urlopen

from pyspark.sql import functions as F

from explore.planview import generated
from pipeline.session import build_session
from tools.bench import run

spark = build_session("layout")
orders, _ = generated(spark)
dated = orders.withColumn("day", F.to_date("event_time"))
dated.write.mode("overwrite").partitionBy("day").parquet("data/tmp/by_day")
orders.repartition(2000).write.mode("overwrite").parquet("data/tmp/small")
sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"

by_day = spark.read.parquet("data/tmp/by_day")
small = spark.read.parquet("data/tmp/small")
layouts = [("one folder", dated, "day = '2026-10-07'"),
           ("by day", by_day, "day = '2026-10-07'"),
           ("2,000 files", small, "amount > 99")]
for name, df, condition in layouts:
    before = {s["stageId"] for s in json.load(urlopen(api))}
    run(df.where(condition))
    new = [s for s in json.load(urlopen(api)) if s["stageId"] not in before]
    read = sum(s["inputBytes"] for s in new) / 2**20
    tasks = sum(s["numTasks"] for s in new)
    print(f"{name:12} {condition:22} read {read:5.1f} MB in {tasks:4} tasks")
spark.stop()
