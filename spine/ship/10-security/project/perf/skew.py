"""One hot store: the slowest task of a skewed join, and two remedies."""
import json
from urllib.request import urlopen

from pyspark.sql import functions as F

from pipeline.session import build_session
from tools.bench import run

spark = build_session("skew")
skewed = spark.read.parquet("data/gen/skewed")  # store 7: half the orders
targets = skewed.groupBy("store_id").agg(F.avg("amount").alias("target"))
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")  # a shuffle join
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "false")
sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"

SALTS = 16  # store 7's rows spread over 16 keys instead of one
salt = (F.rand(3) * SALTS).cast("int").alias("salt")
salted = skewed.select("*", salt).join(
    targets.crossJoin(spark.range(SALTS).toDF("salt")), ["store_id", "salt"])
plain = skewed.join(targets, "store_id")
TRIES = [("plain", plain, "false"), ("AQE skew join", plain, "true"),
         ("salted", salted, "false")]
for name, df, aqe in TRIES:
    spark.conf.set("spark.sql.adaptive.skewJoin.enabled", aqe)
    run(df)
    join = max(json.load(urlopen(api)), key=lambda s: s["stageId"])
    attempt = f"{api}/{join['stageId']}/{join['attemptId']}"
    url = f"{attempt}/taskSummary?quantiles=0.5,1"
    tasks = json.load(urlopen(url))
    median, slowest = tasks["executorRunTime"]
    biggest = tasks["shuffleReadMetrics"]["readBytes"][1] / 2**20
    print(f"{name:13} median {median:3.0f} ms, slowest {slowest:5.0f} ms,"
          f" largest partition {biggest:4.1f} MB")
spark.stop()
