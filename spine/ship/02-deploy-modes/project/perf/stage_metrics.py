"""Where the time went: every stage's metrics from Spark's monitoring API."""
import json
from urllib.request import urlopen

from explore.planview import generated
from pipeline import summarise
from pipeline.session import build_session
from tools.bench import run

spark = build_session("stage-metrics")
orders, stores = generated(spark)
run(summarise.daily_sales(orders.join(stores, "store_id")))

sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"
print("stage tasks   run ms   input MB  shuffle KB")
for s in sorted(json.load(urlopen(api)), key=lambda s: -s["executorRunTime"]):
    mb, kb = s["inputBytes"] / 2**20, s["shuffleWriteBytes"] / 2**10
    print(f"{s['stageId']:5} {s['numTasks']:5} {s['executorRunTime']:8}"
          f" {mb:10.1f} {kb:11.1f}")
spark.stop()
